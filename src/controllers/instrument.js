const { Router } = require("express");

const httpError = require("../utils/httpError");
const { getAllInstruments } = require("../managers/instrument");

const instrumentController = Router();

// Get all instruments
instrumentController.get("/", async (req, res, next) => {
  try {
    const response = await getAllInstruments();
    res.send(response);
  } catch (err) {
    return next(httpError(err, 404));
  }
});

module.exports = instrumentController;
