const { check, body } = require("express-validator");
const User = require("../models/User");

const validateCreateUser = [
  check("firstname").notEmpty().withMessage("firstname is required"),

  check("lastname").notEmpty().withMessage("lastname is required"),

  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .custom(async (value, { req }) => {
      if (!/^((\+|00)221[ -]*)?7[0678]\d{7}$/.test(value)) {
        throw new Error(`The phone "${value}" must be a valid phone number`);
      }

      const user = await User.findOne({ where: { phone: value } });
      if (user) {
        throw new Error(`the phone "${value}" is already exists`);
      }
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .custom(async (value, { req }) => {
      if (!/\S+@\S+\.\S+/.test(value)) {
        throw new Error(`The email "${value}" must be a valid email format`);
      }

      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error(`this email "${value}" is already exists`);
      }
    }),
];

module.exports = {
  validateCreateUser,
};
