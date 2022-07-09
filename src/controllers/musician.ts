import { Router } from "express";

import httpError from "../utils/httpError";
import {
  getAllCompositors,
  getAllArrangers,
  getAllConductors,
  searchCompositorsByStartingLetter,
} from "../managers/musician";

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
// Search compositors with staring letter(s)
controller.get("/compositor/lettersearch", async (req, res, next) => {
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

    const response = await searchCompositorsByStartingLetter(lettersArr);
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
// Get all arrangers
controller.get("/arrangers", async (req, res, next) => {
  try {
    const response = await getAllArrangers();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

export default controller;
