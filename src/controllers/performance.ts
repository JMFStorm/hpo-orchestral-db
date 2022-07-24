import { Router } from "express";

import { httpError } from "../utils/httpError";
import { getAllPremiereTags } from "../managers/premiereTag";
import {
  getAllPerformances,
  getPerformancesByConductorId,
  getPerformancesByComposerAndPremiereTag,
  getAllPremieresByComposerId,
} from "../managers/performance";

const controller = Router();

// Describe
// Get all performances
controller.get("/", async (req, res, next) => {
  try {
    const response = await getAllPerformances();

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get performances by conductor id
controller.get("/conductor/:id", async (req, res, next) => {
  try {
    const conductorId = req.params.id;

    const response = await getPerformancesByConductorId(conductorId);

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get performances by composer id and premiere tag
controller.get("/composer/:composerid", async (req, res, next) => {
  try {
    const composerId = req.params.composerid;
    const premieretags = req.query.premieretagid;

    let tagsArr: string[] = [];

    if (typeof premieretags == "string") {
      tagsArr = [premieretags];
    } else if (premieretags) {
      tagsArr = premieretags as string[];
    } else {
      tagsArr = [];
    }
    const response = await getPerformancesByComposerAndPremiereTag(composerId, tagsArr);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get all premiere tags
controller.get("/premieretag", async (req, res, next) => {
  try {
    const response = await getAllPremiereTags();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get all premieres by composer id
controller.get("/premiere/composer/:composerid", async (req, res, next) => {
  try {
    const composerId = req.params.composerid;
    const response = await getAllPremieresByComposerId(composerId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
