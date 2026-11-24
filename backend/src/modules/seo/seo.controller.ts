import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/error.middleware';
import { sendSuccess } from '../../utils/response';
import { createCampaignSchema, regenerateDraftSchema, saveDraftSchema } from '../../validation/admin-seo.schema';
import {
  approveDraft,
  createCampaign,
  getCampaign,
  getDraft,
  listCampaigns,
  listEligibleTools,
  publishDraft,
  regenerateDraft,
  retryDraft,
  saveDraft,
  unpublishDraft,
} from './seo.service';

function adminId(req: Request): string {
  if (!req.admin) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }
  return req.admin.id;
}

export async function getEligibleTools(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listEligibleTools());
  } catch (error) {
    next(error);
  }
}

export async function getCampaigns(_req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await listCampaigns());
  } catch (error) {
    next(error);
  }
}

export async function postCampaign(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createCampaignSchema.parse(req.body);
    sendSuccess(res, await createCampaign(body, adminId(req)), 201);
  } catch (error) {
    next(error);
  }
}

export async function getOneCampaign(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await getCampaign(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function getOneDraft(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await getDraft(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function patchDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const body = saveDraftSchema.parse(req.body);
    sendSuccess(res, await saveDraft(req.params.id, body.content));
  } catch (error) {
    next(error);
  }
}

export async function postApprove(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await approveDraft(req.params.id, adminId(req)));
  } catch (error) {
    next(error);
  }
}

export async function postPublish(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await publishDraft(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function postUnpublish(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await unpublishDraft(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function postRegenerate(req: Request, res: Response, next: NextFunction) {
  try {
    const body = regenerateDraftSchema.parse(req.body ?? {});
    sendSuccess(res, await regenerateDraft(req.params.id, Boolean(body.researchAgain)));
  } catch (error) {
    next(error);
  }
}

export async function postRetry(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await retryDraft(req.params.id));
  } catch (error) {
    next(error);
  }
}
