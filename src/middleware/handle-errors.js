const { Result } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

/**
 * Handle errors that occur when making requests to the server
 *
 * @param {Object} error
 * @param {Response} response
 */
const handleErrors = (error, response) => {
  console.log("error => ", error);
  response
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: error.message || "Unknown error", stack: error });
};

/**
 * 
 * @param {Result<ValidationError>} errors 
 * @param {Response} response 
 */
const handleValidationErrors = (errors, response) => {
  response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    message: errors[0].msg,
    errors: errors,
  });
};

module.exports = { handleErrors, handleValidationErrors };
