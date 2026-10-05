import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initChatSockets } from './sockets/chatSocket.js';
import { corsOptions } from './config/corsOptions.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(
  { path: path.resolve(__dirname, '/.env') }
);

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