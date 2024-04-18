const { check, body } = require("express-validator");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");

const validatePassword = (password) => {
  const passwordString = String(password);

  if (passwordString.length < 10 || passwordString.length > 15) {
    return false;
  }

  if (!/\d/.test(passwordString)) {
    return false;
  }

  if (!/[a-z]/.test(passwordString)) {
    return false;
  }

  if (!/[A-Z]/.test(passwordString)) {
    return false;
  }

  return /[^\w\s]/.test(passwordString);
};

const validateUserLogin = [
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

const validateCreateUserAccount = [
  check("account_type").notEmpty().withMessage("account_type is required"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (value, { req }) => {
      if (value.length < 8) {
        throw new Error("The password must be at least 8 characters");
      }

      if (validatePassword(value) !== true) {
        throw new Error(
          `The password must contain at least one lowercase, one uppercase, one number, one special char (#[]()@$&*!?|,.^/\\+_- )`
        );
      }
    }),

  check("user_id")
    .notEmpty()
    .withMessage("user id is required")
    .custom(async (value, { req }) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Error("the provided user id is not valid for this account");
      }
    }),
];

const validateCreatePassword = [
  check("token")
    .notEmpty()
    .withMessage("token is required"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (value, { req }) => {
      if (value.length < 8 || value.length > 64) {
        throw new Error("The password must be between 8 and 64 characters");
      }

      if (validatePassword(value) !== true) {
        throw new Error(
          `The password must contain at least one lowercase, one uppercase, one number, one special char (#[]()@$&*!?|,.^/\\+_- )`
        );
      }
    }),

  check("password_confirmation")
    .notEmpty()
    .withMessage("password_confirmation is required"),
];

const validateEmailSend = [
  check("email").notEmpty().withMessage("email is required"),
  check("create_password_link")
    .notEmpty()
    .withMessage("the create password link is required"),
];

module.exports = {
  validateUserLogin,
  validateCreateUserAccount,
  validatePassword,
  validateEmailSend,
  validateCreatePassword,
};
