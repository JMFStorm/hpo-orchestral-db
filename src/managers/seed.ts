import CsvRowObject from "../interfaces/CsvRowObject";

type RowErrorType = "value_missing" | "invalid_format" | "value_not_number";

interface CsvRowError {
  rowNumber: number;
  errorType: RowErrorType;
  cellName: string;
  cellValue: string;
}

const mapIndexedRows = (fields: string[], row: CsvRowObject) => {
  let indexedRows: { [key: string]: string } = {};
  fields.forEach((field) => {
    indexedRows[field] = row[field as keyof CsvRowObject];
  });
  return indexedRows;
};

const notNullFileds: string[] = ["KonserttiId", "Esitysjarjestys", "Paivamaara", "TeoksenId", "TeoksenNimi"];
const formattedFields = [
  { name: "Aloitusaika", regEx: /^[0-1]?\d{1}:[0-5]{1}\d{1}$/ },
  { name: "Paivamaara", regEx: /^[0-3]?\d{1}.[0-1]?\d{1}.\d{1,4}$/ },
];

export const validateCsvData = (rows: CsvRowObject[]) => {
  let errors: CsvRowError[] = [];

  rows.forEach((row, index) => {
    const csvRow = index + 2;
    // Validate not nulls
    const notNullsIndexed = mapIndexedRows(notNullFileds, row);
    notNullFileds.forEach((field) => {
      const value = notNullsIndexed[field];
      if (!value) {
        const err: CsvRowError = { rowNumber: csvRow, errorType: "value_missing", cellName: field, cellValue: "" };
        errors.push(err);
      }
    });
    // Validate formatting
    const formattedIndexed = mapIndexedRows(
      formattedFields.map((x) => x.name),
      row
    );
    formattedFields.forEach((field) => {
      const value = formattedIndexed[field.name];
      const valid = field.regEx.test(value);
      if (!valid) {
        const err: CsvRowError = {
          rowNumber: csvRow,
          errorType: "invalid_format",
          cellName: field.name,
          cellValue: value,
        };
        errors.push(err);
      }
    });
    // Validate numbers
    const numberFields = ["Esitysjarjestys", "TeoksenId"];
    const numbersIndexed = mapIndexedRows(numberFields, row);
    numberFields.forEach((field) => {
      const value = numbersIndexed[field];
      const asNum = Number(value);
      if (Number.isNaN(asNum)) {
        const err: CsvRowError = {
          rowNumber: csvRow,
          errorType: "value_not_number",
          cellName: field,
          cellValue: value,
        };
        errors.push(err);
      }
    });
  });

  return errors;
};
