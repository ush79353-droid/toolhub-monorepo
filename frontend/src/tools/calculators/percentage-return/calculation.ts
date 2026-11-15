import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Average Gregorian year length for day↔year conversion (consistent convention). */
export const DAYS_PER_YEAR = 365.25;

function parseCivilDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const utc = Date.UTC(y, m - 1, d);
  const check = new Date(utc);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

function toUtcMs(parts: { y: number; m: number; d: number }): number {
  return Date.UTC(parts.y, parts.m - 1, parts.d);
}

function formatIso(ms: number): string {
  const dt = new Date(ms);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Elapsed years from calendar-day difference ÷ 365.25. */
export function yearsBetweenDates(startIso: string, endIso: string): number | null {
  const start = parseCivilDate(startIso);
  const end = parseCivilDate(endIso);
  if (!start || !end) return null;
  const diffMs = toUtcMs(end) - toUtcMs(start);
  if (diffMs < 0) return null;
  const years = diffMs / (DAYS_PER_YEAR * 86_400_000);
  return Number.isFinite(years) ? years : null;
}

/** End date = start + years×365.25 days (UTC civil). */
export function endDateFromDuration(startIso: string, years: number): string | null {
  if (!Number.isFinite(years) || years < 0) return null;
  const start = parseCivilDate(startIso);
  if (!start) return null;
  const ms = toUtcMs(start) + years * DAYS_PER_YEAR * 86_400_000;
  if (!Number.isFinite(ms)) return null;
  return formatIso(ms);
}

/** Gain/Loss = Returned − Invested */
export function calculateGainOrLoss(invested: number, returned: number): number | null {
  if (!Number.isFinite(invested) || !Number.isFinite(returned)) return null;
  if (!(invested > 0) || returned < 0) return null;
  const gain = returned - invested;
  return Number.isFinite(gain) ? gain : null;
}

/** Percentage Return (%) = ((Returned − Invested) / Invested) × 100 */
export function calculatePercentageReturn(invested: number, returned: number): number | null {
  if (!Number.isFinite(invested) || !Number.isFinite(returned)) return null;
  if (!(invested > 0) || returned < 0) return null;
  const pct = ((returned - invested) / invested) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * Annualized Return (%) = ((Returned / Invested)^(1 / Years) − 1) × 100
 * Returned 0 → −100%. Negative returned rejected upstream.
 */
export function calculateAnnualizedReturn(
  invested: number,
  returned: number,
  years: number
): number | null {
  if (!Number.isFinite(invested) || !Number.isFinite(returned) || !Number.isFinite(years)) {
    return null;
  }
  if (!(invested > 0) || returned < 0 || !(years > 0)) return null;
  if (returned === 0) return -100;
  const ratio = returned / invested;
  if (!(ratio > 0)) return null;
  const annualized = (ratio ** (1 / years) - 1) * 100;
  return Number.isFinite(annualized) ? annualized : null;
}

/**
 * Years = ln(Returned / Invested) / ln(1 + Annualized Rate)
 * Rate is a decimal (e.g. 0.10 for 10%).
 */
export function calculateTimeNeededYears(
  invested: number,
  returned: number,
  annualizedRateDecimal: number
): number | null {
  if (
    !Number.isFinite(invested) ||
    !Number.isFinite(returned) ||
    !Number.isFinite(annualizedRateDecimal)
  ) {
    return null;
  }
  if (!(invested > 0) || returned < 0) return null;
  if (returned === 0) return null;
  if (annualizedRateDecimal <= -1) return null;

  const ratio = returned / invested;
  if (!(ratio > 0)) return null;

  if (ratio === 1) {
    return annualizedRateDecimal === 0 ? null : 0;
  }

  const growth = 1 + annualizedRateDecimal;
  if (!(growth > 0) || growth === 1) return null;

  const years = Math.log(ratio) / Math.log(growth);
  if (!Number.isFinite(years) || years < 0) return null;
  return years;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e6) / 1e6;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}

export function formatYears(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e6) / 1e6;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}
