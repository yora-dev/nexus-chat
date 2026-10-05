import app from '../app.js';
import { connectDB } from '../config/db.js';

let dbConnectionPromise;

if (!dbConnectionPromise) {
  dbConnectionPromise = connectDB();
}

await dbConnectionPromise;

export default app;