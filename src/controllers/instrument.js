const { Router } = require("express");

const httpError = require("../utils/httpError");
const { getAllInstruments } = require("../managers/instrument");

// Make env var!
const csvFilePath = "../csv/hpo_test_data.csv";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const response = await getAllInstruments();
    res.send(response);
  } catch (err) {
    return next(httpError(err, 404));
  }
});

// Get test data
router.get("/data", async (req, res, next) => {
  try {
    const fs = require("fs").promises;
    const csvReader = require("jquery-csv");
    const sample = csvFilePath;

    const fileText = await fs.readFile(sample, "latin1", (err) => {
      if (err) {
        console.error(err);
      }
    });

    let result = [];

    csvReader.toObjects(fileText, {}, (err, data) => {
      if (err) {
        console.log(err);
      }
      result = data;
    });

    res.send(result);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = router;
