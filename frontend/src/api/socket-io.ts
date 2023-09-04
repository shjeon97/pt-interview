import { io } from "socket.io-client";
import { Jwt } from "../constant";

export const socket = io("https://pt-interview.prod.kro.kr/", {
  transports: ["websocket"],
});
// export const socket = io("http://localhost:4000/", {
//   transports: ["websocket"],
// });
export const startTestToServer = () => {
  socket.emit("startTestToServer", { token: Jwt() });
};
