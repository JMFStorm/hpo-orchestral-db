import { Router } from "express";

import { validateToken } from "../middleware/authorization";
import { httpError } from "../utils/httpError";
import { addConductors, addMusicians } from "../managers/musician";
import { addInstruments } from "../managers/instrument";
import { addSymphonies } from "../managers/symphony";
import { addOrchestries } from "../managers/orchestra";
import { addLocations } from "../managers/location";
import { addConcerts, addConcertTags } from "../managers/concert";
import { addPremiereTags } from "../managers/premiereTag";
import { addPerformances } from "../managers/performance";
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

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", validateToken, async (req, res, next) => {
  try {
    seedLog("Seed init...");

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

    // Validate all rows
    console.log("Validating rows");
    const errors = validateCsvData(rowObjects);

    if (0 < errors.length) {
      return next(httpError(errors, "validation_error", 400));
    }
    console.log("Rows validated");

    // Delete existing data
    seedLog("Deleting existing tables...");
    Promise.all([
      await deleteAllFromRepo("arranger"),
      await deleteAllFromRepo("composer"),
      await deleteAllFromRepo("concert"),
      await deleteAllFromRepo("concert_tag"),
      await deleteAllFromRepo("conductor"),
      await deleteAllFromRepo("instrument"),
      await deleteAllFromRepo("location"),
      await deleteAllFromRepo("musician"),
      await deleteAllFromRepo("orchestra"),
      await deleteAllFromRepo("performance"),
      await deleteAllFromRepo("premiere_tag"),
      await deleteAllFromRepo("soloist_performance"),
      await deleteAllFromRepo("symphony"),
    ]);

    seedLog("Deleted existing tables.");

    const premsRes = await addPremiereTags(premiereTags);
    console.log(`Added ${premsRes} premiere tags`);

    // Add arrangers
    let arrangers: string[] = [];
    rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const current = x.Sovittaja;
        const arranger = current;
        if (!arrangers.includes(arranger)) {
          arrangers.push(arranger);
        }
      });

    const arrangersRes = await addArrangers(arrangers);
    console.log(`Added ${arrangersRes} arrangers`);

    console.log(`Adding new symphonies.`);
    const symphonyObjects = parseSymphoniesFromRows(rowObjects, premiereTags);
    const addedSymphonies = await addSymphonies(symphonyObjects);
    console.log(`Added ${addedSymphonies} new symphonies.`);

    const conductors = parseConductorsFromRows(rowObjects);
    const { musicians, instruments } = parseSoloistsFromRows(rowObjects);

    const orchestraNames = parseStringsFromColumn(rowObjects, "Orkesteri");
    const locationNames = parseStringsFromColumn(rowObjects, "Konserttipaikka");
    const concertTagNames = parseStringsFromColumn(rowObjects, "KonsertinNimike");

    // Collect concerts
    const concerts = parseConcertsFromRows(rowObjects);

    // Collect both soloist and concert performances
    // and connect premiere tags
    const performances = await parsePerformancesFromRows(rowObjects, premiereTags);

    // Save all 'loosely' collected
    seedLog("Pregenerating tables...");
    Promise.all([
      await addConductors(conductors).then(() => console.log("Saved conductors")),
      await addMusicians(musicians).then(() => console.log("Saved musicians")),
      await addInstruments(instruments).then(() => console.log("Saved instruments")),
      await addOrchestries(orchestraNames).then(() => console.log("Saved orchestraNames")),
      await addLocations(locationNames).then(() => console.log("Saved locationNames")),
      await addConcertTags(concertTagNames).then(() => console.log("Saved concertTagNames")),
    ]);

    // Save concerts
    seedLog("Saving concerts...");
    await addConcerts(concerts);

    // Save soloist and concert performances
    seedLog("Saving performances...");
    const savedCount = await addPerformances(performances);

    console.log({ savedPerformances: savedCount });
    seedLog("Database seed complete");
    seedLog(`Saved ${savedCount} performances in total!`, "result");

    return res.send({ savedPerformances: savedCount });
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
