import { Router } from "express";

import httpError from "../utils/httpError";
import { addMusicians, deleteAllMusicians } from "../managers/musician";
import { addInstruments, deleteAllInstruments } from "../managers/instrument";
import { addSymphonies, deleteAllSymphonyIds } from "../managers/symphony";
import { addOrchestries, deleteAllOrchestries } from "../managers/orchestra";
import { addLocations, deleteAllLocations } from "../managers/location";
import { addConcerts, addConcertTags, deleteAllConcertTags } from "../managers/concert";
import {
  addPremiereTags,
  getAllPremiereTags,
  deleteAllPremiereTags,
} from "../managers/premiereTag";
import {
  addPerformances,
  deleteAllConcertPerformances,
  deleteAllSoloistPerformances,
} from "../managers/performance";
import { addArrangers, deleteAllArrangers } from "../managers/arrangers";
import { csvDirectoryPath, premiereTags } from "../utils/config";
import { csvRowsToObjects } from "../utils/csvRead";
import CsvRowObject from "../interfaces/CsvRowObject";
import SymphonyObject from "src/interfaces/SymphonyObject";
import ConcertObject from "src/interfaces/ConcertObject";
import PerformanceObject from "src/interfaces/PerformanceObject";
import SoloistPerformanceObject from "src/interfaces/SoloistPerformanceObject";

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", async (req, res, next) => {
  try {
    let rowObjects: CsvRowObject[] = [];

    // Read CSV file
    const csvTestFileName = req.body.csvTestFileName;

    if (csvTestFileName) {
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

    // Delete existing data
    Promise.all([
      await deleteAllConcertPerformances(),
      await deleteAllSoloistPerformances(),
      await deleteAllMusicians(),
      await deleteAllInstruments(),
      await deleteAllSymphonyIds(),
      await deleteAllOrchestries(),
      await deleteAllLocations(),
      await deleteAllConcertTags(),
      await deleteAllPremiereTags(),
      await deleteAllArrangers(),
    ]);

    console.log("Deleted existing tables.");

    // Create premiere tag tables
    console.log("Creating premiere_tag table with premiere tags:", premiereTags);
    await addPremiereTags(premiereTags);

    // Collect musicians from conductors
    let musicians: string[] = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari.trim();

      // Check for multiple in one cell
      const regex21 = new RegExp("/");

      if (regex21.test(conductor)) {
        const condsArr = conductor.split("/").map((x) => x.trim());
        condsArr.forEach((x) => {
          const cond = x.trim();

          if (!musicians.includes(cond)) {
            musicians.push(cond);
            return;
          }
        });
      } else if (conductor !== "" && !musicians.includes(conductor)) {
        musicians.push(conductor);
      }
    });

    // Collect musicians from compositors
    rowObjects.map((x) => {
      const compositor = x.Saveltaja.trim();

      // Check for 'empty'
      const regex1 = new RegExp("\\*");

      if (regex1.test(compositor) || compositor === "") {
        return;
      }

      // Check for multiple in one cell
      const regex2 = new RegExp("/");

      if (regex2.test(compositor)) {
        const compsArr = compositor.split("/").map((x) => x.trim());
        compsArr.forEach((x) => {
          const comp = x.trim();

          if (!musicians.includes(comp)) {
            musicians.push(comp);
            return;
          }
        });
      } else if (compositor !== "" && !musicians.includes(compositor)) {
        musicians.push(compositor);
      }
    });

    let arrangers: string[] = [];

    // Collect arrangers
    rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const current = x.Sovittaja;
        let arranger = current;

        // Filter string with regex
        const regex = new RegExp("^sov./arr.");

        if (regex.test(current)) {
          arranger = current.substring(9).trim();
        }

        if (!arrangers.includes(arranger)) {
          arrangers.push(arranger);
        }
      });

    // Collect instruments from soloists
    let instruments: string[] = [];

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

    // Collect symphony ids
    let symphonies: Partial<SymphonyObject>[] = [];

    rowObjects.map((row) => {
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
          console.log(
            "Something not right with brackets: ",
            indexStart,
            indexEnd,
            symphonyNameCell
          );
        }
      }

      const symphonyObj: SymphonyObject = {
        symphony_id: symphonyIdCell,
        name: symphonyName,
      };

      if (
        !symphonies.some(
          (x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name
        )
      ) {
        symphonies.push(symphonyObj);
      }
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

    rowObjects.map((row) => {
      const concertId = row.KonserttiId.trim();
      const date = row.Paivamaara.trim();
      const time = row.Aloitusaika.trim();
      const location = row.Konserttipaikka.trim();
      const tag = row.KonsertinNimike.trim();
      const orchestra = row.Orkesteri.trim();

      if (!concerts.some((x) => x.concert_id === concertId) && concertId !== "") {
        const concertObject: ConcertObject = {
          concert_id: concertId,
          date: date,
          starting_time: time,
          location: location,
          concert_tag: tag,
          orchestra: orchestra,
        };
        concerts.push(concertObject);
      }
    });

    // Collect both soloist and concert performances
    // and connect premiere tags
    let performances: PerformanceObject[] = [];

    const premiereTagObjects = await getAllPremiereTags();

    rowObjects.map((row) => {
      const soloistPerformances: SoloistPerformanceObject[] = [];
      const soloistsCell = row.Solisti;

      // Check for multiple soloists in one cell
      const soloistArr = soloistsCell.split(",");
      soloistArr.map((x) => {
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

      const conductorCell = row.Kapellimestari.trim();
      let conductorsArr: string[] = [];

      // Check for multiple conductors in cell
      // and add them for array
      conductorCell.split("/").map((x) => {
        const conductor = x.trim();
        conductorsArr.push(conductor);
      });

      const compositorCell = row.Saveltaja.trim();
      let compositorsArr: string[] = [];

      // Check for multiple compositors in cell
      // and add them for array
      compositorCell.split("/").map((x) => {
        const compositor = x.trim();
        compositorsArr.push(compositor);
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

      // Arranger regex
      let arranger = row.Sovittaja.trim();
      const regex = new RegExp("^sov./arr.");

      if (regex.test(arranger)) {
        arranger = arranger.substring(9).trim();
      }

      // Build concert performance object from the rest
      const concertId = row.KonserttiId.trim();
      const order = row.Esitysjarjestys.trim();
      const symphonyId = row.TeoksenId.trim();

      const footnote = row.TietoaKonsertista ? row.TietoaKonsertista.trim() : "";
      const archiveInfo = row.LisatietoaKonsertista ? row.LisatietoaKonsertista.trim() : "";

      const newPerformance: PerformanceObject = {
        premiere_tag: premiereTag,
        order: order,
        concertId: concertId,
        symphonyId: symphonyId,
        conductors: conductorsArr,
        compositors: compositorsArr,
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
      await addMusicians(musicians).then(() => console.log("Saved musicians")),
      await addSymphonies(symphonies).then(() => console.log("Saved symphonies")),
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
    return next(httpError(err, 404));
  }
});

export default controller;
