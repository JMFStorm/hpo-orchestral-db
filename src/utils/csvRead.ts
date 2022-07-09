const fs = require("fs").promises;
const csvReader = require("jquery-csv");

const csvRowsToObjects = async (filePath: string) => {
  const fileText = await fs.readFile(filePath, "utf8", (err: any) => {
    if (err) {
      console.error(err);
    }
  });

  let result: any = [];

  csvReader.toObjects(fileText, {}, (err: any, data: any) => {
    result = data;
  });

  return result;
};

module.exports = { csvRowsToObjects };
