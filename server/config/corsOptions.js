const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) return true;
  return /^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(origin);
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};