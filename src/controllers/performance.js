const { Router } = require("express");

const { getAllPerformances, getPerformancesByCompositorId } = require("../managers/performance");

const controller = Router();

// Describe
// Get all performances by
controller.get("/", async (req, res, next) => {
  try {
    const response = await getAllPerformances();

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

// Describe
// Get performances by compositor id
controller.get("/compositor/:id", async (req, res, next) => {
  try {
    const conductorId = req.params.id;

    const response = await getPerformancesByCompositorId(conductorId);

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
