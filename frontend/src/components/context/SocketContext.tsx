import { useCurrentApp } from '@/components/context/AppContext';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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
			withCredentials: true,
			transports: ['websocket'],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			console.log('✅ Socket connected:', socket.id);
			setIsConnected(true);
		});

		socket.on('disconnect', (reason) => {
			console.warn('❌ Socket disconnected:', reason);
			setIsConnected(false);
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
