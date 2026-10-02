import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexuschat';

  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  try {
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host} | Database -> ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Failure]: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB Warning]: Database connection lost.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB Success]: Database reconnected.');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[MongoDB Closed]: Connection terminated via app termination.');
    process.exit(0);
  });
};