import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useChatStore } from './useChatStore';

export const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (token) => {
    if (get().socket) return;

    const socket = io('/', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('[Socket Connected]');
    });

    socket.on('message:new', (message) => {
      const activeConv = useChatStore.getState().activeConversation;
      if (activeConv && activeConv._id === message.conversation) {
        useChatStore.getState().addMessage(message);
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