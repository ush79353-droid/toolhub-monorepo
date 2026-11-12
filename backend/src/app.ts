import path from 'path';
import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { requestLogger } from './middleware/logger.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';
import { healthRouter } from './modules/health/health.router';
import { adminAuthRouter } from './modules/auth/admin-auth.router';
import { categoryRouter } from './modules/categories/category.router';
import { mediaRouter } from './modules/media/media.router';
import { toolRouter } from './modules/tools/tool.router';
import { catalogRouter } from './modules/catalog/catalog.router';

export function createApp(): Application {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Performance & Parsing Middleware
  app.use(compression());
  app.use(express.json({ limit: env.BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: env.BODY_LIMIT }));

  // Logging Middleware
  app.use(requestLogger);

  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), env.UPLOAD_DIR), {
      fallthrough: false,
      index: false,
      dotfiles: 'deny',
    })
  );

  // API v1 Routes
  const v1Router = express.Router();
  v1Router.use('/health', healthRouter);
  v1Router.use('/admin/auth', adminAuthRouter);
  v1Router.use('/admin/categories', categoryRouter);
  v1Router.use('/admin/media', mediaRouter);
  v1Router.use('/admin/tools', toolRouter);
  v1Router.use('/catalog', catalogRouter);

  // Mount versioned API
  app.use(env.API_PREFIX, v1Router);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
