/**
 * Traditional (simplified wage-change): w = w_T − β Δu, β > 0 (explicit).
 * New Classical: π = πᵉ − α(u − uₙ) + s, α > 0.
 * New Keynesian (simplified % form): πₜ = β E[πₜ₊₁] + κ xₜ + sₜ,
 *   0 < β ≤ 1, κ > 0. Not a log-linearized DSGE exact replica.
 */

import type { PhillipsChartPoint, PhillipsVersion } from './types';
import { PHILLIPS_VERSION_OPTIONS } from './types';

export function calculateTraditionalPhillipsCurve(
  trendWageGrowth: number,
  unemploymentChange: number,
  sensitivity: number
): number | null {
  if (
    !Number.isFinite(trendWageGrowth) ||
    !Number.isFinite(unemploymentChange) ||
    !Number.isFinite(sensitivity) ||
    sensitivity <= 0
  ) {
    return null;
  }
  const w = trendWageGrowth - sensitivity * unemploymentChange;
  return Object.is(w, -0) ? 0 : w;
}

export function calculateTraditionalUnemploymentChange(
  trendWageGrowth: number,
  wageGrowth: number,
  sensitivity: number
): number | null {
  if (
    !Number.isFinite(trendWageGrowth) ||
    !Number.isFinite(wageGrowth) ||
    !Number.isFinite(sensitivity) ||
    sensitivity <= 0
  ) {
    return null;
  }
  const du = (trendWageGrowth - wageGrowth) / sensitivity;
  return Object.is(du, -0) ? 0 : du;
}

export function calculateTraditionalTrendWageGrowth(
  wageGrowth: number,
  unemploymentChange: number,
  sensitivity: number
): number | null {
  if (
    !Number.isFinite(wageGrowth) ||
    !Number.isFinite(unemploymentChange) ||
    !Number.isFinite(sensitivity) ||
    sensitivity <= 0
  ) {
    return null;
  }
  const wt = wageGrowth + sensitivity * unemploymentChange;
  return Object.is(wt, -0) ? 0 : wt;
}

export function calculateNewClassicalInflation(args: {
  expectedInflation: number;
  unemploymentRate: number;
  naturalUnemploymentRate: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    expectedInflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    expectedInflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
    supplyShock,
  ];
  if (values.some((v) => !Number.isFinite(v)) || slope <= 0) return null;
  const pi =
    expectedInflation -
    slope * (unemploymentRate - naturalUnemploymentRate) +
    supplyShock;
  return Object.is(pi, -0) ? 0 : pi;
}

export function calculateNewClassicalUnemployment(args: {
  inflation: number;
  expectedInflation: number;
  naturalUnemploymentRate: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    inflation,
    expectedInflation,
    naturalUnemploymentRate,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    inflation,
    expectedInflation,
    naturalUnemploymentRate,
    slope,
    supplyShock,
  ];
  if (values.some((v) => !Number.isFinite(v)) || slope <= 0) return null;
  const u =
    naturalUnemploymentRate +
    (expectedInflation + supplyShock - inflation) / slope;
  return Object.is(u, -0) ? 0 : u;
}

export function calculateNewClassicalExpectedInflation(args: {
  inflation: number;
  unemploymentRate: number;
  naturalUnemploymentRate: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    inflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    inflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
    supplyShock,
  ];
  if (values.some((v) => !Number.isFinite(v)) || slope <= 0) return null;
  const pe =
    inflation +
    slope * (unemploymentRate - naturalUnemploymentRate) -
    supplyShock;
  return Object.is(pe, -0) ? 0 : pe;
}

export function calculateNewClassicalNaturalUnemployment(args: {
  inflation: number;
  expectedInflation: number;
  unemploymentRate: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    inflation,
    expectedInflation,
    unemploymentRate,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    inflation,
    expectedInflation,
    unemploymentRate,
    slope,
    supplyShock,
  ];
  if (values.some((v) => !Number.isFinite(v)) || slope <= 0) return null;
  const un =
    unemploymentRate -
    (expectedInflation + supplyShock - inflation) / slope;
  return Object.is(un, -0) ? 0 : un;
}

export function calculateNewClassicalSupplyShock(args: {
  inflation: number;
  expectedInflation: number;
  unemploymentRate: number;
  naturalUnemploymentRate: number;
  slope: number;
}): number | null {
  const {
    inflation,
    expectedInflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
  } = args;
  const values = [
    inflation,
    expectedInflation,
    unemploymentRate,
    naturalUnemploymentRate,
    slope,
  ];
  if (values.some((v) => !Number.isFinite(v)) || slope <= 0) return null;
  const s =
    inflation -
    expectedInflation +
    slope * (unemploymentRate - naturalUnemploymentRate);
  return Object.is(s, -0) ? 0 : s;
}

export function calculateNewKeynesianInflation(args: {
  expectedInflation: number;
  discountFactor: number;
  outputGap: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    expectedInflation,
    discountFactor,
    outputGap,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    expectedInflation,
    discountFactor,
    outputGap,
    slope,
    supplyShock,
  ];
  if (
    values.some((v) => !Number.isFinite(v)) ||
    discountFactor <= 0 ||
    discountFactor > 1 ||
    slope <= 0
  ) {
    return null;
  }
  const pi =
    discountFactor * expectedInflation + slope * outputGap + supplyShock;
  return Object.is(pi, -0) ? 0 : pi;
}

export function calculateNewKeynesianExpectedInflation(args: {
  inflation: number;
  discountFactor: number;
  outputGap: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    inflation,
    discountFactor,
    outputGap,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    inflation,
    discountFactor,
    outputGap,
    slope,
    supplyShock,
  ];
  if (
    values.some((v) => !Number.isFinite(v)) ||
    discountFactor <= 0 ||
    discountFactor > 1 ||
    slope <= 0
  ) {
    return null;
  }
  const pe = (inflation - slope * outputGap - supplyShock) / discountFactor;
  return Object.is(pe, -0) ? 0 : pe;
}

export function calculateNewKeynesianOutputGap(args: {
  inflation: number;
  expectedInflation: number;
  discountFactor: number;
  slope: number;
  supplyShock?: number;
}): number | null {
  const {
    inflation,
    expectedInflation,
    discountFactor,
    slope,
    supplyShock = 0,
  } = args;
  const values = [
    inflation,
    expectedInflation,
    discountFactor,
    slope,
    supplyShock,
  ];
  if (
    values.some((v) => !Number.isFinite(v)) ||
    discountFactor <= 0 ||
    discountFactor > 1 ||
    slope <= 0
  ) {
    return null;
  }
  const x =
    (inflation - discountFactor * expectedInflation - supplyShock) / slope;
  return Object.is(x, -0) ? 0 : x;
}

export function calculateNewKeynesianCostPush(args: {
  inflation: number;
  expectedInflation: number;
  discountFactor: number;
  outputGap: number;
  slope: number;
}): number | null {
  const {
    inflation,
    expectedInflation,
    discountFactor,
    outputGap,
    slope,
  } = args;
  const values = [
    inflation,
    expectedInflation,
    discountFactor,
    outputGap,
    slope,
  ];
  if (
    values.some((v) => !Number.isFinite(v)) ||
    discountFactor <= 0 ||
    discountFactor > 1 ||
    slope <= 0
  ) {
    return null;
  }
  const s =
    inflation - discountFactor * expectedInflation - slope * outputGap;
  return Object.is(s, -0) ? 0 : s;
}

export function generateTraditionalChart(
  trendWageGrowth: number,
  sensitivity: number,
  highlightDu: number | null
): { points: PhillipsChartPoint[]; highlight: PhillipsChartPoint | null } {
  const points: PhillipsChartPoint[] = [];
  for (let du = -4; du <= 6; du += 0.5) {
    points.push({
      x: du,
      y: trendWageGrowth - sensitivity * du,
    });
  }
  const highlight =
    highlightDu != null && Number.isFinite(highlightDu)
      ? {
          x: highlightDu,
          y: trendWageGrowth - sensitivity * highlightDu,
        }
      : null;
  return { points, highlight };
}

export function generateNewClassicalChart(
  expectedInflation: number,
  naturalUnemployment: number,
  slope: number,
  supplyShock: number,
  highlightU: number | null
): {
  points: PhillipsChartPoint[];
  highlight: PhillipsChartPoint | null;
  references: { x?: number; y?: number; label: string }[];
} {
  const points: PhillipsChartPoint[] = [];
  for (let u = 0; u <= 12; u += 0.5) {
    points.push({
      x: u,
      y:
        expectedInflation -
        slope * (u - naturalUnemployment) +
        supplyShock,
    });
  }
  const highlight =
    highlightU != null && Number.isFinite(highlightU)
      ? {
          x: highlightU,
          y:
            expectedInflation -
            slope * (highlightU - naturalUnemployment) +
            supplyShock,
        }
      : null;
  return {
    points,
    highlight,
    references: [
      { x: naturalUnemployment, label: 'uₙ' },
      { y: expectedInflation, label: 'πᵉ' },
    ],
  };
}

export function generateNewKeynesianChart(
  expectedInflation: number,
  discountFactor: number,
  slope: number,
  supplyShock: number,
  highlightGap: number | null
): { points: PhillipsChartPoint[]; highlight: PhillipsChartPoint | null } {
  const points: PhillipsChartPoint[] = [];
  for (let x = -4; x <= 6; x += 0.5) {
    points.push({
      x,
      y: discountFactor * expectedInflation + slope * x + supplyShock,
    });
  }
  const highlight =
    highlightGap != null && Number.isFinite(highlightGap)
      ? {
          x: highlightGap,
          y:
            discountFactor * expectedInflation +
            slope * highlightGap +
            supplyShock,
        }
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

export function versionLabel(version: PhillipsVersion): string {
  return PHILLIPS_VERSION_OPTIONS.find((o) => o.id === version)?.label ?? version;
}
