const xlsx = require("xlsx");

class ExcelReader {
  static getData(filepath) {
    const data = [];
    const workbook = xlsx.readFile(filepath);
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      
      const sheetData = ExcelReader.mapExcelData(jsonData);
      
      for (const sheet of sheetData) {
        data.push(sheet);
      }
    });

    return data;
  }

  static mapExcelData(excelData) {
    /** @type {Array} header */
    const headers = excelData[0];
    let data = [];
    excelData.slice(1).forEach((element) => {
      data.push(ExcelReader.mapExcelHeaders(headers, element));
    });
    return data;
  }

  static mapExcelHeaders(headers, data) {
    const mappedData = {};
    headers.forEach((header, index) => {
      mappedData[header] = data[index];
    });
    return mappedData;
  }
}

module.exports = ExcelReader;
