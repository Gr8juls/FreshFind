// MongoDB / Mongoose connection service replacing PrismaService
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class MongooseService implements OnModuleInit, OnModuleDestroy {
  private connection: typeof mongoose | null = null;

  async onModuleInit() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined');
    this.connection = await mongoose.connect(uri, { bufferCommands: false });
    console.log('✅ MongoDB connected');
  }

  async onModuleDestroy() {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }

  getConnection() {
    return this.connection;
  }
}
