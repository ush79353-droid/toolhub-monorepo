import type { Server } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/database';
import { logger } from './utils/logger';

let server: Server | null = null;

async function bootstrap(): Promise<void> {
  const app = createApp();

  // Attempt database connection (non-blocking for server initialization)
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      logger.warn('Initial MongoDB connection failed. Server will continue with degraded state.');
    }
  } catch (err) {
    logger.error('Unexpected error while connecting to MongoDB', err);
  }

  // Start HTTP server
  server = app.listen(env.PORT, () => {
    logger.info(`🚀 Mega Tools API server running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
    logger.info(`👉 Health Check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  });

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        logger.info('Graceful shutdown completed. Exiting process.');
        process.exit(0);
      });

      // Force shutdown if cleanup takes too long
      setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing process termination.');
        process.exit(1);
      }, 10000);
    } else {
      await disconnectDB();
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection detected', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception detected', error);
    process.exit(1);
  });
}

bootstrap();

