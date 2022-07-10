import { Router } from "express";

import { getAllSymphonies, getSymphoniesByComposerId } from "../managers/symphony";
import httpError from "../utils/httpError";

const controller = Router();

// Describe
// Get symphonies by compositor id
controller.get("/", async (req, res, next) => {
  try {
    const response = await getAllSymphonies();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

// Describe
// Get symphonies by compositor id
controller.get("/compositor/:composerid", async (req, res, next) => {
  try {
    const composerId = req.params.composerid;

    const response = await getSymphoniesByComposerId(composerId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

export default controller;
