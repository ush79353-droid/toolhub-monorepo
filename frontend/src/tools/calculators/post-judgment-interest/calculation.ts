/** Actual/365 simple post-judgment interest day basis (not 360). */
export const POST_JUDGMENT_DAY_BASIS = 365;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string): { year: number; month: number; day: number } | null {
  const match = ISO.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (![year, month, day].every(Number.isFinite)) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/** Signed civil calendar days from judgment → writ (UTC midnights; DST-safe). */
export function diffCalendarDays(fromIso: string, toIso: string): number | null {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  if (!from || !to) return null;
  const a = Date.UTC(from.year, from.month - 1, from.day);
  const b = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((b - a) / 86_400_000);
}

export function weeksAndDays(absoluteDays: number): { weeks: number; days: number } {
  const days = Math.abs(absoluteDays);
  return { weeks: Math.floor(days / 7), days: days % 7 };
}

export function formatDisplayDate(isoDate: string): string {
  const match = ISO.exec(isoDate.trim());
  if (!match) return isoDate;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

/** Fixed USD display rounding (2 fraction digits). */
export function formatUsdAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Accumulated Interest = Judgment × (Rate / 100) × (Elapsed Days / 365)
 * Full precision — round only for display.
 */
export function calculatePostJudgmentInterest(input: {
  judgmentAmount: number;
  interestRatePercent: number;
  elapsedDays: number;
}): number | null {
  const { judgmentAmount, interestRatePercent, elapsedDays } = input;
  if (![judgmentAmount, interestRatePercent, elapsedDays].every(Number.isFinite)) {
    return null;
  }
  if (judgmentAmount < 0 || interestRatePercent < 0 || elapsedDays < 0) {
    return null;
  }

  const interest =
    judgmentAmount *
    (interestRatePercent / 100) *
    (elapsedDays / POST_JUDGMENT_DAY_BASIS);

  return Number.isFinite(interest) ? interest : null;
}
