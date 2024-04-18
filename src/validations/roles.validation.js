const { check, body } = require("express-validator");
const Role = require("../models/Role");

const validateCreateRole = [
  check("label")
    .notEmpty()
    .withMessage("label is required")
    .custom(async (value, { req }) => {
      const role = await Role.findOne({ where: { label: value } });
      if (role) {
        throw new Error(`the label "${value}" is already exists`);
      }
    }),

  check("description")
    .notEmpty()
    .withMessage("description is required")
    .custom(async (value, { req }) => {
      const role = await Role.findOne({ where: { label: value } });
      if (role) {
        throw new Error(`the description "${value}" is already exists`);
      }
    }),
];

const validateUpdateRole = [
  body("label")
    .optional()
    .custom(async (value, { req }) => {
      const role = await Role.findOne({ where: { label: value } });
      if (role) {
        throw new Error(`the label "${value}" is already exists`);
      }
    }),

  body("description")
    .optional()
    .custom(async (value, { req }) => {
      const role = await Role.findOne({ where: { description: value } });
      if (role) {
        throw new Error(`the description "${value}" is already exists`);
      }
    }),
];

module.exports = {
  validateCreateRole,
  validateUpdateRole,
};
