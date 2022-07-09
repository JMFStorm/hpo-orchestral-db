const fs = require("fs").promises;
const csvReader = require("jquery-csv");

import CsvRowObject from "../interfaces/CsvRowObject";

export const csvRowsToObjects = async (filePath: string) => {
  const fileText = await fs.readFile(filePath, "utf8", (err: any) => {
    if (err) {
      console.error(err);
    }
  });

  let result: CsvRowObject[] = [];

  csvReader.toObjects(fileText, {}, (err: any, data: CsvRowObject[]) => {
    result = data as CsvRowObject[];
  });

  return result;
};
