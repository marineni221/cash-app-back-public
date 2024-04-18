const Account = require("../models/Account");

class AccountTransformer {
  /**
   *
   * @param {Account} account
   */
  static transform(account, excludes = ["password", "refresh_token"]) {
    const accountData = account.dataValues;

    for (const excludeAttribute of excludes) {
      delete accountData[excludeAttribute];
    }

    return accountData;
  }
}

module.exports = AccountTransformer;
