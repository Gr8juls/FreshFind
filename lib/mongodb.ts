import mongoose from 'mongoose';

// Global cache to prevent reconnecting on every hot-reload in dev
const globalForMongoose = global as unknown as {
  mongooseConn: typeof mongoose | null;
  mongoosePromise: Promise<typeof mongoose> | null;
};

let cached = globalForMongoose;

if (!cached.mongooseConn) {
  cached.mongooseConn = null;
  cached.mongoosePromise = null;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
    throw new Error('Please define the MONGODB_URI environment variable in your deployment environment.');
  }

  if (cached.mongooseConn) {
    return cached.mongooseConn;
  }

  if (!cached.mongoosePromise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.mongoosePromise = mongoose.connect(uri, opts).then((m) => {
      console.log('MongoDB connected successfully');
      return m;
    }).catch((err) => {
      console.error('MongoDB connection error:', err.message);
      cached.mongoosePromise = null;
      throw err;
    });
  }

  try {
    cached.mongooseConn = await cached.mongoosePromise;
  } catch (e) {
    cached.mongoosePromise = null;
    throw e;
  }

  return cached.mongooseConn;
}

export default connectToDatabase;
