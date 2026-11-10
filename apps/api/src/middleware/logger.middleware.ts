import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const message = `${req.method} ${req.originalUrl} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(message, undefined, { ip: req.ip, userAgent: req.get('user-agent') });
    } else if (statusCode >= 400) {
      logger.warn(message, { ip: req.ip });
    } else {
      logger.info(message);
    }
  });

  next();
}

