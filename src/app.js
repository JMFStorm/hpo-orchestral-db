const express = require("express");
const cors = require("cors");
const path = require("path");

const { serverPort } = require("./utils/config");
const databaseController = require("./controllers/database");
const errorHandler = require("./middleware/errorHandler");
const { urlencoded } = require("express");

const app = express();

// Use cors
app.use(cors());

app.use(express.json());
app.use(urlencoded({ extended: true }));

// Use static frontend files
const build = path.join(__dirname, "build");
app.use(express.static(build));

// Use routes
app.use("/api/database", databaseController);

// Use error handler endpoint
app.use(errorHandler);

module.exports = (callback) => app.listen(serverPort, callback);
