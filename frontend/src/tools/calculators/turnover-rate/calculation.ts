import type { TurnoverRateResult } from './types';

function formatPercent(rate: number): string {
  const rounded = Math.round(rate * 100) / 100;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

function formatAverage(avg: number): string {
  const rounded = Math.round(avg * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/**
 * Average Employees = (Starting + Ending) / 2
 * Turnover Rate (%) = (Employees Who Left / Average Employees) × 100
 * Not capped at 100%.
 */
export function calculateTurnoverRate(
  averageEmployees: number,
  employeesWhoLeft: number
): TurnoverRateResult | null {
  if (!Number.isFinite(averageEmployees) || !Number.isFinite(employeesWhoLeft)) {
    return null;
  }
  if (averageEmployees <= 0 || employeesWhoLeft < 0) {
    return null;
  }

  const turnoverRatePercent = (employeesWhoLeft / averageEmployees) * 100;
  if (!Number.isFinite(turnoverRatePercent)) {
    return null;
  }

  return {
    averageEmployees,
    turnoverRatePercent,
    formattedRate: formatPercent(turnoverRatePercent),
    formattedAverage: formatAverage(averageEmployees),
  };
}

export function averageFromStartEnd(start: number, end: number): number | null {
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < 0) return null;
  const avg = (start + end) / 2;
  return Number.isFinite(avg) ? avg : null;
}
