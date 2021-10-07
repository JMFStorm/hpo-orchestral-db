const { Router } = require("express");
const Papa = require("papaparse");

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
    const fs = require("fs");
    const csvR = require("jquery-csv");
    const sample = "../csv/hpo_test_data.csv";

    fs.readFile(sample, "latin1", function (err, csv) {
      if (err) {
        console.log(err);
      }
      csvR.toArrays(csv, {}, function (err, data) {
        if (err) {
          console.log(err);
        }
        console.log("data", data);
        for (var i = 0, len = data.length; i < len; i++) {
          console.log(data[i]);
        }
      });
    });
    res.send("");
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = router;
