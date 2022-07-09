import { Router } from "express";

import httpError from "../utils/httpError";
import { getAllPremiereTags } from "../managers/premiereTag";
import {
  getAllPerformances,
  getPerformancesByPerformanceId,
  getPerformancesByConductorId,
  getPerformancesByCompositorId,
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
    return next(httpError(err, 404));
  }
});

// Describe
// Get all performance by performace id
controller.get("/:id", async (req, res, next) => {
  try {
    const performaceId = req.params.id;
    const response = await getPerformancesByPerformanceId(performaceId);

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
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
    return next(httpError(err, 404));
  }
});

// Describe
// Get performances by compositor id
controller.get("/compositor/:id", async (req, res, next) => {
  try {
    const compositorId = req.params.id;

    const response = await getPerformancesByCompositorId(compositorId);

    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
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
    return next(httpError(err, 404));
  }
});

export default controller;
