import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useChatStore } from './useChatStore';

export const useSocketStore = create((set, get) => ({
  socket: null,

  connectSocket: (token) => {
    if (get().socket) return;

    const socketUrl =
      (import.meta.env.VITE_API_BASE_URL || import.meta.env.SERVER_URL || 'https://nexus-chat-ten-pi.vercel.app/api').replace(/\/api$/, '');

    const socket = io(socketUrl, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('[Socket Connected]');
    });

    socket.on('message:new', (message) => {
      const activeConv = useChatStore.getState().activeConversation;
      if (activeConv && String(activeConv._id) === String(message.conversation)) {
        const { messages, addMessage } = useChatStore.getState();
        const alreadyPresent = messages.some((existingMessage) => {
          return String(existingMessage._id) === String(message._id);
        });

        if (!alreadyPresent) {
          addMessage(message);
        }
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