const Controller = require("../controller");
const User = require("../../models/User");
const Account = require("../../models/Account");
const {
  handleErrors,
  handleValidationErrors,
} = require("../../middleware/handle-errors");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { saveOtpPhone } = require("../../services/auth.service");
const SMSService = require("../../services/sms.service");
const { generateOTP } = require("../../helpers/helpers");
const PersonalAccessToken = require("../../models/PersonalAccessToken");
const EmailVerification = require("../../models/EmailVerification");

class AuthController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async login(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { email, password } = request.body;
      const account = await Account.findOne({
        where: { login: email },
        include: [{ model: User, as: "user" }],
      });

      if (!account) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: ["Invalid email or password"],
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      const passwordValid = await bcrypt.compare(password, account.password);
      if (!passwordValid) {
        return Controller.errorResponse({
          response,
          data: null,
          errors: ["Invalid email or password"],
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      const otp = generateOTP(6);

      const smsService = new SMSService();
      smsService.sendRemixSMS(otp);

      const user = account.user;
      saveOtpPhone(user.phone, otp);

      return Controller.successResponse({
        response,
        data: { accountId: account.id, phone: user.phone },
        message: "Successfully logged in !",
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

  async createPassword(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { password, password_confirmation, token } = request.body;

      if (password_confirmation !== password) {
        return handleValidationErrors(
          ["The password confirmation must be identical to password"],
          response
        );
      }

      const emailVerification = await EmailVerification.findOne({
        where: { token },
      });
      if (!emailVerification) {
        return handleValidationErrors(
          ["the provided token is not valid for this account"],
          response
        );
      }

      const now = new Date(Date.now());
      const tokenExpirationDate = new Date(emailVerification.expires_at);

      if (now > tokenExpirationDate) {
        return handleValidationErrors(
          ["the provided token is not valid for this account"],
          response
        );
      }

      const account = await Account.findOne({
        where: { login: emailVerification.email },
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      await account.update({ password: hashedPassword });
      return Controller.successResponse({
        response,
        data: {},
        message: "Password updated successfully",
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

  async logout(request, response) {
    const cookies = request.cookies;
    if (!cookies.jwt) {
      return response
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "JWT deleted successfully" });
    }
    const refreshToken = cookies.jwt;

    const personalAccessToken = await PersonalAccessToken.findOne({
      where: { token: refreshToken },
    });
    if (!personalAccessToken) {
      return response
        .clearCookie("jwt", { httpOnly: true })
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "JWT deleted successfully" });
    }

    personalAccessToken.destroy();
    return response
      .clearCookie("jwt", { httpOnly: true })
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "JWT deleted successfully" });
  }
}

module.exports = AuthController;
