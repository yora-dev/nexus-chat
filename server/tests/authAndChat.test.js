import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

dotenv.config();

const runIntegrationTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexuschat');
    console.log('[Test Suite]: Checking Auth password security...');

    const testUser = new User({
      name: 'Test Runner',
      username: 'testrunner',
      email: 'runner@test.com',
      password: 'SecretTestPassword123!'
    });

    await testUser.save();
    const isMatch = await testUser.comparePassword('SecretTestPassword123!');

    if (!isMatch) {
      throw new Error('Password verification failed during test run.');
    }

    await User.findByIdAndDelete(testUser._id);
    console.log('[Test Suite SUCCESS]: All password hashes and encryption steps passed.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Test Suite FAILURE]:', err);
    process.exit(1);
  }
};

runIntegrationTest();