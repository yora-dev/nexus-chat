import { create } from 'zustand';
import API from '../utils/axios';
import { upsertMessage } from './messageUtils.js';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const res = await API.get('/conversations');
      set({ conversations: res.data.data.conversations, loadingConversations: false });
    } catch (err) {
      set({ loadingConversations: false });
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
    if (conversation) {
      get().fetchMessages(conversation._id);
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const res = await API.get(`/messages/${conversationId}`);
      set({ messages: res.data.data.messages, loadingMessages: false });
    } catch (err) {
      set({ loadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({ messages: upsertMessage(state.messages, message) }));
  },

  upsertMessage: (message) => {
    set((state) => ({ messages: upsertMessage(state.messages, message) }));
  },

  addConversation: (conversation) => {
    set((state) => {
      const existingIndex = state.conversations.findIndex(
        (item) => String(item._id) === String(conversation._id),
      );

      if (existingIndex === -1) {
        return { conversations: [conversation, ...state.conversations] };
      }

      const updatedConversations = [...state.conversations];
      updatedConversations[existingIndex] = conversation;

      return { conversations: updatedConversations };
    });
  }
}));