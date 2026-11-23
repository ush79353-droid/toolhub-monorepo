/**
 * hCG Levels — serial β-hCG change metrics (educational).
 *
 * For A > 0, B, and elapsed time t (days):
 *   difference = B − A
 *   % change = 100(B/A − 1)
 *   doubling time (rising only) = t × ln(2) / ln(B/A)
 *   d-day standardized increase = 100((B/A)^(d/t) − 1) for d = 1, 2
 *
 * Descriptive arithmetic only — not a viability diagnosis.
 */

import type { HcgLevelsInput, HcgLevelsResult, TimeUnit } from './types';

export const SOURCE_LABEL =
  'Serial β-hCG arithmetic: difference, percent change, doubling time t·ln2/ln(B/A), and standardized 1-/2-day increases 100((B/A)^(d/t)−1) (educational kinetics; not a clinical decision rule).';

export const DISCLAIMER =
  'Educational serial β-hCG math only. It does not diagnose pregnancy location, viability, or miscarriage. Interpret labs with a clinician and the reporting laboratory’s reference ranges.';

export function elapsedToDays(value: number, unit: TimeUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return unit === 'hours' ? value / 24 : value;
}

export function daysToTimeUnit(days: number, unit: TimeUnit): number {
  return unit === 'hours' ? days * 24 : days;
}

export function calculateHcgLevels(
  first: number,
  second: number,
  elapsedDays: number,
  doublingTimeUnit: TimeUnit
): HcgLevelsResult | null {
  if (!(first > 0) || !Number.isFinite(second) || second < 0) return null;
  if (!Number.isFinite(elapsedDays) || elapsedDays <= 0) return null;

  const difference = second - first;
  const ratio = second / first;
  const percentageChange = 100 * (ratio - 1);

  let trend: HcgLevelsResult['trend'] = 'unchanged';
  if (second > first) trend = 'rising';
  else if (second < first) trend = 'falling';

  let doublingTimeDays: number | null = null;
  if (trend === 'rising' && ratio > 1) {
    doublingTimeDays = (elapsedDays * Math.LN2) / Math.log(ratio);
  }

  let oneDayIncreasePct: number | null = null;
  let twoDayIncreasePct: number | null = null;
  if (ratio > 0 && Number.isFinite(ratio)) {
    oneDayIncreasePct = 100 * (Math.pow(ratio, 1 / elapsedDays) - 1);
    twoDayIncreasePct = 100 * (Math.pow(ratio, 2 / elapsedDays) - 1);
  }

  const doublingDisplay =
    doublingTimeDays != null
      ? daysToTimeUnit(doublingTimeDays, doublingTimeUnit)
      : null;

  const fmt = (n: number, digits = 2) => String(Number(n.toFixed(digits)));

  return {
    difference,
    percentageChange,
    doublingTimeDays,
    doublingTimeDisplay: doublingDisplay,
    oneDayIncreasePct,
    twoDayIncreasePct,
    formattedDifference: fmt(difference),
    formattedPercentageChange: fmt(percentageChange),
    formattedDoublingTime:
      doublingDisplay != null ? fmt(doublingDisplay) : '',
    formattedOneDayIncrease:
      oneDayIncreasePct != null ? fmt(oneDayIncreasePct) : '',
    formattedTwoDayIncrease:
      twoDayIncreasePct != null ? fmt(twoDayIncreasePct) : '',
    trend,
    explanation:
      trend === 'rising'
        ? `Rising serial β-hCG: difference ${fmt(difference)} mIU/mL, change ${fmt(percentageChange)}%, doubling time ${doublingDisplay != null ? fmt(doublingDisplay) : '—'} ${doublingTimeUnit}.`
        : trend === 'falling'
          ? `Falling serial β-hCG: difference ${fmt(difference)} mIU/mL (${fmt(percentageChange)}%). Doubling time is not shown for non-rising values.`
          : `Unchanged serial β-hCG over the interval (difference 0). Doubling time is not applicable.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

export function calculateFromInput(
  input: HcgLevelsInput,
  first: number,
  second: number,
  elapsedRaw: number
): HcgLevelsResult | null {
  const days = elapsedToDays(elapsedRaw, input.elapsedUnit);
  if (days == null) return null;
  return calculateHcgLevels(first, second, days, input.doublingTimeUnit);
}
