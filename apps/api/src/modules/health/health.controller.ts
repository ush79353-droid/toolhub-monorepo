import type { Request, Response } from 'express';
import type { HealthCheckData } from '@mega-tools/shared';
import { getDatabaseStatus } from '../../config/database';
import { env } from '../../config/env';
import { sendSuccess } from '../../utils/response';

export function getHealth(_req: Request, res: Response): void {
  const dbInfo = getDatabaseStatus();

  // Health endpoint functions regardless of DB state
  const data: HealthCheckData = {
    status: dbInfo.status === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    database: {
      status: dbInfo.status,
      name: dbInfo.name || undefined,
    },
  };

  sendSuccess(res, data, 200);
}
