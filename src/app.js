const express = require("express");
const cors = require("cors");
const path = require("path");

const { serverPort } = require("./utils/config");
const databaseController = require("./controllers/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Use cors
app.use(cors());

// Use JSON parser
app.use(express.json());

// Use static frontend files
const build = path.join(__dirname, "build");
app.use(express.static(build));

// Use routes
app.use("/api/database", databaseController);

// Use error handler endpoint
app.use(errorHandler);

module.exports = (callback) => app.listen(serverPort, callback);
