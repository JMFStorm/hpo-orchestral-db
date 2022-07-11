import { Router } from "express";

import httpError from "../utils/httpError";
import { getConcertsBySymphonyId, getConcertById } from "../managers/concert";

const controller = Router();

// Describe
// Get concerts by symphony id
controller.get("/symphony/:symphonyid", async (req, res, next) => {
  try {
    const symphonyId = req.params.symphonyid;

    const response = await getConcertsBySymphonyId(symphonyId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

// Describe
// Get concert by id
controller.get("/:concertid", async (req, res, next) => {
  try {
    const concertId = req.params.concertid;

    const response = await getConcertById(concertId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

export default controller;
