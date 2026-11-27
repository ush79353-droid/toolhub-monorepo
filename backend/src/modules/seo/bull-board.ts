import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { SEO_QUEUES, getSeoQueue } from './queue';

/** Full public path. Bull Board links are rooted here. */
export function bullBoardBasePath(): string {
  return `${env.API_PREFIX}/admin/queues`;
}

function allowBoardUi(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'"
  );
  next();
}

function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const expectedUser = env.BULL_BOARD_USER || 'admin';
  const expectedPassword = env.BULL_BOARD_PASSWORD;
  if (header?.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const splitAt = decoded.indexOf(':');
    const user = splitAt === -1 ? decoded : decoded.slice(0, splitAt);
    const password = splitAt === -1 ? '' : decoded.slice(splitAt + 1);
    if (user === expectedUser && password === expectedPassword) {
      next();
      return;
    }
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
  res.status(401).send('Authentication required');
}

/** Queue UI. Null when Redis or the board password is unset. */
export function createBullBoardRouter(): Router | null {
  if (!env.REDIS_HOST.trim()) {
    logger.info('Bull Board not mounted: REDIS_HOST is empty.');
    return null;
  }
  if (!env.BULL_BOARD_PASSWORD) {
    logger.info('Bull Board not mounted: set BULL_BOARD_PASSWORD.');
    return null;
  }

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(bullBoardBasePath());
  createBullBoard({
    queues: SEO_QUEUES.map((name) => new BullMQAdapter(getSeoQueue(name))),
    serverAdapter,
  });

  const router = Router();
  router.use(allowBoardUi);
  router.use(basicAuth);
  router.use(serverAdapter.getRouter());
  return router;
}
