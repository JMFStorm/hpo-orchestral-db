const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
const { addSymphonies, deleteAllSymphonyIds, deleteAllSymphonyNames } = require("../managers/symphony");
const { addOrchestries, deleteAllOrchestries } = require("../managers/orchestra");
const { addLocations, deleteAllLocations } = require("../managers/location");
const { addConcerts, addConcertTags, deleteAllConcertTags } = require("../managers/concert");
const { csvTestFilePath } = require("../utils/config");
const { csvRowsToObjects } = require("../utils/csvRead");

const csvFilePath = csvTestFilePath;

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.get("/seed", async (req, res, next) => {
  try {
    // Delete existing data
    Promise.all([
      await deleteAllMusicians(),
      await deleteAllInstruments(),
      await deleteAllSymphonyNames(),
      await deleteAllSymphonyIds(),
      await deleteAllOrchestries(),
      await deleteAllLocations(),
      await deleteAllConcertTags(),
    ]);

    // Read CSV file
    const path = csvFilePath;
    const rowObjects = await csvRowsToObjects(path);

    // Collect musicians from conductors
    let musicians = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari.trim();

      if (conductor !== "" && !musicians.includes(conductor)) {
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
        compsArr.map((x) => {
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

    // >>>>>>>>>>>>>>>>>>> CONTINUE DEBUG FROM HERE<<<<<<<<<<<<<<<<<<

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
            const instrument = current.substring(start, end);

            if (instrument.trim().length !== 0) {
              instruments.push(instrument.trim());
            }
          }
        });
      });

    // Collect symphony ids
    let symphonies = [];

    rowObjects.map((row) => {
      const symphonyIdCell = row.TeoksenId;
      const symphonyNameCell = row.TeoksenNimi;

      const symphonyObj = {
        symphony_id: symphonyIdCell,
        name: symphonyNameCell,
      };

      if (!symphonies.some((x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name)) {
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

    // Save all 'loosely' collected
    Promise.all([
      await addMusicians(musicians),
      await addSymphonies(symphonies),
      await addInstruments(instruments),
      await addOrchestries(orchestraNames),
      await addLocations(locationNames),
      await addConcertTags(concertTagNames),
    ]);

    // Save concerts
    await addConcerts(concerts);

    // Save both concert and intrument performances

    console.log("Seed successfull");
    res.send("Seed successfull");
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
