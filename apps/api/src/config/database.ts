import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export type DbConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'disconnecting';

export function getDatabaseStatus(): {
  status: DbConnectionStatus;
  name?: string;
  host?: string;
} {
  const readyState = mongoose.connection.readyState;
  const statusMap: Record<number, DbConnectionStatus> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const status = statusMap[readyState] ?? 'disconnected';
  const name = mongoose.connection.name;
  const host = mongoose.connection.host;

  return { status, name, host };
}

export async function connectDB(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully', { db: mongoose.connection.name });
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    return true;
  } catch (error) {
    logger.error('Failed to establish initial MongoDB connection', error, {
      uri: env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'),
    });
    return false;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected cleanly during shutdown');
    }
  } catch (error) {
    logger.error('Error during MongoDB disconnection', error);
  }
}
