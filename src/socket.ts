import { io } from "socket.io-client";

const socket = io("https://vedic-app-server.onrender.com", {

  withCredentials: true,
});

export default socket;
