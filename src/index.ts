import dbConnection from "./db/dbConnection";
import expressApp from "./expressApp";
import socketServer from "./socketServer";
import { serverPort } from "./utils/config";

// Connect database
dbConnection
  .then(async () => {
    console.log("HPO Orchestral DB - database connected");
  })
  .catch((error: any) => {
    console.log("Error:", error);
  });

const socketServerPort = Number(serverPort) + 1;

socketServer.listen(socketServerPort, () => {
  console.log(`HPO Orchestral DB - socket server initialized on port: ${socketServerPort}`);
});

expressApp.listen(serverPort, () => {
  console.log(`HPO Orchestral DB - express server initialized on port: ${serverPort}`);
});
