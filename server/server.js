import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err.message);
  console.error(err.stack);
  process.exit(1);
});

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect Database & Launch Application Engine
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[NexusChat Engine Active]: Running on Port ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]:', err.message);
  server.close(() => {
    process.exit(1);
  });
});