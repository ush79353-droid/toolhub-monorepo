import { schedule, validate, type ScheduledTask } from 'node-cron';
import { logger } from '../utils/logger';
import { fetchAndSaveCurrencyRates } from '../modules/currency/fetch-currency-rates';

/** Local midnight. node-cron fields: minute hour day month weekday. */
export const CURRENCY_RATE_CRON = '0 0 * * *';

let task: ScheduledTask | null = null;

export function startCurrencyRateJob(): void {
  if (task) return;
  if (!validate(CURRENCY_RATE_CRON)) {
    logger.error('Currency rate cron expression is invalid', undefined, { cron: CURRENCY_RATE_CRON });
    return;
  }
  task = schedule(CURRENCY_RATE_CRON, () => fetchAndSaveCurrencyRates(), {
    name: 'currency-rates',
    noOverlap: true,
  });
  logger.info('Currency rate job scheduled', {
    cron: CURRENCY_RATE_CRON,
    nextRun: task.getNextRun()?.toISOString() ?? null,
  });
}

export function stopCurrencyRateJob(): void {
  if (!task) return;
  void task.stop();
  task = null;
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('currency-rates.cron.ts');
if (isDirect) {
  if (!validate(CURRENCY_RATE_CRON)) {
    throw new Error('cron expression rejected');
  }
  const check = schedule(CURRENCY_RATE_CRON, () => undefined, { name: 'currency-rates-check' });
  const next = check.getNextRun();
  void check.destroy();
  if (!next || next.getHours() !== 0 || next.getMinutes() !== 0) {
    throw new Error(`next run is not local midnight: ${next?.toISOString() ?? 'none'}`);
  }
  console.log('currency-rates cron ok');
}
