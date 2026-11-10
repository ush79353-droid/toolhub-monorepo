import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // If response has already started streaming, delegate to default express handler
  if (res.headersSent) {
    return next(err as Error);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.warn(`Validation error on ${req.method} ${req.originalUrl}`, { issues: err.issues });
    sendError(res, 'Request validation failed', 400, 'VALIDATION_ERROR', err.format());
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`Application error: ${err.message}`, err, { code: err.code, details: err.details });
    } else {
      logger.warn(`Client error [${err.statusCode}]: ${err.message}`);
    }
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  // Handle JSON parse errors from body-parser
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    logger.warn('Malformed JSON received in request body');
    sendError(res, 'Invalid JSON payload received', 400, 'BAD_REQUEST');
    return;
  }

  // Fallback for unhandled unexpected errors
  logger.error('Unhandled server exception', err, {
    method: req.method,
    url: req.originalUrl,
  });

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred'
      : err instanceof Error
        ? err.message
        : 'Unknown error';

  sendError(res, message, 500, 'INTERNAL_SERVER_ERROR', err);
}
