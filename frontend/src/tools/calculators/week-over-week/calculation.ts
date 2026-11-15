import type { WeekOverWeekResult } from './types';

/** Format WoW % with sign for nonzero values; at least one decimal when needed. */
export function formatWowPercent(value: number): string {
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

/**
 * WoW Growth (%) = ((Following − Initial) / Initial) × 100
 * Initial must be nonzero.
 */
export function calculateWeekOverWeek(input: {
  initialWeek: number;
  followingWeek: number;
}): WeekOverWeekResult | null {
  const { initialWeek, followingWeek } = input;

  if (![initialWeek, followingWeek].every(Number.isFinite)) return null;
  if (initialWeek === 0) return null;

  const wowGrowthPercent = ((followingWeek - initialWeek) / initialWeek) * 100;
  if (!Number.isFinite(wowGrowthPercent)) return null;

  return {
    initialWeek,
    followingWeek,
    wowGrowthPercent,
    formattedWowGrowth: formatWowPercent(wowGrowthPercent),
  };
}
