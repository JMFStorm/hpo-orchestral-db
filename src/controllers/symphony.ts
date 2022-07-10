import { Router } from "express";

import { getAllSymphonies } from "../managers/symphony";
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

export default controller;
