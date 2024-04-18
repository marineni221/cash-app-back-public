const jwt = require("jsonwebtoken");
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");

/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 * @returns
 */

const verifyToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return response
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Invalid access token" });
    }
    request.account = decoded.id;
    next();
  });
};

function verifyAuthorizationHeader(header) {
  const parts = header.split(" ");
  return parts.length === 2 && parts[0] === "Bearer" && parts[1].length > 0;
}

module.exports = verifyToken;
