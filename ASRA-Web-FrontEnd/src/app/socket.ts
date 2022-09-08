import React from "react";
import io from "socket.io-client";
const PRODUCTION_BASE_URL = "14.225.254.106";
const DEVELOPMENT_BASE_URL = "localhost";

export const socket = io(`http://${PRODUCTION_BASE_URL}:5001`, {
  reconnection: true,
  transports: ["websocket"],
});

export const SocketContext = React.createContext<any>(null);
