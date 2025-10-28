
import { io, Socket } from 'socket.io-client';

export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://[::1]:4000';

let globalSocket: Socket | null = null;

export const getSocket = (token?: string | null) => {
  if (!globalSocket && token) {
    globalSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    globalSocket.on('connect', () => {
      console.log('Socket connected!');
    });

    globalSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      globalSocket = null;
    });

    globalSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      globalSocket = null;
    });
  }
  return globalSocket;
};

// You can also export the io function directly if needed
export { io };
