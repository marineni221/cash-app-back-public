const { writeFile } = require("fs/promises");
const { join } = require("path");

/**
 *
 * @param {string} path
 * @param {File} file
 * @returns {Promise<boolean>} true if file saved, false otherwise
 */
async function saveFile(path, file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path, buffer);
    return true;
  } catch (error) {
    console.error("An error occured while saving file => ", error);
    return false;
  }
}

/**
 * get the public path
 * @returns public path for saving file
 */
function publicPath() {
  return join(process.cwd(), "public");
}

/**
 * get the uploaded path for saving file
 * @returns upload path for saving file
 */
function imagePath() {
  return join(process.cwd(), "public", "images");
}

/**
 * get the uploaded path for saving file
 * @returns upload path for saving file
 */
function storagePath() {
  return join(process.cwd(), "storage");
}

/**
 * generate a random filename depends on the type of the file
 * @param {File} file
 * @returns generated name
 */
function generateFileName(file) {
  return Date.now() + "." + file.type.split("/")[1];
}

module.exports = {saveFile, publicPath, imagePath, generateFileName, storagePath};
