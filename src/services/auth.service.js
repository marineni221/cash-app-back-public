const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const {
  ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_SECRET_TOKEN_EXPIRE_IN,
} = require("../config/access-token");
const PersonalAccessToken = require("../models/PersonalAccessToken");
const PhoneVerification = require("../models/PhoneVerification");
const EmailVerification = require("../models/EmailVerification");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const JWT_MAX_AGE = 10 * (1000 * 60 * 60 * 24);

/**
 *
 * @param {number} accountId
 */
function generateJwtToken(accountId) {
  const accessToken = jwt.sign(
    { id: accountId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRE_IN }
  );

  const refreshToken = jwt.sign(
    { id: accountId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_SECRET_TOKEN_EXPIRE_IN }
  );

  return { accessToken, refreshToken };
}

/**
 *
 * @param {Response} response
 * @param {string} refreshToken
 * @param {Array<Object>} data
 * @param {string} message
 */

function setJwtCookie(response, refreshToken, data, message) {
  response
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: JWT_MAX_AGE,
    })
    .status(StatusCodes.OK)
    .json({ data, message, success: true });
}

/**
 *
 * @param {Account} account
 * @param {string} refreshToken
 */

async function saveJwt(account, refreshToken) {
  const expirationDate = new Date(Date.now() + JWT_MAX_AGE);
  return await PersonalAccessToken.create({
    token: refreshToken,
    account_id: account.id,
    expires_at: expirationDate,
  });
}

/**
 *
 * @param {string} phone
 * @param {string} otpCode
 */

async function saveOtpPhone(phone, otpCode) {
  const phoneVerification = await PhoneVerification.findOne({
    where: { phone },
  });
  if (phoneVerification) {
    phoneVerification.destroy();
  }

  await PhoneVerification.create({ phone, code: otpCode });
}

/**
 *
 * @param {string} email
 * @param {string} otpCode
 */

async function saveEmailToken(email, token, minutes = 10) {
  const expirationMniutes = minutes * (1000 * 60);
  const expirationDate = new Date(Date.now() + expirationMniutes);
  await EmailVerification.create({ email, token, expires_at: expirationDate });
}

module.exports = {
  generateJwtToken,
  setJwtCookie,
  saveJwt,
  saveOtpPhone,
  saveEmailToken,
};
