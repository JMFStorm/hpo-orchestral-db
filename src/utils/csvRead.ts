const fs = require("fs").promises;

import Papa from "papaparse";
import CsvRowObject from "../interfaces/CsvRowObject";

export const csvRowsToObjects = async (filePath: string) => {
  const fileText = await fs.readFile(filePath, "utf8", (err: any) => {
    if (err) {
      console.error(err);
    }
  });

  let data: CsvRowObject[] = [];

  const papaCallback = (result: Papa.ParseResult<CsvRowObject>) => {
    if (result.errors) {
      result.errors.forEach((err) => {
        if (result.data && err.row === result.data.length - 1) {
          // Slice last row off
          result.data = result.data.slice(0, result.data.length - 1);
        } else if (result.data && err.row !== result.data.length - 1) {
          console.error("Csv reader error:", err);
        }
      });
    }
    data = result.data as CsvRowObject[];
  };

  Papa.parse<CsvRowObject>(fileText, {
    header: true,
    complete: papaCallback,
  });

  return data;
};
