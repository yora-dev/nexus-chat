import API from '../utils/axios';

export const userService = {
  getProfile: () => API.get('/auth/me'),
  updateProfile: (formData) => API.put('/users/profile', formData),
  searchUsers: (query) => API.get(`/users/search?q=${query}`)
};

export const chatService = {
  getConversations: () => API.get('/conversations'),
  getMessages: (conversationId) => API.get(`/messages/${conversationId}`),
  sendMessage: (formData) => API.post('/messages', formData)
};