import Papa from "papaparse";

export const parseCsv = (inputFile, parseCallback) => {
  let data = [];

  Papa.parse(inputFile, {
    header: true,
    complete: parseCallback,
  });

  return data;
};
