import SymphonyObject from "../interfaces/SymphonyObject";
import CsvRowObject from "../interfaces/CsvRowObject";
import PremiereTagConfig from "../interfaces/PremiereTagConfig";
import { encoreRegex } from "../utils/config";
import ConcertObject from "../interfaces/ConcertObject";
import PerformanceObject from "../interfaces/PerformanceObject";
import SoloistPerformanceObject from "../interfaces/SoloistPerformanceObject";
import { getAllPremiereTags } from "./premiereTag";

type CsvErrorType = "value_missing" | "invalid_format" | "value_not_number" | "column_missing";

interface CsvError {
  rowNumber: number | undefined;
  errorType: CsvErrorType;
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
  { name: "Aloitusaika", regEx: /^[0-2]?\d{1}:[0-5]{1}\d{1}$/ },
  { name: "Paivamaara", regEx: /^[0-3]?\d{1}.[0-1]?\d{1}.\d{1,4}$/ },
];

export const validateCsvData = (rows: CsvRowObject[]) => {
  let errors: CsvError[] = [];

  // Validate all fields are included,
  // testing one row is enough
  const fieldsAsString = [
    "KonserttiId",
    "Aloitusaika",
    "Esitysjarjestys",
    "Paivamaara",
    "Kapellimestari",
    "Saveltaja",
    "TeoksenNimi",
    "TeoksenId",
    "Sovittaja",
    "Orkesteri",
    "Solisti",
    "KonsertinNimike",
    "Konserttipaikka",
    "TietoaKonsertista",
    "LisatietoaKonsertista",
  ];
  const keys = Object.keys(rows[0]);
  fieldsAsString.forEach((field) => {
    if (!keys.includes(field)) {
      const err: CsvError = { rowNumber: undefined, errorType: "column_missing", cellName: "", cellValue: field };
      errors.push(err);
    }
  });

  if (0 < errors.length) {
    console.log(errors.length + " validation errors found");
    return errors;
  }

  rows.forEach((row, index) => {
    const csvRow = index + 2;
    // Validate not nulls
    const notNullsIndexed = mapIndexedRows(notNullFileds, row);
    notNullFileds.forEach((field) => {
      const value = notNullsIndexed[field];
      if (!value) {
        const err: CsvError = { rowNumber: csvRow, errorType: "value_missing", cellName: field, cellValue: "" };
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
      if (value) {
        const valid = field.regEx.test(value);
        if (!valid) {
          const err: CsvError = {
            rowNumber: csvRow,
            errorType: "invalid_format",
            cellName: field.name,
            cellValue: value,
          };
          errors.push(err);
        }
      }
    });
    // Validate numbers
    const numberFields = ["Esitysjarjestys", "TeoksenId"];
    const numbersIndexed = mapIndexedRows(numberFields, row);
    numberFields.forEach((field) => {
      const value = numbersIndexed[field];
      const asNum = Number(value);
      if (Number.isNaN(asNum)) {
        const err: CsvError = {
          rowNumber: csvRow,
          errorType: "value_not_number",
          cellName: field,
          cellValue: value,
        };
        errors.push(err);
      }
    });
  });

  if (0 < errors.length) {
    console.log(errors.length + " validation errors found");
  }

  return errors;
};

export const parseSymphoniesFromRows = (rows: CsvRowObject[], premiereTags: PremiereTagConfig[]) => {
  // Add symphonies
  let symphoniesWithComposers: SymphonyObject[] = [];

  rows.forEach((row) => {
    let composersArr: string[] = [];
    const composerCell = row.Saveltaja.trim();
    const regexEmpty = new RegExp("\\*");
    const regexMultiple = new RegExp("/");
    if (regexEmpty.test(composerCell) || composerCell === "") {
      composersArr = [];
    } else if (regexMultiple.test(composerCell)) {
      const compsArr = composerCell.split("/").map((x) => x.trim());
      compsArr.forEach((x) => {
        composersArr.push(x.trim());
      });
    } else if (composerCell !== "") {
      composersArr.push(composerCell.trim());
    }

    const symphonyIdCell = row.TeoksenId;
    const symphonyNameCell = row.TeoksenNimi;
    const arrangerCell = row.Sovittaja.trim();
    let symphonyName = symphonyNameCell;

    // Premiere tag names
    const parseFromPremiereTag = (cell: string) => {
      const indexStart = cell.lastIndexOf("(");
      const indexEnd = cell.lastIndexOf(")");
      if (indexStart < indexEnd) {
        symphonyName = cell.substring(0, indexStart).trim();
      } else {
        console.error("Something not right with premiere tag brackets: ", indexStart, indexEnd, cell);
      }
      return cell;
    };

    // Parse premieres tag
    const premieresRegexList = premiereTags.map((x) => x.regex);
    if (premieresRegexList.some((rx) => rx.test(symphonyNameCell))) {
      symphonyName = parseFromPremiereTag(symphonyNameCell);
    }

    // Parse encore tag
    if (encoreRegex.test(symphonyNameCell)) {
      symphonyName = parseFromPremiereTag(symphonyNameCell);
    }

    const symphonyObj: SymphonyObject = {
      symphony_id: symphonyIdCell,
      name: symphonyName,
      composerNames: composersArr,
      arrangers: arrangerCell,
    };

    if (
      !symphoniesWithComposers.some((x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name)
    ) {
      symphoniesWithComposers.push(symphonyObj);
    }
  });
  return symphoniesWithComposers;
};

export const parseConductorsFromRows = (rows: CsvRowObject[]) => {
  let conductors: string[] = [];

  rows.forEach((x) => {
    const conductor = x.Kapellimestari.trim();

    // Check for multiple in one cell
    const regex21 = new RegExp("/");
    if (regex21.test(conductor)) {
      const condsArr = conductor.split("/").map((x) => x.trim());
      condsArr.forEach((x) => {
        const cond = x.trim();
        if (!conductors.includes(cond)) {
          conductors.push(cond);
          return;
        }
      });
    } else if (conductor !== "" && !conductors.includes(conductor)) {
      conductors.push(conductor);
    }
  });
  return conductors;
};

export const parseSoloistsFromRows = (rows: CsvRowObject[]) => {
  let musicians: string[] = [];
  let instruments: string[] = [];

  rows
    .filter((row) => row.Solisti.trim().length !== 0)
    .map((row) => {
      // Check for multiple in one cell
      const cell = row.Solisti;
      const soloistArr = cell.split(",");
      soloistArr.map((x) => {
        const current = x.trim();
        const soloist = current.substring(0, current.indexOf("(")).trim();

        if (soloist.length > 0 && !musicians.includes(soloist)) {
          musicians.push(soloist);
        }

        // Get instrument
        const regexInstrument = new RegExp("(w*)");
        if (regexInstrument.test(current)) {
          const start = current.indexOf("(") + 1;
          const end = current.indexOf(")");
          const instrument = current.substring(start, end).trim();
          if (instrument !== "" && !instruments.includes(instrument)) {
            instruments.push(instrument);
          }
        }
      });
    });

  return { musicians, instruments };
};

export const parseStringsFromColumn = (rows: CsvRowObject[], column: keyof CsvRowObject) => {
  let array: string[] = [];
  rows.map((row) => {
    const cell = row[column].trim();
    if (!array.includes(cell) && cell !== "") {
      array.push(cell);
    }
  });
  return array;
};

export const parseConcertsFromRows = (rows: CsvRowObject[]) => {
  let concerts: ConcertObject[] = [];

  rows.forEach((row) => {
    const concertId = row.KonserttiId.trim();
    const date = row.Paivamaara.trim();
    const time = row.Aloitusaika.trim();
    const location = row.Konserttipaikka.trim();
    const tag = row.KonsertinNimike.trim();
    const orchestra = row.Orkesteri.trim();
    const footnote = row.TietoaKonsertista ? row.TietoaKonsertista.trim() : "";
    const archiveInfo = row.LisatietoaKonsertista ? row.LisatietoaKonsertista.trim() : "";

    const conductorCell = row.Kapellimestari.trim();
    let conductorsArr: string[] = [];

    // Check for multiple conductors
    conductorCell.split("/").map((x) => {
      const conductor = x.trim();
      conductorsArr.push(conductor);
    });
    if (!concerts.some((x) => x.concert_id === concertId) && concertId !== "") {
      const concertObject: ConcertObject = {
        concert_id: concertId,
        date: date,
        starting_time: time,
        location: location,
        concert_tag: tag,
        orchestra: orchestra,
        conductors: conductorsArr,
        footnote: footnote,
        archive_info: archiveInfo,
      };
      concerts.push(concertObject);
    }
  });
  return concerts;
};

export const parsePerformancesFromRows = async (rows: CsvRowObject[], premiereTags: PremiereTagConfig[]) => {
  // Collect both soloist and concert performances
  // and connect premiere tags
  let performances: PerformanceObject[] = [];
  const premiereTagObjects = await getAllPremiereTags();

  rows.forEach((row) => {
    const soloistPerformances: SoloistPerformanceObject[] = [];
    const soloistsCell = row.Solisti;

    // Check for multiple soloists in one cell
    const soloistArr = soloistsCell.split(",");
    soloistArr.forEach((x) => {
      const current = x.trim();
      let soloistTemp;
      let instrumentTemp;

      // Get musicians
      const soloist = current.substring(0, current.indexOf("(")).trim();
      if (soloist.length > 0) {
        soloistTemp = soloist;
      }
      // Get instrument
      const regexInstrument = new RegExp("(w*)");
      if (regexInstrument.test(current)) {
        const start = current.indexOf("(") + 1;
        const end = current.indexOf(")");
        const instrument = current.substring(start, end).trim();

        if (instrument.length > 0) {
          instrumentTemp = instrument;
        }
      }
      // Add new soloist performance for current concert performance
      if (soloistTemp && instrumentTemp) {
        soloistPerformances.push({
          soloistName: soloistTemp,
          instrumentName: instrumentTemp,
        });
      }
    });

    const composerCell = row.Saveltaja.trim();
    let composersArr: string[] = [];

    // Check for multiple composers in cell
    // and add them for array
    composerCell.split("/").map((x) => {
      const composer = x.trim();
      composersArr.push(composer);
    });

    // Initialize defaults
    let premiereTag = "";
    const symphonyNameCell = row.TeoksenNimi.trim();

    // Check for premeiere tags in name cell
    premiereTags.forEach(async (tag) => {
      if (symphonyNameCell.match(tag.regex)) {
        const premiereTagObject = premiereTagObjects.find((x) => x.name === tag.sqlName);

        if (premiereTagObject) {
          premiereTag = premiereTagObject.name;
        }
      }
    });
    let isEncore = false;
    if (encoreRegex.test(symphonyNameCell)) {
      isEncore = true;
    }

    // Build concert performance object from the rest
    const concertId = row.KonserttiId.trim();
    const order = row.Esitysjarjestys.trim();
    const symphonyId = row.TeoksenId.trim();

    const newPerformance: PerformanceObject = {
      premiere_tag: premiereTag,
      order: order,
      concertId: concertId,
      symphonyId: symphonyId,
      composers: composersArr,
      soloist_performances: soloistPerformances,
      is_encore: isEncore,
    };

    if (!performances.some((x) => x === newPerformance)) {
      performances.push(newPerformance);
    }
  });
  return performances;
};
