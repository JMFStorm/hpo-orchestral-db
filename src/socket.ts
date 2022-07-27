import { io } from "./index";

export const seedLog = (message: string, type: string = "default") => {
  console.log(message);
  const data = { type: type ?? "default", message: message };
  io.emit("db_seed", data);
};
