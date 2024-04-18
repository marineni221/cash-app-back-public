const Controller = require("./controller");
const {
  handleErrors,
  handleValidationErrors,
} = require("../middleware/handle-errors");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const SMSService = require("../services/sms.service");
const { generateOTP, generateRandomString } = require("../helpers/helpers");
const EmailService = require("../services/mail.service");
const { saveOtpEmail, saveEmailToken } = require("../services/auth.service");
const handlebars = require("handlebars");
const path = require("path");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");

class OtpController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async resendOtpPhone(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const account = request.body;
      const otp = generateOTP(6);

      const smsService = new SMSService();
      smsService.sendRemixSMS(otp);

      const user = account.user;
      saveOtpPhone(user.phone, otp);

      return Controller.successResponse({
        response,
        data: {},
        message: "Successfully sent new code !",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }

  // =================================================================

  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async sendLinkToEmail(request, response) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { email, create_password_link } = request.body;
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return Controller.errorResponse({
          response,
          data: {},
          errors: ["This email doesn't correspond to a user !"],
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const token = generateRandomString();

      const emailService = new EmailService();
      const htmlToSend = emailService.getHtmlToSend("send_link.html", {
        name: `${user.firstname} ${user.lastname}`,
        link: create_password_link + "/" + token,
      });

      saveEmailToken(email, token);
      emailService.sendEmail(email, "Reset your password", htmlToSend);

      return Controller.successResponse({
        response,
        data: {},
        message: "Successfully sent code !",
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }
}

module.exports = OtpController;
