import { Router } from "express";

import { httpError } from "../utils/httpError";
import { getConcertsBySymphonyId, getConcertById, getAllConcerts, searchConcertsByNames } from "../managers/concert";

const controller = Router();

// Describe
// Get concerts by symphony id
controller.get("/", async (req, res, next) => {
  try {
    const response = await getAllConcerts();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get concerts by symphony id
controller.get("/symphony/:symphonyid", async (req, res, next) => {
  try {
    const symphonyId = req.params.symphonyid;

    // Expect date format: yyyy-mm-dd (1999-01-08)
    const startDate = req.query.start as string;
    const endDate = req.query.end as string;

    const start = startDate ? new Date(startDate) : new Date(1700, 1, 1);
    const end = endDate ? new Date(endDate) : new Date(4000, 1, 1);

    const response = await getConcertsBySymphonyId(symphonyId, start, end);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
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
    return next(httpError(err));
  }
});

// Describe
// Search concerts by composer, conductor and soloist name
controller.get("/combination/search", async (req, res, next) => {
  try {
    const composer = req.query.composer as string | undefined;
    const conductor = req.query.conductor as string | undefined;
    const soloist = req.query.soloist as string | undefined;

    // Expect date format: yyyy-mm-dd (1999-01-08)
    const startDate = req.query.start as string;
    const endDate = req.query.end as string;

    const chunkIndex = req.query.chunkindex as string;

    const start = startDate ? new Date(startDate) : new Date(1700, 1, 1);
    const end = endDate ? new Date(endDate) : new Date(4000, 1, 1);

    const response = await searchConcertsByNames(start, end, composer, conductor, soloist, Number(chunkIndex));
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
