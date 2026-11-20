/**
 * Bidirectional billable hours: V = R × T (after unit normalize).
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BillableHoursSolveTarget, BillableTimeUnit } from './types';

/** Exact SI conversions only — no workday assumptions. */
export const SECONDS_PER_UNIT: Record<BillableTimeUnit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
};

export function convertTimeAmount(
  value: number,
  from: BillableTimeUnit,
  to: BillableTimeUnit
): number {
  if (from === to) return value;
  return (value * SECONDS_PER_UNIT[from]) / SECONDS_PER_UNIT[to];
}

export function formatBillableMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatBillableTime(time: number): string {
  if (!Number.isFinite(time)) return '';
  if (Number.isInteger(time)) return String(time);
  const text = time.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export interface BillableHoursNumericInput {
  solveFor: BillableHoursSolveTarget;
  rate: number | null;
  rateUnit: BillableTimeUnit;
  time: number | null;
  timeUnit: BillableTimeUnit;
  value: number | null;
}

export interface BillableHoursComputation {
  solvedField: BillableHoursSolveTarget;
  rate: number;
  time: number;
  value: number;
  rateUnit: BillableTimeUnit;
  timeUnit: BillableTimeUnit;
}

/**
 * Normalize rate × time into value using:
 * value = rate × time × (seconds_per_time_unit / seconds_per_rate_unit)
 */
export function calculateBillableHours(
  input: BillableHoursNumericInput
): BillableHoursComputation | null {
  const { solveFor, rateUnit, timeUnit } = input;
  let rate = input.rate;
  let time = input.time;
  let value = input.value;
  const scale = SECONDS_PER_UNIT[timeUnit] / SECONDS_PER_UNIT[rateUnit];

  if (solveFor === 'value') {
    if (rate === null || time === null) return null;
    if (!(rate >= 0) || !(time >= 0)) return null;
    value = rate * time * scale;
  } else if (solveFor === 'rate') {
    if (value === null || time === null) return null;
    if (!(value >= 0) || !(time >= 0)) return null;
    const denom = time * scale;
    if (denom === 0) return null;
    rate = value / denom;
  } else {
    if (value === null || rate === null) return null;
    if (!(value >= 0) || !(rate >= 0)) return null;
    if (rate === 0 || scale === 0) return null;
    time = value / (rate * scale);
  }

  if (
    rate === null ||
    time === null ||
    value === null ||
    !Number.isFinite(rate) ||
    !Number.isFinite(time) ||
    !Number.isFinite(value) ||
    rate < 0 ||
    time < 0 ||
    value < 0
  ) {
    return null;
  }

  return {
    solvedField: solveFor,
    rate,
    time,
    value,
    rateUnit,
    timeUnit,
  };
}
