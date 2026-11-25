import { logger } from '../../utils/logger';
import {
  claimCampaignTurn,
  markSeoDraftFailed,
  runContentGeneration,
  runContentValidation,
  runInventory,
  runKeywordResearch,
  runSerpAnalysis,
} from './pipeline';
import { startSeoWorkers, stopSeoWorkers, type SeoQueueName } from './queue';

let started = false;

export function bootSeoWorkers(): void {
  if (started) return;
  started = true;
  startSeoWorkers(
    {
      'seo-inventory': runInventory,
      'seo-keyword-research': runKeywordResearch,
      'seo-serp-analysis': runSerpAnalysis,
      'seo-content-generation': runContentGeneration,
      'seo-content-validation': runContentValidation,
    },
    async (draftId, step: SeoQueueName, message) => {
      logger.warn(`SEO step ${step} failed for draft ${draftId}`, { message });
      await markSeoDraftFailed(draftId, step, message);
    },
    (draftId) => claimCampaignTurn(draftId)
  );
}

export async function shutdownSeoWorkers(): Promise<void> {
  if (!started) return;
  started = false;
  await stopSeoWorkers();
}
