import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useChatStore } from './useChatStore';

export const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (token) => {
    if (!token) return;

    const existingSocket = get().socket;
    if (existingSocket && existingSocket.connected) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') ||
      'http://localhost:5000';

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500
    });

    socket.on('connect', () => {
      console.log('[Socket Connected]');
    });

    socket.on('message:new', (message) => {
      const activeConv = useChatStore.getState().activeConversation;
      if (activeConv && String(activeConv._id) === String(message.conversation)) {
        useChatStore.getState().upsertMessage(message);
      }
      useChatStore.getState().fetchConversations();
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null });
    }
  }
}));