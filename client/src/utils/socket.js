// src/utils/socket.js
import io from "socket.io-client";

let socket;

export const Socket = {
  connect: (userId) => {
    socket = io(import.meta.env.VITE_API_URL, {
      query: { userId },
      transports: ["websocket"],
    });
    return socket;
  },
  getSocket: () => socket,
  disconnect: () => {
    if (socket) socket.disconnect();
  },
};
