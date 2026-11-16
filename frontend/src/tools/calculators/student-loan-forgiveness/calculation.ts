import { HISTORICAL_PROGRAM_NOTICE } from './types';

export function formatUsdAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * No forgiveness math is performed here. Historical 2022 program rules are not
 * sourced in this repository; callers surface HISTORICAL_PROGRAM_NOTICE instead.
 */
export function getHistoricalProgramNotice(): string {
  return HISTORICAL_PROGRAM_NOTICE;
}
