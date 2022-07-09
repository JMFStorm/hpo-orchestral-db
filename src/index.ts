import dbConnection from "./db/dbConnection";
import expressApp from "./app";
import { serverPort } from "./utils/config";

// Connect database
dbConnection
  .then(async () => {
    console.log("Database connected");
  })
  .catch((error: any) => {
    console.log("Error:", error);
  });

// Listen express app
expressApp.listen(serverPort, () => {
  console.log(`HPO Orchestral DB - server initialized on port: ${serverPort}`);
});
