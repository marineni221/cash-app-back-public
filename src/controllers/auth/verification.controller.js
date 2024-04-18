const {
  handleErrors,
  handleValidationErrors,
} = require("../../middleware/handle-errors");
const { validationResult } = require("express-validator");
const {
  setJwtCookie,
  generateJwtToken,
  saveJwt,
} = require("../../services/auth.service");
const AccountTransformer = require("../../transformers/account.transformer");
const PhoneVerification = require("../../models/PhoneVerification");
const Controller = require("../controller");
const { StatusCodes } = require("http-status-codes");
const Account = require("../../models/Account");
const User = require("../../models/User");
const EmailVerification = require("../../models/EmailVerification");

const CODE_VALIDITY = 5;

class VerificationController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async checkPhoneOtp(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { code, account_id } = request.body;

      const phoneVerification = await PhoneVerification.findOne({
        where: { code },
      });

      if (!phoneVerification) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: [{ m: "verification code is not valid", code }],
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });
      }

      const currentDate = new Date();
      const currentTime = currentDate.getTime();

      const phoneCreatedDate = new Date(phoneVerification.created_at);
      phoneCreatedDate.setMinutes(
        phoneCreatedDate.getMinutes() + CODE_VALIDITY
      );
      const phoneCreatedTime = phoneCreatedDate.getTime();

      if (currentTime > phoneCreatedTime) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: ["verification code is not valid"],
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });
      }

      const account = await Account.findByPk(account_id, {
        include: [{ model: User, as: "user" }],
      });

      const { accessToken, refreshToken } = generateJwtToken(account.id);
      saveJwt(account, refreshToken);
      const accountTransformer = AccountTransformer.transform(account);

      return setJwtCookie(
        response,
        refreshToken,
        { account: accountTransformer, accessToken },
        "Successfully logged in !"
      );
    } catch (error) {
      handleErrors(error, response);
    }
  }

  // =================================================================

  /**
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async checkEmailToken(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { token } = request.body;

      const verificationEmail = await EmailVerification.findOne({
        where: { token },
      });

      if (!verificationEmail) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: ["the provided token is not valid"],
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const currentDate = new Date();
      const emailCreatedDate = new Date(verificationEmail.expires_at);

      if (currentDate > emailCreatedDate) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: ["the provided token is not valid"],
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        });
      }

      return Controller.successResponse({
        response,
        data: {},
        message: "Token is valid",
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }
}

module.exports = VerificationController;
