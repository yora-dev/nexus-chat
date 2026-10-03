import { useEffect } from 'react';
import { useSocketStore } from '../store/useSocketStore';
import { useAuthStore } from '../store/useAuthStore';

export const useSocket = () => {
  const { socket, connectSocket, disconnectSocket } = useSocketStore();
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token, connectSocket, disconnectSocket]);

  return socket;
};