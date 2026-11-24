/**
 * Cigarette Calculator — pure engine (ADR-018).
 *
 * cigarettes/day = packs/day × cigarettes_in_pack
 * packs/day = cigarettes/day ÷ cigarettes_in_pack
 * total = cigarettes/day × days
 *
 * Duration without calendar dates (fixed convention):
 *   1 year  = 365 days
 *   1 month = 365/12 days
 *
 * Fixture: 1 pack/day × 20 cigs/pack for 365 days → 7300.
 */

import type { CigaretteInput, CigaretteResult, TimeFrameUnit } from './types';

export const SOURCE_NOTE =
  'Total cigarettes = (cigarettes/day) × days. Packs/day and cigarettes/day stay synchronized via pack size. Year = 365 days; month = 365/12 days (no calendar dates).';

export const DISCLAIMER =
  'Educational exposure estimate only — not a medical diagnosis, addiction assessment, or treatment plan.';

export const DAYS_PER_YEAR = 365;
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function timeFrameToDays(value: number, unit: TimeFrameUnit): number {
  return unit === 'months' ? value * DAYS_PER_MONTH : value * DAYS_PER_YEAR;
}

export function cigarettesFromPacks(
  packsPerDay: number,
  packSize: number,
): number {
  return packsPerDay * packSize;
}

export function packsFromCigarettes(
  cigarettesPerDay: number,
  packSize: number,
): number {
  if (!(packSize > 0)) {
    throw new Error('Pack size must be greater than zero.');
  }
  return cigarettesPerDay / packSize;
}

export function totalCigarettes(
  cigarettesPerDay: number,
  days: number,
): number {
  return cigarettesPerDay * days;
}

export function formatCount(value: number | null, digits = 4): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatTotal(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = Math.round(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(rounded);
}

export function calculateCigarette(input: CigaretteInput): CigaretteResult {
  const empty = {
    cigarettesPerDay: null,
    packsPerDay: null,
    packSize: null,
    days: null,
    totalCigarettes: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const packSize = parseNumber(input.cigarettesInPackText);
  const cigs = parseNumber(input.cigarettesPerDayText);
  const packs = parseNumber(input.packsPerDayText);
  const tf = parseNumber(input.timeFrameText);

  if (packSize === null) {
    return {
      ...empty,
      statusHeadline: 'Enter cigarettes in a pack',
      statusDetail: 'Pack size defaults to 20 and must be greater than zero.',
    };
  }

  if (!(packSize > 0)) {
    return {
      ...empty,
      packSize,
      statusHeadline: 'Invalid pack size',
      statusDetail: 'Cigarettes in pack must be greater than zero.',
    };
  }

  let cigarettesPerDay: number | null = null;
  let packsPerDay: number | null = null;

  if (input.rateDriver === 'packs' && packs !== null) {
    if (packs < 0) {
      return {
        ...empty,
        packSize,
        statusHeadline: 'Invalid packs/day',
        statusDetail: 'Packs per day must be non-negative.',
      };
    }
    packsPerDay = packs;
    cigarettesPerDay = cigarettesFromPacks(packs, packSize);
  } else if (cigs !== null) {
    if (cigs < 0) {
      return {
        ...empty,
        packSize,
        statusHeadline: 'Invalid cigarettes/day',
        statusDetail: 'Cigarettes per day must be non-negative.',
      };
    }
    cigarettesPerDay = cigs;
    packsPerDay = packsFromCigarettes(cigs, packSize);
  } else if (packs !== null) {
    if (packs < 0) {
      return {
        ...empty,
        packSize,
        statusHeadline: 'Invalid packs/day',
        statusDetail: 'Packs per day must be non-negative.',
      };
    }
    packsPerDay = packs;
    cigarettesPerDay = cigarettesFromPacks(packs, packSize);
  }

  if (cigarettesPerDay === null || tf === null) {
    return {
      ...empty,
      cigarettesPerDay,
      packsPerDay,
      packSize,
      statusHeadline: 'Enter daily rate and time frame',
      statusDetail:
        'Provide cigarettes/day or packs/day plus a time frame to estimate total cigarettes smoked.',
    };
  }

  if (tf < 0) {
    return {
      ...empty,
      cigarettesPerDay,
      packsPerDay,
      packSize,
      statusHeadline: 'Invalid time frame',
      statusDetail: 'Time frame must be non-negative.',
    };
  }

  const days = timeFrameToDays(tf, input.timeFrameUnit);
  const total = totalCigarettes(cigarettesPerDay, days);

  // Zero exposure: still a valid total of 0
  return {
    cigarettesPerDay,
    packsPerDay,
    packSize,
    days,
    totalCigarettes: total,
    statusHeadline: 'Total number of smoked cigarettes',
    statusDetail: `${formatCount(cigarettesPerDay, 2)} /day × ${formatCount(days, 2)} days = ${formatTotal(total)} cigarettes.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
