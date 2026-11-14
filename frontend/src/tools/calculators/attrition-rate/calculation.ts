import type { AttritionRateResult } from './types';

export function calculateAttritionRate(
  start: number,
  end: number,
  left: number
): AttritionRateResult | null {
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(left)) {
    return null;
  }
  if (start < 0 || end < 0 || left < 0) {
    return null;
  }

  const averageEmployees = (start + end) / 2;
  if (averageEmployees <= 0) {
    return null;
  }

  const attritionRatePercent = (left / averageEmployees) * 100;
  if (!Number.isFinite(attritionRatePercent)) {
    return null;
  }

  const formattedRate = Number(attritionRatePercent.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return {
    averageEmployees,
    attritionRatePercent,
    formattedRate,
  };
}
