import { Router } from "express";

import { httpError } from "../utils/httpError";
import {
  getAllComposers,
  getAllArrangers,
  getAllConductors,
  searchComposersByStartingLetter,
  getComposersByKeyword,
  getComposerById,
  getConductorsByKeyword,
  getSoloistsByKeyword,
} from "../managers/musician";

const controller = Router();

// Describe
// Get all composers
controller.get("/composer", async (req, res, next) => {
  try {
    const response = await getAllComposers();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Search composer by keyword
controller.get("/composer/search", async (req, res, next) => {
  try {
    let keyword = req.query.keyword as string;
    const response = await getComposersByKeyword(keyword);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Search conductors by keyword
controller.get("/conductor/search", async (req, res, next) => {
  try {
    let keyword = req.query.keyword as string;
    const response = await getConductorsByKeyword(keyword);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Search soloists by keyword
controller.get("/soloist/search", async (req, res, next) => {
  try {
    let keyword = req.query.keyword as string;
    const response = await getSoloistsByKeyword(keyword);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Search composer by composer id
controller.get("/composer/composerid/:composerid", async (req, res, next) => {
  try {
    const composerId = req.params.composerid;
    const response = await getComposerById(composerId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Search composers with staring letter(s)
controller.get("/composer/lettersearch", async (req, res, next) => {
  try {
    let startingLetters = req.query.char;
    let lettersArr: string[] = [];

    if (typeof startingLetters == "string") {
      lettersArr = [startingLetters];
    } else if (startingLetters) {
      lettersArr = startingLetters as string[];
    } else {
      lettersArr = [];
    }

    const response = await searchComposersByStartingLetter(lettersArr);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
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
    return next(httpError(err));
  }
});

// Describe
// Get all arrangers
controller.get("/arrangers", async (req, res, next) => {
  try {
    const response = await getAllArrangers();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
