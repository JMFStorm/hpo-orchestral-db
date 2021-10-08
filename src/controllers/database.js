const { Router } = require("express");

const httpError = require("../utils/httpError");
const {
  createCompositors,
  deleteAllCompositors,
} = require("../managers/compositor");
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
    const d = await deleteAllCompositors();
    console.log("Deleted " + d + " compositors");

    // Read CSV file
    const objects = await csvRowsToObjects(path);
    console.log(`Found ${objects.length} CSV rows in total`);

    // Add compositors to table
    const compositors = objects.map((x) => x.Säveltäjä);
    const c = await createCompositors(compositors);
    console.log("Added " + c + " compositors");

    // Send response
    const results = {
      deletedCompositors: d,
      newCompositors: c,
    };
    console.log("Results:", results);
    res.send(results);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
