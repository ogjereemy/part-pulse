
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
}

// Placeholder for SocketContext - will be created later if needed as a provider
// For now, use a hook directly

export function useSocket(socketUrl: string) {
  const { user, session } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!user || !session?.access_token) {
      console.log('No user or token, not connecting socket.');
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      console.log('Socket already connected.');
      return;
    }

    console.log('Attempting to connect socket...');
    const newSocket = io(socketUrl, {
      auth: {
        token: session.access_token,
      },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true);
      // Auto-join personal room
      newSocket.emit('joinUserRoom', user.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      // Implement reconnect logic if necessary
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current = newSocket;
  }, [user, session, socketUrl]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('Disconnecting socket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (user && session?.access_token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, session, connect, disconnect]);

  const emit: SocketContextType['emit'] = useCallback((event, ...args) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  const on: SocketContextType['on'] = useCallback((event, callback) => {
    socketRef.current?.on(event, callback);
  }, []);

  const off: SocketContextType['off'] = useCallback((event, callback) => {
    socketRef.current?.off(event, callback);
  }, []);

  return { socket: socketRef.current, isConnected, emit, on, off };
}
