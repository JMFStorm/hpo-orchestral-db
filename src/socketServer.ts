import { createServer } from "http";
import { Server } from "socket.io";

import expressApp from "./expressApp";

const socketServer = createServer(expressApp);

const io = new Server(socketServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  io.emit("connect_message", `Connection successfull. Hello from server, user '${socket.id}!'`);
});

export const seedLog = (message: string, type: string = "default") => {
  console.log(message);
  const data = { type: type ?? "default", message: message };
  io.emit("db_seed", data);
};

export default socketServer;
