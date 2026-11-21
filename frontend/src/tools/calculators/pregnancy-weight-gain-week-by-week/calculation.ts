/**
 * Pregnancy Weight Gain: Week by Week Breakdown — pure engine (ADR-018).
 *
 * Reuses the canonical IOM singleton/twin weekly model from
 * `pregnancy-weight-gain/calculation.ts`. Series is computed in kg, then
 * converted for chart/table display units.
 */

import {
  DISCLAIMER,
  SOURCE_LABEL,
  TERM_WEEK,
  calculateBmi,
  classifyPrepregnancyBmi,
  computeGestationalGainBounds,
  formatBmi,
  formatWeightDisplay,
  heightToMeters,
  parseNumber,
  singletonGainAtWeek,
  twinGainAtWeek,
  weightToKg,
} from '../pregnancy-weight-gain/calculation';
import type {
  PregnancyWeightGainWeekByWeekInput,
  PregnancyWeightGainWeekByWeekResult,
  WeekPoint,
} from './types';

export {
  DISCLAIMER,
  SOURCE_LABEL,
  calculateBmi,
  formatBmi,
  formatWeightDisplay,
  heightToMeters,
  parseNumber,
  weightToKg,
};

export function buildWeeklySeries(params: {
  heightMeters: number;
  weightKg: number;
  twins: boolean;
}): WeekPoint[] {
  const bmi = calculateBmi(params.heightMeters, params.weightKg);
  const profile = classifyPrepregnancyBmi(bmi);
  if (!profile) return [];

  const points: WeekPoint[] = [];
  for (let week = 1; week <= TERM_WEEK; week++) {
    if (params.twins) {
      const twin = twinGainAtWeek(profile.category, week);
      if (!twin.band) continue;
      points.push({
        week,
        minGainKg: twin.band.minKg,
        maxGainKg: twin.band.maxKg,
        minWeightKg: params.weightKg + twin.band.minKg,
        maxWeightKg: params.weightKg + twin.band.maxKg,
      });
      continue;
    }
    const gain = singletonGainAtWeek(profile.category, week);
    if (!gain) continue;
    points.push({
      week,
      minGainKg: gain.minKg,
      maxGainKg: gain.maxKg,
      minWeightKg: params.weightKg + gain.minKg,
      maxWeightKg: params.weightKg + gain.maxKg,
    });
  }
  return points;
}

export function calculatePregnancyWeightGainWeekByWeek(
  input: PregnancyWeightGainWeekByWeekInput,
): PregnancyWeightGainWeekByWeekResult | null {
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  const weekVal = parseNumber(input.week);
  if (heightVal == null || weightVal == null || weekVal == null) return null;
  if (heightVal <= 0 || weightVal <= 0) return null;

  const heightMeters = heightToMeters(heightVal, input.heightUnit);
  const weightKg = weightToKg(weightVal, input.weightUnit);
  if (!(heightMeters > 0) || !(weightKg > 0)) return null;

  const bounds = computeGestationalGainBounds({
    heightMeters,
    weightKg,
    week: weekVal,
    twins: input.twins,
  });
  if (!bounds) return null;

  const displayUnit = input.chartUnits === 'imperial' ? 'lb' : 'kg';
  const series = buildWeeklySeries({
    heightMeters,
    weightKg,
    twins: input.twins,
  });

  const minGainKg = bounds.gain?.minKg ?? null;
  const maxGainKg = bounds.gain?.maxKg ?? null;
  const minWeightKg =
    minGainKg != null ? weightKg + minGainKg : null;
  const maxWeightKg =
    maxGainKg != null ? weightKg + maxGainKg : null;

  return {
    bmi: bounds.bmi,
    formattedBmi: formatBmi(bounds.bmi),
    week: Math.round(weekVal),
    twins: input.twins,
    chartUnits: input.chartUnits,
    minWeightKg,
    maxWeightKg,
    minGainKg,
    maxGainKg,
    formattedMinWeight:
      minWeightKg != null
        ? formatWeightDisplay(minWeightKg, displayUnit)
        : '—',
    formattedMaxWeight:
      maxWeightKg != null
        ? formatWeightDisplay(maxWeightKg, displayUnit)
        : '—',
    formattedMinGain:
      minGainKg != null ? formatWeightDisplay(minGainKg, displayUnit) : '—',
    formattedMaxGain:
      maxGainKg != null ? formatWeightDisplay(maxGainKg, displayUnit) : '—',
    unavailableMessage: bounds.message,
    series,
    sourceLabel: SOURCE_LABEL,
    disclaimer: DISCLAIMER,
  };
}
