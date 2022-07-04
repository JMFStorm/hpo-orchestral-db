const express = require("express");
const cors = require("cors");
const path = require("path");

const databaseController = require("./controllers/database");
const performanceController = require("./controllers/performance");
const musicianController = require("./controllers/musician");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Use cors
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use static frontend files
const build = path.join(__dirname, "build");
app.use(express.static(build));
console.log("Using static page files from: ", build);

// Use routes
app.use("/api/database", databaseController);
app.use("/api/performance", performanceController);
app.use("/api/musician", musicianController);

// Use error handler endpoint
app.use(errorHandler);

module.exports = app;
