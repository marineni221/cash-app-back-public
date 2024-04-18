const Controller = require("./controller");
const User = require("../models/User");
const {
  handleErrors,
  handleValidationErrors,
} = require("../middleware/handle-errors");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const Account = require("../models/Account");

class UserController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   * @returns
   */

  async findAll(_, response, __) {
    try {
      const users = await User.findAll({
        include: [{ model: Account, as: "accounts" }],
      });

      return Controller.successResponse({
        response,
        data: users,
        message: "Users retrieved successfully !",
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
   * @param {NextFunction} next
   * @returns
   */

  async findOne(request, response, _) {
    const userId = request.params.id;

    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
        include: [{ model: Account, as: "accounts" }],
      });

      if (!user) {
        return Controller.errorResponse({
          response,
          data: null,
          statusCode: StatusCodes.NOT_FOUND,
          errors: ["User not found"],
        });
      }

      return Controller.successResponse({
        response,
        data: user,
        message: "User retrieved successfully !",
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
   * @param {NextFunction} next
   * @returns
   */

  async store(request, response, _) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return handleValidationErrors(errors.array(), response);
      }

      const data = request.body;
      const newUser = await User.create(data);

      return Controller.successResponse({
        response,
        data: newUser,
        message: "A new user has been added succesfully !",
        statusCode: StatusCodes.CREATED,
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }

  // =================================================================
}

module.exports = UserController;
