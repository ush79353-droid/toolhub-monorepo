import { z } from 'zod';
import { PILOT_MAX_TOOLS } from '../modules/seo/content';

export const createCampaignSchema = z.object({
  name: z.string().trim().min(1).max(120),
  toolIds: z.array(z.string().trim().min(1)).min(1).max(PILOT_MAX_TOOLS),
});

export const saveDraftSchema = z.object({
  content: z.unknown(),
});

export const regenerateDraftSchema = z.object({
  researchAgain: z.boolean().optional(),
});
