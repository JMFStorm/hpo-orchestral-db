const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
const { addSymphonies, deleteAllSymphonyIds, deleteAllSymphonyNames } = require("../managers/symphony");
const { addOrchestries, deleteAllOrchestries } = require("../managers/orchestra");
const { addLocations, deleteAllLocations } = require("../managers/location");
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
    const delOrch = await deleteAllOrchestries();
    const delLocation = await deleteAllLocations();

    // Read CSV file
    const rowObjects = await csvRowsToObjects(path);

    // Collect musicians from conductors
    let musicians = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari;

      if (!musicians.some((x) => x === conductor)) {
        musicians.push(conductor);
      }
    });

    // Collect musicians from compositors
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

    // Collect musicians from arrangers
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

    // Collect instruments from soloists
    let instruments = [];

    // And collect musicians from soloist
    rowObjects
      .filter((x) => x.Solisti.trim().length !== 0)
      .map((x) => {
        const regex = new RegExp(",");
        const cell = x.Solisti;
        // Check for multiple in one cell
        if (regex.test(cell)) {
          const soloistArr = cell.split(",");
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

    // Save everything collected
    const musicianRes = await addMusicians(musicians);
    const symphoniesRes = await addSymphonies(symphonies);
    const instrumentRes = await addInstruments(instruments);
    const orchestriesRes = await addOrchestries(orchestraNames);
    const locationsRes = await addLocations(locationNames);

    // Send response
    const results = {
      deletedMusicians: delMus,
      deletedInstruments: delInstr,
      deletedSymphonyIds: delSymId,
      deletedSymphonyNames: delSymNameId,
      deletedOrchestries: delOrch,
      deletedLocations: delLocation,
      newMusicians: musicianRes,
      newInstruments: instrumentRes,
      newSymphonies: symphoniesRes,
      newOrchestries: orchestriesRes,
      newLocations: locationsRes,
    };

    console.log("Results:", results);
    res.send(results);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
