import { Router } from "express";

import httpError from "../utils/httpError";
import { getConcertsBySymphonyId } from "../managers/concert";

const controller = Router();

// Describe
// Get concerts by symphony id
controller.get("/symphony/:symphonyId", async (req, res, next) => {
  try {
    const symphonyId = req.params.symphonyId;

    const response = await getConcertsBySymphonyId(symphonyId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

export default controller;
