
/**
 * 
 * @param {number} size 
 */

function generateOTP(size) {
  let otpCode = "";
  const characters = "0123456789";

  for (let i = 0; i < size; i++) {
    otpCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return otpCode;
}

/**
 * 
 * @param {number} size 
 */

function generateRandomString(size = 36) {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let randomString = "";

  for (let i = 0; i < size; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

module.exports = {generateOTP, generateRandomString};