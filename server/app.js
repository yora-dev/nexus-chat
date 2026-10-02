import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsOptions } from './config/corsOptions.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/apiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable Helmet for Security Headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Enable CORS
app.use(cors(corsOptions));

// Body Parsing & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// NoSQL Injection Sanitization
app.use(mongoSanitize());

// Apply Global Rate Limiting
app.use('/api', globalRateLimiter);

// Serve File Uploads Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Application Health & Diagnostics Route
app.get('/api/health', (req, res) => {
  return ApiResponse.success(res, 200, 'NexusChat Server Engine Operational', {
    status: 'ONLINE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle 404 Routes
app.use('*', (req, res) => {
  return ApiResponse.error(res, 404, `Cannot find route '${req.originalUrl}' on this server.`);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;