import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCurrentApp } from "@/components/context/app.context"; // import context
import { toast } from "sonner";

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useCurrentApp();

  useEffect(() => {
    if (socketRef.current || !user || !isAuthenticated) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("access_token"),
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      toast.error("Lost connection to chat server");
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔁 Reconnecting... attempt ${attempt}`);
      toast.warning(`Trying to reconnect... (${attempt})`);
    });

    socket.on("reconnect", (attempt) => {
      console.log("✅ Reconnected on attempt", attempt);
      toast.success("Reconnected to chat server");
      socket.emit("join", user._id); // re-join room
    });

    socket.on("reconnect_failed", () => {
      console.log("❌ Failed to reconnect");
      toast.error("Failed to reconnect. Please refresh the page.");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, isAuthenticated]);


  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
