import { solveCagr } from '@/tools/calculators/cagr/calculation';
import type { YearOverYearGrowthResult } from './types';

/** Format YoY % with sign for nonzero values. */
export function formatYoyPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Number(value.toFixed(4));
  const body = new Intl.NumberFormat('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(Math.abs(rounded));
  if (rounded > 0) return `+${body}`;
  return `-${body}`;
}

function formatCagrPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Number(value.toFixed(4));
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * YoY Growth (%) = ((Final − Initial) / Initial) × 100
 * Initial must be > 0. Final may be zero or negative.
 */
export function calculateYearOverYearGrowth(input: {
  initialYearValue: number;
  finalYearValue: number;
  numberOfYears?: number | null;
}): YearOverYearGrowthResult | null {
  const { initialYearValue, finalYearValue, numberOfYears } = input;

  if (![initialYearValue, finalYearValue].every(Number.isFinite)) return null;
  if (!(initialYearValue > 0)) return null;

  const yoyGrowthPercent = ((finalYearValue - initialYearValue) / initialYearValue) * 100;
  if (!Number.isFinite(yoyGrowthPercent)) return null;

  let cagrPercent: number | null = null;
  let formattedCagr: string | null = null;
  if (
    numberOfYears !== undefined &&
    numberOfYears !== null &&
    Number.isFinite(numberOfYears) &&
    numberOfYears > 0
  ) {
    // Reuse verified CAGR engine: ((Final/Initial)^(1/n) − 1) × 100
    cagrPercent = solveCagr(initialYearValue, finalYearValue, numberOfYears);
    if (cagrPercent !== null) {
      formattedCagr = formatCagrPercent(cagrPercent);
    }
  }

  return {
    yoyGrowthPercent,
    formattedYoyGrowth: formatYoyPercent(yoyGrowthPercent),
    cagrPercent,
    formattedCagr,
  };
}
