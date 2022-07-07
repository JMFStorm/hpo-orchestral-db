const { Router } = require("express");

const httpError = require("../utils/httpError");
const { getAllCompositors, getAllArrangers, getAllConductors } = require("../managers/musician");

const controller = Router();

// Describe
// Get all compositors
controller.get("/compositor", async (req, res, next) => {
  try {
    const response = await getAllCompositors();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

// Describe
// Get all conductors
controller.get("/conductor", async (req, res, next) => {
  try {
    const response = await getAllConductors();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

// Describe
// Get all conductors
controller.get("/arrangers", async (req, res, next) => {
  try {
    const response = await getAllArrangers();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
