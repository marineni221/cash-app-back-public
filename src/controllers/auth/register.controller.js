const {
  handleValidationErrors,
  handleErrors,
} = require("../../middleware/handle-errors");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Account = require("../../models/Account");
const Controller = require("../controller");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

class RegisterController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async register(request, response) {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const { account_type, password, user_id } = request.body;
      const user = await User.findByPk(user_id);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAccount = await Account.create({
        account_type,
        password: hashedPassword,
        user_id,
        login: user.email,
      });

      return Controller.successResponse({
        response,
        data: { user, account: newAccount },
        message: "A new account has been created!",
        statusCode: StatusCodes.CREATED,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }
}

module.exports = RegisterController;
