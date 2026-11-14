import type { BurndownChartInput, BurndownChartResult, BurndownPoint } from './types';

/**
 * Ideal remaining on day N: total × (1 − N / duration)
 * Actual remaining on day N: total − cumulative burn through day N
 * Actual series stops at `actualThroughDay` (future days are not plotted).
 */
export function calculateBurndown(
  input: BurndownChartInput,
  actualThroughDay: number
): BurndownChartResult | null {
  const { sprintDuration, totalStoryPoints, dailyBurn } = input;

  if (
    !Number.isInteger(sprintDuration) ||
    sprintDuration < 1 ||
    !Number.isFinite(totalStoryPoints) ||
    totalStoryPoints < 0 ||
    dailyBurn.length !== sprintDuration
  ) {
    return null;
  }

  for (const burn of dailyBurn) {
    if (!Number.isFinite(burn) || burn < 0) return null;
  }

  const totalBurned = dailyBurn.reduce((sum, n) => sum + n, 0);
  if (totalBurned > totalStoryPoints) return null;

  const through = Math.max(0, Math.min(actualThroughDay, sprintDuration));
  const points: BurndownPoint[] = [];

  for (let day = 0; day <= sprintDuration; day += 1) {
    const idealRemaining = totalStoryPoints * (1 - day / sprintDuration);
    let actualRemaining: number | null = null;

    if (day <= through) {
      let cumulative = 0;
      for (let i = 0; i < day; i += 1) {
        cumulative += dailyBurn[i] ?? 0;
      }
      actualRemaining = totalStoryPoints - cumulative;
    }

    points.push({ day, idealRemaining, actualRemaining });
  }

  let remainingPoints = totalStoryPoints;
  for (let i = 0; i < through; i += 1) {
    remainingPoints -= dailyBurn[i] ?? 0;
  }

  return {
    totalBurned: dailyBurn.slice(0, through).reduce((sum, n) => sum + n, 0),
    remainingPoints,
    points,
    actualThroughDay: through,
  };
}

export function formatPoints(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rounded);
}
