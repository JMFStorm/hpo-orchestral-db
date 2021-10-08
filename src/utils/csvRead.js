const fs = require("fs").promises;
const csvReader = require("jquery-csv");

const csvRowsToObjects = async (filePath) => {
  const fileText = await fs.readFile(filePath, "utf8", (err) => {
    if (err) {
      console.error(err);
    }
  });

  let result = [];

  csvReader.toObjects(fileText, {}, (err, data) => {
    result = data;
  });

  return result;
};

module.exports = { csvRowsToObjects };
