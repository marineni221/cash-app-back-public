const Controller = require("./controller");
const {
  handleErrors,
  handleValidationErrors,
} = require("../middleware/handle-errors");
const { validationResult, body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { generateRandomString, generateOTP } = require("../helpers/helpers");

const PaymentCampaign = require("../models/PaymentCampaign");
const Payment = require("../models/Payment");
const WalletProvider = require("../models/WalletProvider");
const sequelize = require("../models/init_db");
const {
  customValidateCreateCampaign,
} = require("../validations/campaign.validation");
const { storagePath } = require("../helpers/storage_helpers");
const { join } = require("path");
const { rename } = require("fs");
const ExcelReader = require("../helpers/read_excel_file");
const { Op } = require("sequelize");

class PaymentCampaignController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */
  async create(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const {
        name,
        description,
        date,
        account_id,
        dispatch_type,
        wallet_provider,
        contacts_file,
      } = request.body;
      console.log("contacts_file => ", contacts_file);

      const validationErrors = await customValidateCreateCampaign({
        account_id,
        dispatch_type,
        wallet_provider,
        contacts_file,
      });

      if (validationErrors) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: validationErrors,
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });
      }

      const contacts = ExcelReader.getData(contacts_file.path);

      let scheduleDate;
      if (date === "now") {
        scheduleDate = new Date();
      } else {
        scheduleDate = new Date(date);
      }

      const generatedFilename = generateRandomString(36);

      const result = await sequelize.transaction(async (t) => {
        const createdCampaign = await PaymentCampaign.create(
          {
            name: name,
            description: description,
            dispatch_type: dispatch_type,
            dispatch_date: scheduleDate,
            account_id: account_id,
            filename: generatedFilename,
            status: "inprogress",
            wallet_provider: wallet_provider,
          },
          { transaction: t }
        );

        const createdContacts = await Promise.all(
          contacts.map(async (contact) => {
            const walletProvider = await WalletProvider.findOne({
              where: { code: contact.wallet },
            });
            const reference = `D${String(
              Math.floor(Math.random() * 22)
            ).padStart(2, "0")} ${generateOTP(6)} ${generateOTP(
              5
            )} ${generateOTP(5)}`;

            const newContact = await Payment.create(
              {
                firstname: contact.firstname,
                lastname: contact.lastname,
                phone: contact.phone,
                wallet_provider_id: walletProvider.id,
                payment_campaign_id: createdCampaign.id,
                amount: contact.amount,
                status: "pending",
                reference,
              },
              { transaction: t }
            );

            return newContact;
          })
        );

        return { ...createdCampaign.dataValues, payments: createdContacts };
      });

      const oldPath = contacts_file.path;
      const filename = contacts_file.originalFilename;
      const extension = filename.slice(filename.lastIndexOf("."));
      const campaignsStoragePath = join(
        storagePath(),
        "campaigns",
        generatedFilename + extension
      );

      rename(oldPath, campaignsStoragePath, (err) => {
        if (err) {
          throw err;
        }
      });

      return Controller.successResponse({
        response,
        data: result,
        message: "Campaign Successfully created !",
        statusCode: StatusCodes.CREATED,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }

  /**
   *
   * @param {Request} _
   * @param {Response} response
   * @returns
   */
  async all(_, response) {
    try {
      const campaigns = await PaymentCampaign.findAll({
        include: [
          {
            model: Payment,
            as: "payments",
            include: [{ model: WalletProvider, as: "walletProvider" }],
          },
        ],
      });
      return Controller.successResponse({
        response,
        data: campaigns,
        message: "Campaigns retrieved Successfully!",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }

  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */
  async searchByName(request, response) {
    try {
      const name = request.params.name;
      const campaign = await PaymentCampaign.findOne({ where: { name } });
      if (campaign) {
        return Controller.successResponse({
          response,
          data: campaign,
          message: "Campaign retrieved Successfully!",
          statusCode: StatusCodes.OK,
        });
      }

      return Controller.successResponse({
        response,
        data: campaign,
        message: "Campaign not found!",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }

  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */
  async searchNameLike(request, response) {
    try {
      const name = request.params.name;
      const campaigns = await PaymentCampaign.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        include: [
          {
            model: Payment,
            as: "payments",
            include: [{ model: WalletProvider, as: "walletProvider" }],
          },
        ],
      });

      if (campaigns.length > 0) {
        return Controller.successResponse({
          response,
          data: campaigns,
          message: "Campaigns retrieved Successfully!",
          statusCode: StatusCodes.OK,
        });
      }

      return Controller.successResponse({
        response,
        data: campaigns,
        message: "No campaigns found!",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }
}

module.exports = PaymentCampaignController;
