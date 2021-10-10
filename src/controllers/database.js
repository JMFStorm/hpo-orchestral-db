const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
const { addSymphonies, deleteAllSymphonyIds, deleteAllSymphonyNames } = require("../managers/symphony");
const { csvTestFilePath } = require("../utils/config");
const { csvRowsToObjects } = require("../utils/csvRead");

const csvFilePath = csvTestFilePath;

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.get("/seed", async (req, res, next) => {
  try {
    // Delete existing data
    const path = csvFilePath;
    const delMus = await deleteAllMusicians();
    const delInstr = await deleteAllInstruments();
    const delSymNameId = await deleteAllSymphonyNames();
    const delSymId = await deleteAllSymphonyIds();

    // Read CSV file
    const rowObjects = await csvRowsToObjects(path);

    // Add musicians to table

    // Add musicians to table
    // From conductors
    let musicians = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari;

      if (!musicians.some((x) => x === conductor)) {
        musicians.push(conductor);
      }
    });

    // Add musicians to table
    // From compositors
    rowObjects.map((x) => {
      const regex1 = new RegExp("\\*");
      const regex2 = new RegExp("/");
      const compositor = x.Saveltaja;

      // Check for 'empty'
      if (regex1.test(compositor)) {
        return;
      }

      // Check for multiple in one cell
      if (regex2.test(compositor)) {
        const compsArr = compositor.split("/");
        compsArr.map((comp) => {
          if (!musicians.some((x) => x === comp)) {
            musicians.push(comp.trim());
            return;
          }
        });
      }

      if (!musicians.some((x) => x === compositor)) {
        musicians.push(compositor);
      }
    });

    // Add musicians to table
    // From arrangers
    rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const regex = new RegExp("^sov./arr.");
        const current = x.Sovittaja;

        // Filter string with regex
        if (regex.test(current)) {
          musicians.push(current.substring(9).trim());
          return;
        }
        musicians.push(current);
      });

    // Add musicians to table
    // From soloist and collect instruments
    let instruments = [];

    rowObjects
      .filter((x) => x.Solisti.trim().length !== 0)
      .map((x) => {
        const regex = new RegExp(",");
        const cell = x.Solisti;
        // Check for multiple in one cell
        if (regex.test(cell)) {
          const soloistArr = cell.split(",");
          // loop
          soloistArr.map((x) => {
            const current = x.trim();
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
            // Get musicians
            const soloist = current.substring(0, current.indexOf("("));
            if (soloist.trim().length !== 0) {
              musicians.push(soloist.trim());
            }
          });
        }
      });

    // Add symphony ids to table
    let symphonies = [];

    rowObjects.map((row) => {
      const symphonyIdCell = row.TeoksenId;
      const symphonyNameCell = row.TeoksenNimi;

      // Create symphony objects
      const symphonyObj = {
        symphony_id: symphonyIdCell,
        name: symphonyNameCell,
      };

      if (!symphonies.some((x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name)) {
        symphonies.push(symphonyObj);
      }
    });

    // Save everything collected
    const musicianRes = await addMusicians(musicians);
    const symphoniesAdded = await addSymphonies(symphonies);
    const instrumentRes = await addInstruments(instruments);

    // Send response
    const results = {
      deletedMusicians: delMus,
      newMusicians: musicianRes,
      deletedInstruments: delInstr,
      newInstruments: instrumentRes,
      deletedSymphonyIds: delSymId,
      deletedSymphonyNames: delSymNameId,
      newSymphonies: symphoniesAdded,
    };

    console.log("Results:", results);
    res.send(results);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
