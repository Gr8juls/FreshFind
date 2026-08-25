import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

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
  if (cached.mongooseConn) {
    return cached.mongooseConn;
  }

  if (!cached.mongoosePromise) {
    cached.mongoosePromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.mongooseConn = await cached.mongoosePromise;
  return cached.mongooseConn;
}

export default connectToDatabase;
