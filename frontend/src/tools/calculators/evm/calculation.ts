import type { EvmInput, EvmResult } from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/** Round performance indices to two decimal places (e.g. 0.833… → 0.83). */
export function roundIndex(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/**
 * PV = Budget × Scheduled Progress / 100
 * EV = Budget × Actual Progress / 100
 * AC = Costs
 * CV = EV − AC
 * SV = EV − PV
 * CPI = EV / AC  (undefined when AC = 0)
 * SPI = EV / PV  (undefined when PV = 0)
 */
export function calculateEvm(input: EvmInput): EvmResult | null {
  const {
    scheduledProgressPercent: scheduled,
    actualProgressPercent: actual,
    budget,
    costs,
  } = input;

  if (scheduled === null || actual === null || budget === null || costs === null) {
    return null;
  }
  if (
    !Number.isFinite(scheduled) ||
    !Number.isFinite(actual) ||
    !Number.isFinite(budget) ||
    !Number.isFinite(costs)
  ) {
    return null;
  }

  const plannedValue = roundMoney((budget * scheduled) / 100);
  const earnedValue = roundMoney((budget * actual) / 100);
  const actualCost = roundMoney(costs);
  if (
    !Number.isFinite(plannedValue) ||
    !Number.isFinite(earnedValue) ||
    !Number.isFinite(actualCost)
  ) {
    return null;
  }

  const costVariance = roundMoney(earnedValue - actualCost);
  const scheduleVariance = roundMoney(earnedValue - plannedValue);
  if (!Number.isFinite(costVariance) || !Number.isFinite(scheduleVariance)) {
    return null;
  }

  let costPerformanceIndex: number | null = null;
  if (actualCost !== 0) {
    const cpi = roundIndex(earnedValue / actualCost);
    if (Number.isFinite(cpi)) costPerformanceIndex = cpi;
  }

  let schedulePerformanceIndex: number | null = null;
  if (plannedValue !== 0) {
    const spi = roundIndex(earnedValue / plannedValue);
    if (Number.isFinite(spi)) schedulePerformanceIndex = spi;
  }

  return {
    scheduledProgressPercent: scheduled,
    actualProgressPercent: actual,
    budget,
    costs,
    plannedValue,
    earnedValue,
    actualCost,
    costVariance,
    scheduleVariance,
    costPerformanceIndex,
    schedulePerformanceIndex,
    currency: input.currency,
  };
}

export function varianceLabel(value: number): 'favorable' | 'unfavorable' | 'on-plan' {
  if (value > 0) return 'favorable';
  if (value < 0) return 'unfavorable';
  return 'on-plan';
}
