import { Router } from "express";

import { httpError } from "../utils/httpError";
import { addConductors, addMusicians } from "../managers/musician";
import { addInstruments } from "../managers/instrument";
import { addSymphoniesAndRelatedComposers } from "../managers/symphony";
import { addOrchestries } from "../managers/orchestra";
import { addLocations } from "../managers/location";
import { addConcerts, addConcertTags } from "../managers/concert";
import { addPremiereTags, getAllPremiereTags } from "../managers/premiereTag";
import { addPerformances } from "../managers/performance";
import { addArrangers } from "../managers/arrangers";
import { csvDirectoryPath, premiereTags } from "../utils/config";
import { csvRowsToObjects } from "../utils/csvRead";
import CsvRowObject from "../interfaces/CsvRowObject";
import SymphonyObject from "src/interfaces/SymphonyObject";
import ConcertObject from "src/interfaces/ConcertObject";
import PerformanceObject from "src/interfaces/PerformanceObject";
import SoloistPerformanceObject from "src/interfaces/SoloistPerformanceObject";
import { deleteAllFromRepo } from "../managers/database";
import { validateCsvData } from "../managers/seed";

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", async (req, res, next) => {
  try {
    console.log("Seed init");
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

    console.log("errors", errors);

    if (0 < errors.length) {
      return next(httpError(errors, 400));
    }

    console.log("Rows validated");
    console.log("Deleting existing tables");

    // Delete existing data
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

    console.log("Deleted existing tables.");

    // Create premiere tag tables
    const premsRes = await addPremiereTags(premiereTags);

    console.log(`Added ${premsRes} premiere tags`);

    // Add symphonies
    let symphoniesWithComposers: SymphonyObject[] = [];

    rowObjects.forEach((row, index) => {
      // Read composer
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

      // Read symphony
      const symphonyIdCell = row.TeoksenId;
      const symphonyNameCell = row.TeoksenNimi;

      // Determine symphony name
      let symphonyName = symphonyNameCell;

      // Premiere tag names
      const premieresRegexList = premiereTags.map((x) => x.regex);

      if (premieresRegexList.some((rx) => rx.test(symphonyNameCell))) {
        const indexStart = symphonyNameCell.lastIndexOf("(");
        const indexEnd = symphonyNameCell.lastIndexOf(")");

        if (indexStart < indexEnd) {
          symphonyName = symphonyNameCell.substring(0, indexStart).trim();
        } else {
          console.log("Something not right with brackets: ", indexStart, indexEnd, symphonyNameCell);
        }
      }

      const symphonyObj: SymphonyObject = {
        symphony_id: symphonyIdCell,
        name: symphonyName,
        composerNames: composersArr,
      };

      if (
        !symphoniesWithComposers.some((x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name)
      ) {
        symphoniesWithComposers.push(symphonyObj);
      }
    });

    console.log(`Adding new symphonies.`);
    const addedSymphonies = await addSymphoniesAndRelatedComposers(symphoniesWithComposers);
    console.log(`Added ${addedSymphonies} new symphonies.`);

    // Collect conductors
    let conductors: string[] = [];

    rowObjects.forEach((x) => {
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

    let arrangers: string[] = [];

    // Collect arrangers
    rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const current = x.Sovittaja;
        const arranger = current;

        if (!arrangers.includes(arranger)) {
          arrangers.push(arranger);
        }
      });

    // Collect instruments from soloists
    let instruments: string[] = [];
    let musicians: string[] = [];

    // And collect musicians from soloist
    rowObjects
      .filter((x) => x.Solisti.trim().length !== 0)
      .map((x) => {
        const cell = x.Solisti;

        // Check for multiple in one cell
        const soloistArr = cell.split(",");
        soloistArr.map((x) => {
          const current = x.trim();

          // Get musicians
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

    // Collect orchestries
    let orchestraNames: string[] = [];

    rowObjects.map((row) => {
      const orchestra = row.Orkesteri;
      if (!orchestraNames.some((x) => x === orchestra) && orchestra.trim() !== "") {
        orchestraNames.push(orchestra);
      }
    });

    // Collect locations
    let locationNames: string[] = [];

    rowObjects.map((row) => {
      const location = row.Konserttipaikka;
      if (!locationNames.some((x) => x === location) && location.trim() !== "") {
        locationNames.push(location);
      }
    });

    // Collect concert tags
    let concertTagNames: string[] = [];

    rowObjects.map((row) => {
      const tag = row.KonsertinNimike.trim();
      if (!concertTagNames.includes(tag) && tag !== "") {
        concertTagNames.push(tag);
      }
    });

    // Collect concerts
    let concerts: ConcertObject[] = [];

    rowObjects.forEach((row) => {
      const concertId = row.KonserttiId.trim();
      const date = row.Paivamaara.trim();
      const time = row.Aloitusaika.trim();
      const location = row.Konserttipaikka.trim();
      const tag = row.KonsertinNimike.trim();
      const orchestra = row.Orkesteri.trim();

      const conductorCell = row.Kapellimestari.trim();
      let conductorsArr: string[] = [];

      // Check for multiple conductors in cell
      // and add them for array
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
        };
        concerts.push(concertObject);
      }
    });

    // Collect both soloist and concert performances
    // and connect premiere tags
    let performances: PerformanceObject[] = [];

    const premiereTagObjects = await getAllPremiereTags();

    rowObjects.forEach((row) => {
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

      // Check for premeiere tag in name cell
      premiereTags.forEach(async (tag) => {
        if (symphonyNameCell.match(tag.regex)) {
          const premiereTagObject = premiereTagObjects.find((x) => x.name === tag.sqlName);

          if (premiereTagObject) {
            premiereTag = premiereTagObject.name;
          }
        }
      });

      // Build concert performance object from the rest
      const concertId = row.KonserttiId.trim();
      const order = row.Esitysjarjestys.trim();
      const symphonyId = row.TeoksenId.trim();
      const arranger = row.Sovittaja.trim();

      const footnote = row.TietoaKonsertista ? row.TietoaKonsertista.trim() : "";
      const archiveInfo = row.LisatietoaKonsertista ? row.LisatietoaKonsertista.trim() : "";

      const newPerformance: PerformanceObject = {
        premiere_tag: premiereTag,
        order: order,
        concertId: concertId,
        symphonyId: symphonyId,
        composers: composersArr,
        arrangers: arranger,
        soloist_performances: soloistPerformances,
        footnote: footnote,
        archive_info: archiveInfo,
      };

      if (!performances.some((x) => x === newPerformance)) {
        performances.push(newPerformance);
      }
    });

    // Save all 'loosely' collected
    console.log("Saving 'loose' tables...");
    Promise.all([
      await addConductors(conductors).then(() => console.log("Saved conductors")),
      await addMusicians(musicians).then(() => console.log("Saved musicians")),
      await addInstruments(instruments).then(() => console.log("Saved instruments")),
      await addOrchestries(orchestraNames).then(() => console.log("Saved orchestraNames")),
      await addLocations(locationNames).then(() => console.log("Saved locationNames")),
      await addConcertTags(concertTagNames).then(() => console.log("Saved concertTagNames")),
      await addArrangers(arrangers).then(() => console.log("Saved arrangers")),
    ]);

    // Save concerts
    console.log("Saving concerts...");
    await addConcerts(concerts);

    // Save soloist and concert performances
    const savedCount = await addPerformances(performances);

    console.log({ savedPerformances: savedCount });
    return res.send({ savedPerformances: savedCount });
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
