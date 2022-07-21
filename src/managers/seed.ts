import CsvRowObject from "../interfaces/CsvRowObject";

type RowErrorType = "value_missing" | "invalid_format";

interface CsvRowError {
  rowNumber: number;
  errorType: RowErrorType;
  cellName: string;
}

export const validateCsvData = (rows: CsvRowObject[]) => {
  let errors: CsvRowError[] = [];

  const notNullFileds: string[] = ["TeoksenId", "TeoksenNimi"];

  rows.forEach((row, index) => {
    console.log("row", row);

    let indexedRows: { [key: string]: string } = {};
    notNullFileds.forEach((field) => {
      indexedRows[field] = row[field as keyof CsvRowObject];
    });

    // Not null cells
    if (!row.TeoksenId) {
      const csvRow = index + 2;
      const err: CsvRowError = { rowNumber: csvRow, errorType: "value_missing", cellName: "TeoksenId" };
      errors.push(err);
    }
  });

  return errors;
};
