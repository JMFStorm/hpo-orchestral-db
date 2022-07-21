import CsvRowObject from "../interfaces/CsvRowObject";

type RowErrorType = "value_missing" | "invalid_format";

interface CsvRowError {
  rowNumber: number;
  errorType: RowErrorType;
  cellName: string;
}

const mapIndexedRows = (fields: string[], row: CsvRowObject) => {
  let indexedRows: { [key: string]: string } = {};
  fields.forEach((field) => {
    indexedRows[field] = row[field as keyof CsvRowObject];
  });
  return indexedRows;
};

export const validateCsvData = (rows: CsvRowObject[]) => {
  let errors: CsvRowError[] = [];

  rows.forEach((row, index) => {
    // Validate not nulls
    const notNullFileds: string[] = ["KonserttiId", "Esitysjarjestys", "Paivamaara", "TeoksenId", "TeoksenNimi"];
    const notNullsIndexed = mapIndexedRows(notNullFileds, row);
    notNullFileds.forEach((field) => {
      const value = notNullsIndexed[field];
      if (!value) {
        const csvRow = index + 2;
        const err: CsvRowError = { rowNumber: csvRow, errorType: "value_missing", cellName: field };
        errors.push(err);
      }
    });

    // Validate formatting
  });

  return errors;
};
