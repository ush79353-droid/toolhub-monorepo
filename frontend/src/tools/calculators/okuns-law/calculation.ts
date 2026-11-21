/**
 * Output-gap Okun: OutputGap(%) = −β × (u − u*)  with β > 0
 * Growth Okun: Δu (pp) = −α × (g − g*)  with α > 0
 * Required g = g* − Δu / α
 * Growth gap = g − g* = −Δu / α
 * Coefficients are positive internally; signed screenshot (−0.45) = −β form.
 */

import type { OkunsLawChartPoint, OkunsLawMode } from './types';
import { OKUNS_LAW_MODE_OPTIONS } from './types';

export function calculateUnemploymentGap(
  unemploymentRate: number,
  naturalUnemploymentRate: number
): number | null {
  if (
    !Number.isFinite(unemploymentRate) ||
    !Number.isFinite(naturalUnemploymentRate)
  ) {
    return null;
  }
  return unemploymentRate - naturalUnemploymentRate;
}

export function calculateOutputGap(
  unemploymentRate: number,
  naturalUnemploymentRate: number,
  coefficient: number
): number | null {
  if (
    !Number.isFinite(unemploymentRate) ||
    !Number.isFinite(naturalUnemploymentRate) ||
    !Number.isFinite(coefficient) ||
    coefficient < 0
  ) {
    return null;
  }
  const gap = -coefficient * (unemploymentRate - naturalUnemploymentRate);
  return Object.is(gap, -0) ? 0 : gap;
}

export function calculateGDPGrowthGap(
  actualGrowth: number,
  trendGrowth: number
): number | null {
  if (!Number.isFinite(actualGrowth) || !Number.isFinite(trendGrowth)) {
    return null;
  }
  return actualGrowth - trendGrowth;
}

export function calculateUnemploymentChange(
  actualGrowth: number,
  trendGrowth: number,
  coefficient: number
): number | null {
  if (
    !Number.isFinite(actualGrowth) ||
    !Number.isFinite(trendGrowth) ||
    !Number.isFinite(coefficient) ||
    coefficient <= 0
  ) {
    return null;
  }
  return -coefficient * (actualGrowth - trendGrowth);
}

export function calculateRequiredGDPGrowth(
  unemploymentChange: number,
  trendGrowth: number,
  coefficient: number
): number | null {
  if (
    !Number.isFinite(unemploymentChange) ||
    !Number.isFinite(trendGrowth) ||
    !Number.isFinite(coefficient) ||
    coefficient <= 0
  ) {
    return null;
  }
  return trendGrowth - unemploymentChange / coefficient;
}

export function calculateGrowthGapFromUnemploymentChange(
  unemploymentChange: number,
  coefficient: number
): number | null {
  if (
    !Number.isFinite(unemploymentChange) ||
    !Number.isFinite(coefficient) ||
    coefficient <= 0
  ) {
    return null;
  }
  return -unemploymentChange / coefficient;
}

export function generateOutputGapChart(
  beta: number,
  highlightGap: number | null
): { points: OkunsLawChartPoint[]; highlight: OkunsLawChartPoint | null } {
  const points: OkunsLawChartPoint[] = [];
  for (let ug = -4; ug <= 6; ug += 0.5) {
    points.push({ x: ug, y: -beta * ug });
  }
  const highlight =
    highlightGap != null && Number.isFinite(highlightGap)
      ? { x: highlightGap, y: -beta * highlightGap }
      : null;
  return { points, highlight };
}

export function generateGrowthChart(
  alpha: number,
  highlightGrowthGap: number | null
): { points: OkunsLawChartPoint[]; highlight: OkunsLawChartPoint | null } {
  const points: OkunsLawChartPoint[] = [];
  for (let gg = -4; gg <= 6; gg += 0.5) {
    points.push({ x: gg, y: -alpha * gg });
  }
  const highlight =
    highlightGrowthGap != null && Number.isFinite(highlightGrowthGap)
      ? { x: highlightGrowthGap, y: -alpha * highlightGrowthGap }
      : null;
  return { points, highlight };
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: 'exceptZero',
  }).format(value)}%`;
}

export function formatPercentagePoints(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: 'exceptZero',
  }).format(value)} pp`;
}

export function formatCoefficient(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: Math.max(digits, 3),
  }).format(value);
}

export function modeLabel(mode: OkunsLawMode): string {
  return OKUNS_LAW_MODE_OPTIONS.find((o) => o.id === mode)?.label ?? mode;
}

export function interpretOutputGap(gap: number): string {
  if (Math.abs(gap) < 1e-9) {
    return 'Estimated actual output equals potential output under the selected Okun relationship (zero output gap).';
  }
  if (gap < 0) {
    return `Based on the selected Okun coefficient, estimated actual output is ${formatPercent(Math.abs(gap))} below potential output.`;
  }
  return `Estimated output is ${formatPercent(gap)} above potential output under the selected relationship.`;
}

export function interpretUnemploymentChange(deltaU: number): string {
  if (Math.abs(deltaU) < 1e-9) {
    return 'The model estimates no change in the unemployment rate (0 percentage points).';
  }
  if (deltaU < 0) {
    return `The model estimates a decrease of ${formatPercentagePoints(Math.abs(deltaU))} in unemployment. A change in percentage points is not the same as a percent change of the initial unemployment rate.`;
  }
  return `The model estimates an increase of ${formatPercentagePoints(deltaU)} in unemployment.`;
}
