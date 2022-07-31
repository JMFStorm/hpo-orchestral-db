import { Router } from "express";

import { validateToken } from "../middleware/authorization";
import { httpError } from "../utils/httpError";
import { addComposers, addConductors, addMusicians } from "../managers/musician";
import { addInstruments } from "../managers/instrument";
import { addSymphonies } from "../managers/symphony";
import { addOrchestries } from "../managers/orchestra";
import { addLocations } from "../managers/location";
import { addConcerts, addConcertTags } from "../managers/concert";
import { addPremiereTags } from "../managers/premiereTag";
import { addPerformances, saveSoloistPerformances } from "../managers/performance";
import { addArrangers } from "../managers/arrangers";
import { csvDirectoryPath, premiereTags } from "../utils/config";
import { csvRowsToObjects } from "../utils/csvRead";
import CsvRowObject from "../interfaces/CsvRowObject";
import { deleteAllFromRepo } from "../managers/database";
import {
  parseConcertsFromRows,
  parseConductorsFromRows,
  parsePerformancesFromRows,
  parseSoloistsFromRows,
  parseStringsFromColumn,
  parseSymphoniesFromRows,
  validateCsvData,
} from "../managers/seed";
import { seedLog } from "../socket";

const controller = Router();

const seedDatabase = async (csvRows: CsvRowObject[]) => {
  try {
    seedLog("Seed init...");
    // Delete existing data
    const totalEntities = 13;
    let deletedEntities = 0;
    seedLog("Deleting existing tables. This will take a while...");
    console.time("deleteTables");
    const logDeletion = () => seedLog(`Deleted ${++deletedEntities}/${totalEntities} entities.`, "total");
    await Promise.all([
      await deleteAllFromRepo("arranger").then(() => logDeletion()),
      await deleteAllFromRepo("composer").then(() => logDeletion()),
      await deleteAllFromRepo("concert").then(() => logDeletion()),
      await deleteAllFromRepo("concert_tag").then(() => logDeletion()),
      await deleteAllFromRepo("conductor").then(() => logDeletion()),
      await deleteAllFromRepo("instrument").then(() => logDeletion()),
      await deleteAllFromRepo("location").then(() => logDeletion()),
      await deleteAllFromRepo("musician").then(() => logDeletion()),
      await deleteAllFromRepo("orchestra").then(() => logDeletion()),
      await deleteAllFromRepo("performance").then(() => logDeletion()),
      await deleteAllFromRepo("premiere_tag").then(() => logDeletion()),
      await deleteAllFromRepo("soloist_performance").then(() => logDeletion()),
      await deleteAllFromRepo("symphony").then(() => logDeletion()),
    ]);
    console.timeEnd("deleteTables");
    seedLog("Deleted existing tables.");

    const premsRes = await addPremiereTags(premiereTags);
    console.log(`Added ${premsRes} premiere tags`);

    let totalAdded = 0;
    const totalCount = csvRows.length;
    const maxConcurrency = 1000;

    seedLog(`Processed ${totalAdded}/${totalCount} performances`, "total");
    while (csvRows.length > 0) {
      const rowObjects = csvRows.splice(0, maxConcurrency);

      // Add arrangers
      let arrangers: string[] = [];
      rowObjects
        .filter((x) => x.Sovittaja.trim().length !== 0)
        .forEach((x) => {
          const current = x.Sovittaja;
          const arranger = current;
          if (!arrangers.includes(arranger)) {
            arrangers.push(arranger);
          }
        });

      seedLog(`Adding ${arrangers.length} more arrangers...`);
      await addArrangers(arrangers);

      const symphonyObjects = parseSymphoniesFromRows(rowObjects, premiereTags);

      let composerNamesArr = symphonyObjects.map((symph) => symph.composerNames).flat();
      composerNamesArr = composerNamesArr.filter(
        (current, index, self) => index === self.findIndex((x) => x === current && current !== "")
      );

      seedLog(`Adding ${composerNamesArr.length} more composers...`);
      await addComposers(composerNamesArr);

      seedLog(`Adding ${symphonyObjects.length} more symphonies...`);
      await addSymphonies(symphonyObjects);

      const conductors = parseConductorsFromRows(rowObjects);
      const { musicians, instruments } = parseSoloistsFromRows(rowObjects);

      const orchestraNames = parseStringsFromColumn(rowObjects, "Orkesteri");
      const locationNames = parseStringsFromColumn(rowObjects, "Konserttipaikka");
      const concertTagNames = parseStringsFromColumn(rowObjects, "KonsertinNimike");

      // Collect concerts
      const concerts = parseConcertsFromRows(rowObjects);

      // Collect both soloist and concert performances
      // and connect premiere tags
      seedLog(`Adding ${rowObjects.length} more performances...`);
      const performances = await parsePerformancesFromRows(rowObjects, premiereTags);

      // Save all 'loosely' collected
      seedLog(`Adding more stuff to performance relation tables...`);
      await Promise.all([
        await addConductors(conductors),
        await addMusicians(musicians),
        await addInstruments(instruments),
        await addOrchestries(orchestraNames),
        await addLocations(locationNames),
        await addConcertTags(concertTagNames),
      ]);

      // Save concerts
      seedLog(`Adding ${concerts.length} more concerts...`);
      await addConcerts(concerts);

      // Save concert performances
      const { addedCount, soloistPerformanceObjects } = await addPerformances(performances);

      // Save soloist performances
      seedLog(`Adding ${soloistPerformanceObjects.length} more soloist performances...`);
      await saveSoloistPerformances(soloistPerformanceObjects);

      totalAdded += addedCount;
      seedLog(`Processed ${totalAdded}/${totalCount} performances.`, "total");
    }

    console.log({ savedPerformances: totalAdded });
    seedLog("Database seed complete!");
    seedLog(`Saved ${totalAdded} performances in total.`, "result", true);
    return totalAdded;
  } catch (err) {
    console.error("err", err);
    return;
  }
};

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", validateToken, async (req, res, next) => {
  let rowObjects: CsvRowObject[] = [];

  // Read CSV file
  const csvTestFileName = req.body.csvTestFileName;
  console.log("csvTestFileName", csvTestFileName);

  if (csvTestFileName) {
    // Read test csv from filepath
    const csvPath = csvDirectoryPath + csvTestFileName;
    console.log(`Using ${csvPath} as a test seed filepath`);
    rowObjects = await csvRowsToObjects(csvPath);
  } else if (req.body.csvRows) {
    // Else get rowObjects from request body
    rowObjects = req.body.csvRows;
    console.log(`Using data from req.body.csvRows to seed`);
  }

  if (rowObjects?.length <= 0) {
    return res.send({ savedPerformances: 0 });
  }

  console.log("Validating rows");
  const errors = validateCsvData(rowObjects);

  if (0 < errors.length) {
    return next(httpError(errors, "validation_error", 400));
  }
  console.log("Rows validated");

  seedDatabase(rowObjects);
  return res.send();
});

export default controller;
