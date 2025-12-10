import { io } from 'socket.io-client';
import { apiConfig } from './mockConfig';

export const createSocketConnection = () => {
  const socket = io(apiConfig.baseURL, {
    withCredentials: true,
    transports: ['websocket'],
    path: '/socket.io',
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect_error', (error) => {
    console.warn('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('Socket disconnected:', reason);
  });

  return socket;
};