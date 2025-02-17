import { useEffect } from "react";
import { io } from "socket.io-client";
export function useSocket() {
  const socket = io({
    autoConnect: false,
    retries: 10,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnection: true,
  });

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, [socket]);

  return socket;
}
