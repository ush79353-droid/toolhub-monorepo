import type { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import { saveToolAuditSchema } from '../../validation/tool-audit.schema';
import { getDevelopmentAudit, listAuditCatalog, saveDevelopmentAudit } from './tool-audit.service';

export async function getAuditCatalog(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listAuditCatalog());
  } catch (error) {
    next(error);
  }
}

export async function getStoredAudit(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, { report: await getDevelopmentAudit() });
  } catch (error) {
    next(error);
  }
}

export async function postDevelopmentAudit(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, { report: await saveDevelopmentAudit(saveToolAuditSchema.parse(req.body)) });
  } catch (error) {
    next(error);
  }
}
