import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initChatSockets } from './sockets/chatSocket.js';
import { corsOptions } from './config/corsOptions.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);
initChatSockets(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[NexusChat Engine Active]: Running on Port ${PORT}`);
  });
});