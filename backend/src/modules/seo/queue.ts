import { Queue, Worker, type ConnectionOptions, type WorkerOptions } from 'bullmq';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { logger } from '../../utils/logger';

/** Automated steps. Admin review and publishing stay HTTP actions and have no worker. */
export const SEO_QUEUES = [
  'seo-inventory',
  'seo-keyword-research',
  'seo-serp-analysis',
  'seo-content-generation',
  'seo-content-validation',
] as const;

export type SeoQueueName = (typeof SEO_QUEUES)[number];

export interface SeoJobData {
  draftId: string;
}

const queues = new Map<SeoQueueName, Queue<SeoJobData>>();
const workers: Worker<SeoJobData>[] = [];

export function redisConnection(): ConnectionOptions {
  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
    maxRetriesPerRequest: null,
  };
}

export function assertSeoConfigured(): void {
  if (!env.REDIS_HOST.trim()) {
    throw new AppError('REDIS_HOST is required before SEO work can be queued.', 503, 'SEO_NOT_CONFIGURED');
  }
  if (!env.DATAFORSEO_LOGIN || !env.DATAFORSEO_PASSWORD) {
    throw new AppError('DataForSEO credentials are required before SEO work can be queued.', 503, 'SEO_NOT_CONFIGURED');
  }
  if (!env.OPENAI_API_KEY || !env.OPENAI_SEO_MODEL) {
    throw new AppError('OPENAI_API_KEY and OPENAI_SEO_MODEL are required before SEO work can be queued.', 503, 'SEO_NOT_CONFIGURED');
  }
}

function getQueue(name: SeoQueueName): Queue<SeoJobData> {
  if (!env.REDIS_HOST.trim()) {
    throw new AppError('REDIS_HOST is required before SEO work can be queued.', 503, 'SEO_NOT_CONFIGURED');
  }
  const existing = queues.get(name);
  if (existing) return existing;
  const queue = new Queue<SeoJobData>(name, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  });
  queue.on('error', (error) => logger.error(`SEO queue ${name} error`, error));
  queues.set(name, queue);
  return queue;
}

export async function enqueueSeoStep(name: SeoQueueName, draftId: string): Promise<void> {
  await getQueue(name).add('run', { draftId }, { jobId: `${name}:${draftId}:${Date.now()}` });
}

export function startSeoWorkers(
  handlers: Record<SeoQueueName, (draftId: string) => Promise<void>>,
  onFailed: (draftId: string, step: SeoQueueName, message: string) => Promise<void>
): void {
  if (workers.length > 0) return;
  const concurrency: Record<SeoQueueName, number> = {
    'seo-inventory': 1,
    'seo-keyword-research': 2,
    'seo-serp-analysis': 2,
    'seo-content-generation': 2,
    'seo-content-validation': 2,
  };
  for (const name of SEO_QUEUES) {
    const options: WorkerOptions = { connection: redisConnection(), concurrency: concurrency[name] };
    const worker = new Worker<SeoJobData>(
      name,
      async (job) => {
        await handlers[name](job.data.draftId);
      },
      options
    );
    worker.on('failed', (job, error) => {
      if (!job) return;
      const maxAttempts = job.opts.attempts ?? 1;
      if (job.attemptsMade < maxAttempts) return;
      void onFailed(job.data.draftId, name, error.message.slice(0, 500));
    });
    worker.on('error', (error) => logger.error(`SEO worker ${name} error`, error));
    workers.push(worker);
  }
  logger.info('SEO workers started');
}

export async function stopSeoWorkers(): Promise<void> {
  await Promise.all(workers.map((worker) => worker.close()));
  workers.length = 0;
  await Promise.all([...queues.values()].map((queue) => queue.close()));
  queues.clear();
}
