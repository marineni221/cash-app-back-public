const { check } = require("express-validator");
const Account = require("../models/Account");
const User = require("../models/User");

const validateEmailToken = [
  check("token")
    .notEmpty()
    .withMessage("token is required"),
];

const validatePhoneCodeChecking = [
  check("account_id")
    .notEmpty()
    .withMessage("account id is required")
    .custom(async (value, { req }) => {
      const account = await Account.findByPk(value);
      if (!account) {
        throw new Error("the provided account id is not valid");
      }
    }),

  check("code").notEmpty().withMessage("otp code is required"),
];

const validatePhoneCodeResend = [
  check("account_id")
    .notEmpty()
    .withMessage("account id is required")
    .custom(async (value, { req }) => {
      const account = await Account.findByPk(value, {include: [{model: User, as: "user"}]});
      if (!account) {
        throw new Error("the provided account id is not valid");
      }
      req.body = account;
    }),
];

module.exports = {
  validateEmailToken,
  validatePhoneCodeChecking,
  validatePhoneCodeResend,
};
