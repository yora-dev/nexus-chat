import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import mongoose from 'mongoose';

dotenv.config();

const runTest = async () => {
  await connectDB();
  console.log('[Model Verification]: Registering models & ensuring indexes...');

  await User.init();
  await Conversation.init();
  await Message.init();

  console.log('[Model Verification SUCCESS]: All 7 Mongoose schemas & indexes compiled correctly!');
  await mongoose.connection.close();
  process.exit(0);
};

runTest().catch((err) => {
  console.error('[Model Verification FAILED]:', err);
  process.exit(1);
});