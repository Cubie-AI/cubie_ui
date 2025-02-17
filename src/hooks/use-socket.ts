import { useEffect } from "react";
import { io } from "socket.io-client";
export function useSocket() {
  const socket = io();

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, [socket]);

  return socket;
}
