const Role = require("../models/Role");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const {
  handleErrors,
  handleValidationErrors,
} = require("../middleware/handle-errors");
const Controller = require("./controller");

class RoleController {
  /**
   *
   * @param {Request} request
   * @param {Response} response
   * @returns
   */

  async findAll(request, response) {
    try {
      const roles = await Role.findAll();

      Controller.successResponse({
        response,
        data: roles,
        message: "Roles retrieved succesfully !",
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

  async findOne(request, response) {
    const roleId = request.params.id;

    try {
      const role = await Role.findOne({
        where: {
          id: roleId,
        },
      });

      if (!role) {
        response
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Role not found" });
      }

      Controller.successResponse({
        response,
        data: role,
        message: "Role retrieved successfully !",
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

  async store(request, response) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        handleValidationErrors(errors.array(), response);
      }

      const data = request.body;
      const newRole = await Role.create(data);

      Controller.successResponse({
        response,
        data: newRole,
        message: "A new role has been added succesfully !",
        statusCode: StatusCodes.CREATED,
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

  async update(request, response) {
    const roleId = request.params.id;

    try {
      const role = await Role.findOne({
        where: {
          id: roleId,
        },
      });

      if (!role) {
        Controller.errorResponse({
          response,
          data: null,
          errors: ["Role not found"],
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        handleValidationErrors(errors.array(), response);
      }

      const { label, description } = request.body;

      if (!label && !description) {
        const errors = [
          {
            msg: "label or description must be provided",
          },
        ];
        handleValidationErrors(errors, response);
      }

      if (label) {
        role.label = label;
      }

      if (description) {
        role.description = description;
      }

      await role.save();
      Controller.successResponse({
        response,
        data: role,
        message: "This role has been updated !",
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

  async delete(request, response) {
    try {
      const role = await Role.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!role) {
        Controller.errorResponse({
          response,
          data: null,
          errors: ["Role not found"],
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      role.destroy();
      Controller.successResponse({
        response,
        data: role,
        message: "This role has been deleted !",
      });
    } catch (error) {
      handleErrors(error, response);
    }
  }
}

module.exports = RoleController;
