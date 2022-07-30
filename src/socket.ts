import { io } from "./index";

export const seedLog = (message: string, type: string = "default", completed: boolean = false) => {
  console.log(message);
  const data = { type: type ?? "default", message: message, completed: completed };
  io.emit("db_seed", data);
};
