const typeorm = require("typeorm");

const { connectionConfig } = require("./db/dbConnection");
const expressApp = require("./app");
const { serverPort } = require("./utils/config");

// Connect database
typeorm
  .createConnection(connectionConfig)
  .then(async () => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

// Listen express app
expressApp.listen(serverPort, () => {
  console.log(`HPO Orchestral DB - server initialized on port: ${serverPort}`);
});
