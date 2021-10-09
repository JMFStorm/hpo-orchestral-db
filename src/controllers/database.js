const { Router } = require("express");

const httpError = require("../utils/httpError");
const { createMusicians, deleteAllMusicians } = require("../managers/musician");
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
    const d = await deleteAllMusicians();
    console.log("Deleted " + d + " musicians");

    // Read CSV file
    const rowObjects = await csvRowsToObjects(path);
    console.log(`Found ${rowObjects.length} CSV rows in total`);

    // Add musicians to table
    // From conductors
    const conductors = rowObjects.map((x) => x.Kapellimestari);
    console.log("Adding musicians from " + conductors.length + " conductors:");
    const c1 = await createMusicians(conductors);
    console.log("Added " + c1 + " from conductors");

    // From compositors
    let compositors = [];

    rowObjects.forEach((x) => {
      const regex1 = new RegExp("\\*");
      const regex2 = new RegExp("/");
      const current = x.Säveltäjä;

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
    const c2 = await createMusicians(compositors);
    console.log("Added " + c2 + " from compositors");

    // From arrangers
    const arrangers = rowObjects
      .map((x) => {
        const regex = new RegExp("^sov./arr.");
        const current = x.Sovittaja;

        // Filter string with regex
        if (regex.test(current)) {
          return current.substring(9).trim();
        }
        return current;
      })
      .filter((x) => x.trim().length !== 0);
    console.log("Adding musicians from " + arrangers.length + " total arrangers:");
    const c3 = await createMusicians(arrangers);
    console.log("Added " + c3 + " from compositors");

    const totalMusicians = c1 + c2 + c3;

    // Send response
    const results = {
      deletedMusicians: d,
      NewMusicians: totalMusicians,
    };
    console.log("Results:", results);
    res.send(results);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
