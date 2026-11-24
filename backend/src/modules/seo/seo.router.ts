import { Router } from 'express';
import { authenticateAdmin } from '../../middleware/auth.middleware';
import {
  getCampaigns,
  getEligibleTools,
  getOneCampaign,
  getOneDraft,
  patchDraft,
  postApprove,
  postCampaign,
  postPublish,
  postRegenerate,
  postRetry,
  postUnpublish,
} from './seo.controller';

export const seoRouter = Router();

seoRouter.use(authenticateAdmin);
seoRouter.get('/eligible-tools', getEligibleTools);
seoRouter.get('/campaigns', getCampaigns);
seoRouter.post('/campaigns', postCampaign);
seoRouter.get('/campaigns/:id', getOneCampaign);
seoRouter.get('/drafts/:id', getOneDraft);
seoRouter.patch('/drafts/:id', patchDraft);
seoRouter.post('/drafts/:id/approve', postApprove);
seoRouter.post('/drafts/:id/publish', postPublish);
seoRouter.post('/drafts/:id/unpublish', postUnpublish);
seoRouter.post('/drafts/:id/regenerate', postRegenerate);
seoRouter.post('/drafts/:id/retry', postRetry);
