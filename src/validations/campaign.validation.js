const { body, check } = require("express-validator");
const Account = require("../models/Account");
const WalletProvider = require("../models/WalletProvider");

const validateCreateCampaign = [
  body("name").notEmpty().withMessage("name is required"),

  body("description").notEmpty().withMessage("description is required"),

  body("date").notEmpty().withMessage("date is required"),

  body("account_id").notEmpty().withMessage("account id is required"),

  check("dispatch_type").notEmpty().withMessage("dispatch type is required"),

  body("contacts_file")
    .notEmpty()
    .withMessage("contacts file is required"),
];

async function customValidateCreateCampaign(fields) {
  const { account_id, dispatch_type, wallet_provider, contacts_file } = fields;

  const errors = [];

  if (
    dispatch_type !== "wallet" &&
    dispatch_type !== "code" &&
    dispatch_type !== "hybrid"
  ) {
    errors.push({ dispatch_type: "the provided dispatch type is not valid" });
  }

  console.log('condition => ', dispatch_type, dispatch_type === "wallet", Boolean(wallet_provider));
  if (dispatch_type === "wallet" && !wallet_provider) {
    errors.push({ wallet_provider: "The wallet provider is required" });
  }

  if (wallet_provider) {
    const walletProvider = await WalletProvider.findOne({
      where: { code: wallet_provider},
    });
  
    if (!walletProvider) {
      errors.push({ wallet_provider: "the wallet provider is not valid" });
    }
  }

  const account = await Account.findByPk(account_id);
  if (!account) {
    errors.push({ account_id: "the provided account id is not valid" });
  }

  if (
    contacts_file.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    errors.push({ contacts_file: "File format is not supported" });
  }

  return errors.length === 0 ? null : errors;
}

module.exports = {
  validateCreateCampaign,
  customValidateCreateCampaign,
};
