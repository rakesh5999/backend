import { io } from "socket.io-client";

export const initailzeSocketConnection = () => {
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  })

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server")
  })

  return socket
}