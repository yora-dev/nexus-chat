import { User } from '../models/User.js';

const onlineUsers = new Map(); // userId -> Set of socketIds

export const initChatSockets = (io) => {
  io.use(async (socket, next) => {
    const { socketAuth } = await import('./socketAuth.js');
    return socketAuth(socket, next);
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('user:online', { userId });

    socket.on('join:conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        conversationId,
        user: { id: socket.user._id, name: socket.user.name, username: socket.user.username }
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        conversationId,
        userId: socket.user._id
      });
    });

    socket.on('disconnect', async () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          const lastSeen = new Date();
          await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
          io.emit('user:offline', { userId, lastSeen });
        }
      }
    });
  });
};