import {
  MAX_SPRINT_DAYS,
  type BurndownChartFieldErrors,
  type BurndownChartInput,
} from './types';

export interface BurndownDraft {
  sprintDuration: string;
  totalStoryPoints: string;
  dailyBurn: string[];
  /** Furthest working day the user has logged (0 = none yet) */
  progressThroughDay: number;
}

export function createDefaultDraft(): BurndownDraft {
  return {
    sprintDuration: '10',
    totalStoryPoints: '',
    dailyBurn: Array.from({ length: 10 }, () => '0'),
    progressThroughDay: 0,
  };
}

export function resizeDailyBurn(
  dailyBurn: string[],
  nextDuration: number,
  progressThroughDay: number
): { dailyBurn: string[]; progressThroughDay: number } {
  const duration = Math.max(0, Math.floor(nextDuration));
  const next = dailyBurn.slice(0, duration);
  while (next.length < duration) next.push('0');
  return {
    dailyBurn: next,
    progressThroughDay: Math.min(progressThroughDay, duration),
  };
}

function parseNonNeg(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateBurndownDraft(draft: BurndownDraft): {
  isValid: boolean;
  incomplete: boolean;
  errors: BurndownChartFieldErrors;
  parsed: BurndownChartInput | null;
  progressThroughDay: number;
} {
  const errors: BurndownChartFieldErrors = {};

  const durationRaw = draft.sprintDuration.trim();
  const totalRaw = draft.totalStoryPoints.trim();

  if (!durationRaw || !totalRaw) {
    return {
      isValid: false,
      incomplete: true,
      errors,
      parsed: null,
      progressThroughDay: draft.progressThroughDay,
    };
  }

  const sprintDuration = Number(durationRaw);
  if (
    !Number.isInteger(sprintDuration) ||
    sprintDuration < 1 ||
    sprintDuration > MAX_SPRINT_DAYS
  ) {
    errors.sprintDuration = `Enter a whole number of working days from 1 to ${MAX_SPRINT_DAYS}`;
  }

  const totalStoryPoints = parseNonNeg(totalRaw);
  if (totalStoryPoints === null || Number.isNaN(totalStoryPoints) || totalStoryPoints < 0) {
    errors.totalStoryPoints = 'Enter a valid non-negative number of story points';
  }

  if (errors.sprintDuration || errors.totalStoryPoints || totalStoryPoints === null) {
    return {
      isValid: false,
      incomplete: false,
      errors,
      parsed: null,
      progressThroughDay: draft.progressThroughDay,
    };
  }

  if (draft.dailyBurn.length !== sprintDuration) {
    errors.form = 'Daily burn list must match sprint duration';
    return {
      isValid: false,
      incomplete: false,
      errors,
      parsed: null,
      progressThroughDay: draft.progressThroughDay,
    };
  }

  const dailyBurn: number[] = [];
  for (let i = 0; i < draft.dailyBurn.length; i += 1) {
    const value = parseNonNeg(draft.dailyBurn[i] ?? '');
    if (value === null) {
      dailyBurn.push(0);
      continue;
    }
    if (Number.isNaN(value) || value < 0) {
      errors.dailyBurn = `Day ${i + 1}: enter a non-negative number`;
      return {
        isValid: false,
        incomplete: false,
        errors,
        parsed: null,
        progressThroughDay: draft.progressThroughDay,
      };
    }
    dailyBurn.push(value);
  }

  const through = Math.max(0, Math.min(draft.progressThroughDay, sprintDuration));
  const totalBurned = dailyBurn.slice(0, through).reduce((sum, n) => sum + n, 0);
  if (totalBurned > totalStoryPoints) {
    errors.dailyBurn = 'Cumulative burned points cannot exceed total story points';
    return {
      isValid: false,
      incomplete: false,
      errors,
      parsed: null,
      progressThroughDay: through,
    };
  }

  return {
    isValid: true,
    incomplete: false,
    errors,
    parsed: { sprintDuration, totalStoryPoints, dailyBurn },
    progressThroughDay: through,
  };
}
