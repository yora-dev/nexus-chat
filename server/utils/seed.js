import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { ROLES } from '../config/constants.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexuschat');
    console.log('Clearing existing user records...');
    await User.deleteMany({});

    const admin = await User.create({
      name: 'System Admin',
      username: 'admin',
      email: 'admin@nexuschat.io',
      password: 'AdminPassword123!',
      role: ROLES.ADMIN,
      bio: 'NexusChat Senior Platform Administrator'
    });

    const user1 = await User.create({
      name: 'Alex Rivera',
      username: 'alex',
      email: 'alex@nexuschat.io',
      password: 'UserPassword123!',
      bio: 'Full Stack Architect & React Enthusiast'
    });

    const user2 = await User.create({
      name: 'Sarah Chen',
      username: 'sarah',
      email: 'sarah@nexuschat.io',
      password: 'UserPassword123!',
      bio: 'Product Designer & UI Specialist'
    });

    console.log('Seed accounts created successfully:');
    console.log(` Admin: admin@nexuschat.io | AdminPassword123!`);
    console.log(` User 1: alex@nexuschat.io  | UserPassword123!`);
    console.log(` User 2: sarah@nexuschat.io | UserPassword123!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed execution error:', err);
    process.exit(1);
  }
};

seedDatabase();