import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AnnualCareProjection,
  CareCostFrequency,
  LongTermCareInput,
  LongTermCareResult,
} from './types';

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function normalizeAnnualCareCost(
  cost: number,
  frequency: CareCostFrequency,
): number {
  return frequency === 'daily' ? cost * 365 : cost * 12;
}

/** Annual cost after `completedInflationSteps` (0 = year 1 / present year). */
export function calculateFutureCareCost(
  currentAnnualCost: number,
  inflationRatePercent: number,
  completedInflationSteps: number,
): number {
  return (
    currentAnnualCost *
    Math.pow(1 + inflationRatePercent / 100, completedInflationSteps)
  );
}

export function calculateTotalCareCost(
  currentAnnualCost: number,
  inflationRatePercent: number,
  years: number,
): number | null {
  if (!(currentAnnualCost >= 0) || !(years > 0)) return null;
  const i = inflationRatePercent / 100;
  if (Math.abs(i) < 1e-15) return currentAnnualCost * years;
  if (i <= -1) return null;
  const total =
    currentAnnualCost * ((Math.pow(1 + i, years) - 1) / i);
  return Number.isFinite(total) ? total : null;
}

export function generateAnnualCareProjection(input: {
  currentAnnualCost: number;
  inflationRatePercent: number;
  years: number;
}): AnnualCareProjection[] {
  const { currentAnnualCost, inflationRatePercent, years } = input;
  const rows: AnnualCareProjection[] = [];
  let cumulative = 0;
  for (let year = 1; year <= years; year += 1) {
    const annualCost = calculateFutureCareCost(
      currentAnnualCost,
      inflationRatePercent,
      year - 1,
    );
    cumulative += annualCost;
    rows.push({ year, annualCost, cumulativeCost: cumulative });
  }
  return rows;
}

export function formatLtcMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount));
}

export function formatLtcPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(percent);
}

export interface LongTermCareEngineValues {
  frequency: CareCostFrequency;
  careCost: number;
  annualCareCost: number;
  years: number;
  inflationRatePercent: number;
  currency: SupportedCurrency;
}

export function calculateLongTermCareResults(
  values: LongTermCareEngineValues,
): LongTermCareResult | null {
  const total = calculateTotalCareCost(
    values.annualCareCost,
    values.inflationRatePercent,
    values.years,
  );
  if (total === null) return null;

  const finalYearCost = calculateFutureCareCost(
    values.annualCareCost,
    values.inflationRatePercent,
    values.years - 1,
  );
  const projection = generateAnnualCareProjection({
    currentAnnualCost: values.annualCareCost,
    inflationRatePercent: values.inflationRatePercent,
    years: values.years,
  });

  const symbol = getCurrencySymbol(values.currency);
  const money = (v: number) => `${symbol}${formatLtcMoney(v, values.currency)}`;
  const freqLabel = values.frequency === 'daily' ? 'per day' : 'per month';

  const summaryText = `Based on your current care cost of ${money(values.careCost)} ${freqLabel} (annual baseline ${money(values.annualCareCost)}), an annual inflation rate of ${formatLtcPercent(values.inflationRatePercent)}%, and a projection period of ${values.years} years, your estimated total long-term care expense is ${money(total)}.`;

  return {
    frequency: values.frequency,
    careCost: values.careCost,
    annualCareCost: values.annualCareCost,
    inflationRatePercent: values.inflationRatePercent,
    projectionYears: values.years,
    finalYearCost,
    totalEstimatedCost: total,
    currency: values.currency,
    projection,
    summaryText,
  };
}

export function shareLongTermCareText(result: LongTermCareResult): string {
  const symbol = getCurrencySymbol(result.currency);
  const money = (v: number) => `${symbol}${formatLtcMoney(v, result.currency)}`;
  return [
    'Long Term Care Calculator',
    `Frequency: ${result.frequency}`,
    `Care cost: ${money(result.careCost)}`,
    `Current annual cost: ${money(result.annualCareCost)}`,
    `Years: ${result.projectionYears}`,
    `Inflation: ${formatLtcPercent(result.inflationRatePercent)}%`,
    `Final-year cost: ${money(result.finalYearCost)}`,
    `Total estimated cost: ${money(result.totalEstimatedCost)}`,
    result.summaryText,
  ].join('\n');
}

export function isLongTermCareInputBlank(input: LongTermCareInput): boolean {
  return (
    !input.careCost.trim() &&
    !input.presentYearCost.trim() &&
    !input.years.trim() &&
    !input.inflationRate.trim()
  );
}

export function formatPresentYearFromCare(
  careCost: number,
  frequency: CareCostFrequency,
  currency: SupportedCurrency,
): string {
  return formatLtcMoney(normalizeAnnualCareCost(careCost, frequency), currency);
}
