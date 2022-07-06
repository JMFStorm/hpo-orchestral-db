const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
const { addSymphonies, deleteAllSymphonyIds } = require("../managers/symphony");
const { addOrchestries, deleteAllOrchestries } = require("../managers/orchestra");
const { addLocations, deleteAllLocations } = require("../managers/location");
const { addConcerts, addConcertTags, deleteAllConcertTags } = require("../managers/concert");
const {
  addPremiereTags,
  getAllPremiereTags,
  deleteAllPremiereTags,
} = require("../managers/premiereTag");
const {
  addPerformances,
  deleteAllConcertPerformances,
  deleteAllSoloistPerformances,
} = require("../managers/performance");
const { csvDirectoryPath, premiereTags } = require("../utils/config");
const { csvRowsToObjects } = require("../utils/csvRead");

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", async (req, res, next) => {
  try {
    // Read CSV file
    const csvFileName = req.body.csvFileName;
    const csvPath = csvDirectoryPath + csvFileName;

    console.log(`Using ${csvPath} as seed filepath`);

    const rowObjects = await csvRowsToObjects(csvPath);

    if (!csvPath || !rowObjects?.length > 0) {
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
    ]);

    console.log("Deleted existing tables.");

    // Create premiere tag tables
    console.log("Creating premiere_tag table with premiere tags:", premiereTags);
    await addPremiereTags(premiereTags);

    // Collect musicians from conductors
    let musicians = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari.trim();

      // Check for multiple in one cell
      const regex21 = new RegExp("/");

      if (regex21.test(conductor)) {
        console.log("Found multiple conductors", conductor);
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
      }

      if (!musicians.includes(compositor)) {
        musicians.push(compositor);
      }
    });

    // Collect musicians from arrangers
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

        if (!musicians.includes(arranger)) {
          musicians.push(arranger);
        }
      });

    // Collect instruments from soloists
    let instruments = [];

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
    let symphonies = [];

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

      const symphonyObj = {
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
    let orchestraNames = [];

    rowObjects.map((row) => {
      const orchestra = row.Orkesteri;
      if (!orchestraNames.some((x) => x === orchestra) && orchestra.trim() !== "") {
        orchestraNames.push(orchestra);
      }
    });

    // Collect locations
    let locationNames = [];

    rowObjects.map((row) => {
      const location = row.Konserttipaikka;
      if (!locationNames.some((x) => x === location) && location.trim() !== "") {
        locationNames.push(location);
      }
    });

    // Collect concert tags
    let concertTagNames = [];

    rowObjects.map((row) => {
      const tag = row.KonsertinNimike.trim();
      if (!concertTagNames.includes(tag) && tag !== "") {
        concertTagNames.push(tag);
      }
    });

    // Collect concerts
    let concerts = [];

    rowObjects.map((row) => {
      const concertId = row.KonserttiId.trim();
      const date = row.Paivamaara.trim();
      const time = row.Aloitusaika.trim();
      const location = row.Konserttipaikka.trim();
      const tag = row.KonsertinNimike.trim();
      const orchestra = row.Orkesteri.trim();

      if (!concerts.some((x) => x.concert_id === concertId) && concertId !== "") {
        const concertObject = {
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
    let performances = [];

    const premiereTagObjects = await getAllPremiereTags();

    rowObjects.map((row) => {
      const soloistPerformances = [];
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

      // Initialize defaults
      let newPerformance = {};
      const symphonyNameCell = row.TeoksenNimi.trim();

      // Check for premeiere tag in name cell
      premiereTags.forEach(async (tag) => {
        if (symphonyNameCell.match(tag.regex)) {
          const premiereTagObject = premiereTagObjects.find((x) => x.name === tag.sqlName);

          if (premiereTagObject) {
            newPerformance.premiere_tag = premiereTagObject.name;
            console.log(`Added premier tag '${premiereTagObject.name}' for ${symphonyNameCell}`);
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
      const conductor = row.Kapellimestari.trim();
      const compositor = row.Saveltaja.trim();

      newPerformance = {
        ...newPerformance,
        order: order,
        concertId: concertId,
        symphonyId: symphonyId,
        conductors: [conductor],
        compositor: compositor,
        arranger: arranger,
        soloist_performances: soloistPerformances,
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

module.exports = controller;
