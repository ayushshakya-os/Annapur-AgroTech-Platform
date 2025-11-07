import { io, Socket } from "socket.io-client";

// If your Socket.IO server is on a different origin, set NEXT_PUBLIC_SOCKET_URL
// e.g. NEXT_PUBLIC_SOCKET_URL="https://api.example.com"
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL &&
  process.env.NEXT_PUBLIC_SOCKET_URL !== ""
    ? process.env.NEXT_PUBLIC_SOCKET_URL
    : undefined;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL ?? "", {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
