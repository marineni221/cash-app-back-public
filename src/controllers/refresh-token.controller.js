const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const { ACCESS_TOKEN_EXPIRE_IN } = require("../config/access-token");
const PersonalAccessToken = require("../models/PersonalAccessToken");
const { StatusCodes } = require("http-status-codes");

class RefreshTokenController {
  async handle(request, response) {
    const cookies = request.cookies;
    if (!cookies.jwt) {
      return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    const personalAccessToken = await PersonalAccessToken.findOne({where: { token: refreshToken}});
    if (!personalAccessToken) {
      return response.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
    }

    const foundAccount = await Account.findByPk(personalAccessToken.account_id);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || decoded.id !== foundAccount.id) {
          await personalAccessToken.destroy();
          return response.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
        }

        const accessToken = jwt.sign(
          { id: foundAccount.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRE_IN }
        );

        response.status(StatusCodes.OK).json({ message: "Access token regenerated", accessToken, success: true });
      }
    );
  }
}

module.exports = RefreshTokenController;