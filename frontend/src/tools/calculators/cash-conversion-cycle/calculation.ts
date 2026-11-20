import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PeriodUnit } from './types';

/** Simple beginning/ending average. Both must be finite and ≥ 0. */
export function calculateAverageBalance(
  beginning: number,
  ending: number
): number | null {
  if (
    !Number.isFinite(beginning) ||
    beginning < 0 ||
    !Number.isFinite(ending) ||
    ending < 0
  ) {
    return null;
  }
  const avg = (beginning + ending) / 2;
  return Number.isFinite(avg) ? avg : null;
}

export const calculateAverageInventory = calculateAverageBalance;
export const calculateAverageAccountsReceivable = calculateAverageBalance;
export const calculateAverageAccountsPayable = calculateAverageBalance;

/**
 * Normalize reporting period to days.
 * months → 365/12 (disclosed convention); years → 365; weeks → 7.
 */
export function normalizeReportingPeriod(
  period: number,
  unit: PeriodUnit
): number | null {
  if (!Number.isFinite(period) || period <= 0) return null;
  let days: number;
  switch (unit) {
    case 'days':
      days = period;
      break;
    case 'weeks':
      days = period * 7;
      break;
    case 'months':
      days = period * (365 / 12);
      break;
    case 'years':
      days = period * 365;
      break;
    default:
      return null;
  }
  return Number.isFinite(days) && days > 0 ? days : null;
}

/**
 * DIO = (Average Inventory / COGS) × T.
 * Returns 0 when inventory is 0 and COGS > 0.
 * Returns null when COGS ≤ 0 (undefined / unavailable).
 */
export function calculateDaysInventoryOutstanding(
  averageInventory: number,
  cogs: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageInventory) ||
    averageInventory < 0 ||
    !Number.isFinite(cogs) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (cogs <= 0) return null;
  const dio = (averageInventory / cogs) * periodDays;
  return Number.isFinite(dio) ? dio : null;
}

/**
 * DSO = (Average AR / Revenue) × T.
 * Returns 0 when AR is 0 and revenue > 0.
 * Returns null when revenue ≤ 0.
 */
export function calculateDaysSalesOutstanding(
  averageAccountsReceivable: number,
  revenue: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageAccountsReceivable) ||
    averageAccountsReceivable < 0 ||
    !Number.isFinite(revenue) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (revenue <= 0) return null;
  const dso = (averageAccountsReceivable / revenue) * periodDays;
  return Number.isFinite(dso) ? dso : null;
}

/**
 * DPO = (Average AP / COGS) × T (reference COGS-based default).
 * Returns 0 when AP is 0 and COGS > 0.
 * Returns null when COGS ≤ 0.
 */
export function calculateDaysPayableOutstanding(
  averageAccountsPayable: number,
  cogs: number,
  periodDays: number
): number | null {
  if (
    !Number.isFinite(averageAccountsPayable) ||
    averageAccountsPayable < 0 ||
    !Number.isFinite(cogs) ||
    !Number.isFinite(periodDays) ||
    periodDays <= 0
  ) {
    return null;
  }
  if (cogs <= 0) return null;
  const dpo = (averageAccountsPayable / cogs) * periodDays;
  return Number.isFinite(dpo) ? dpo : null;
}

/** Operating cycle = DIO + DSO */
export function calculateOperatingCycle(
  dio: number,
  dso: number
): number | null {
  if (!Number.isFinite(dio) || !Number.isFinite(dso)) return null;
  const oc = dio + dso;
  return Number.isFinite(oc) ? oc : null;
}

/** CCC = DIO + DSO − DPO (negative results preserved) */
export function calculateCashConversionCycle(
  dio: number,
  dso: number,
  dpo: number
): number | null {
  if (
    !Number.isFinite(dio) ||
    !Number.isFinite(dso) ||
    !Number.isFinite(dpo)
  ) {
    return null;
  }
  const ccc = dio + dso - dpo;
  return Number.isFinite(ccc) ? ccc : null;
}

export function interpretCashConversionCycle(ccc: number): string {
  if (!Number.isFinite(ccc)) {
    return 'Cash conversion cycle could not be determined from the inputs.';
  }
  if (ccc > 0) {
    return `A positive CCC of about ${formatDays(ccc)} means cash stays tied up in inventory and receivables longer than the supplier payment period under these assumptions. Shorter is often desirable, but delaying payables or starving inventory can create operational risk.`;
  }
  if (ccc === 0) {
    return 'A CCC of 0 days means measured inventory and collection periods are fully offset by the supplier payment period — a mathematical description, not a guarantee of perfect liquidity.';
  }
  return `A negative CCC of about ${formatDays(ccc)} can occur when supplier terms exceed combined inventory and receivable days. That is common in some fast-turnover models and is not automatically an error or a strength.`;
}

export function formatCccMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDays(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
