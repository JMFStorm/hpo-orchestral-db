require("dotenv").config();

const dbConnection = require("./db/dbConnection");
const appStart = require("./app");

// Connect database
dbConnection
  .then(async (connection) => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

// Listen express app
appStart(() => {
  console.log(`HPO Orchestral DB - server initialized`);
});
