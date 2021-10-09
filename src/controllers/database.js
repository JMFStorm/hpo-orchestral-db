const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
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
    console.log("Deleted " + delMus + " musicians");
    console.log("Deleted " + delInstr + " instruments");

    // Read CSV file
    const rowObjects = await csvRowsToObjects(path);
    console.log(`Found ${rowObjects.length} CSV rows in total`);

    // Add musicians to table
    // From conductors
    const conductors = rowObjects.map((x) => x.Kapellimestari);
    console.log("Adding musicians from " + conductors.length + " conductors:");
    const c1 = await addMusicians(conductors);
    console.log("Added " + c1 + " from conductors");

    // From compositors
    let compositors = [];

    rowObjects.forEach((x) => {
      const regex1 = new RegExp("\\*");
      const regex2 = new RegExp("/");
      const current = x.Saveltaja;

      // Check for 'empty'
      if (regex1.test(current)) {
        return;
      }
      // Check for multiple in one cell
      if (regex2.test(current)) {
        const compsArr = current.split("/");
        compsArr.forEach((x) => {
          compositors.push(x.trim());
        });
      }
      return compositors.push(current);
    });

    console.log("Adding musicians from " + compositors.length + " total compositors:");
    const c2 = await addMusicians(compositors);
    console.log("Added " + c2 + " from compositors");

    // From arrangers
    const arrangers = rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const regex = new RegExp("^sov./arr.");
        const current = x.Sovittaja;

        // Filter string with regex
        if (regex.test(current)) {
          return current.substring(9).trim();
        }
        return current;
      });
    console.log("Adding musicians from " + arrangers.length + " total arrangers:");
    const c3 = await addMusicians(arrangers);
    console.log("Added " + c3 + " from compositors");

    // From soloist
    let soloists = [];
    // Collect instruments
    let instruments = [];

    rowObjects
      .filter((x) => x.Solisti.trim().length !== 0)
      .forEach((x) => {
        const regex = new RegExp(",");
        const cell = x.Solisti;
        // Check for multiple in one cell
        if (regex.test(cell)) {
          const soloistArr = cell.split(",");
          soloistArr.forEach((x) => {
            const current = x.trim();
            // Get instrument
            const regexInstrument = new RegExp("(w*)");
            console.log("current", current, regexInstrument.test(current));
            if (regexInstrument.test(current)) {
              const start = current.indexOf("(") + 1;
              const end = current.indexOf(")");
              const instrument = current.substring(start, end);
              console.log("instrument", instrument);
              if (instrument.trim().length !== 0) {
                instruments.push(instrument.trim());
              }
            }
            // Get musicians
            const soloist = current.substring(0, current.indexOf("("));
            if (soloist.trim().length !== 0) {
              soloists.push(soloist.trim());
            }
          });
        }
      });

    console.log("Adding musicians from " + soloists.length + " total soloists:");
    const c4 = await addMusicians(soloists);
    console.log("Added " + c4 + " from soloists");

    console.log("Adding instruments from " + instruments.length + " total instruments:");
    const i1 = await addInstruments(instruments);
    console.log("Added " + i1 + " from instruments");

    const totalMusicians = c1 + c2 + c3 + c4;
    const totalInstruments = i1;

    // Send response
    const results = {
      deletedMusicians: delMus,
      NewMusicians: totalMusicians,
      deletedInstruments: delInstr,
      NewInstruments: totalInstruments,
    };
    console.log("Results:", results);
    res.send(results);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
