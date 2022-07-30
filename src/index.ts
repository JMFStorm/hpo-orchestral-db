import dbConnection from "./db/dbConnection";
import expressApp from "./expressApp";
import { createServer } from "http";
import { Server } from "socket.io";
import { serverPort, clientUrl } from "./utils/config";

// Connect database
dbConnection
  .then(async () => {
    console.log("HPO Orchestral DB - database connected");
  })
  .catch((error: any) => {
    console.log("Error:", error);
  });

const socketServer = createServer(expressApp);
export const io = new Server(socketServer, { cors: { origin: clientUrl } });

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  io.emit("connect_message", `Connection successfull. Hello from server, user '${socket.id}!'`);
});

socketServer.listen(serverPort, () => {
  console.log(`HPO Orchestral DB - express server initialized on port: ${serverPort}`);
});
