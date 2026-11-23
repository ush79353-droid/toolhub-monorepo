/**
 * Pearl Index (Raymond Pearl) educational arithmetic (ADR-018).
 *
 * For equal full follow-up across participants:
 *   woman-months = women × duration_months
 *   woman-years  = woman-months / 12
 *   Pearl Index  = 100 × pregnancies / woman-years
 *               = 1200 × pregnancies / woman-months
 *
 * Result is a failure *rate* (pregnancies per 100 woman-years), not an
 * individual pregnancy probability.
 *
 * Sources: Pearl R. Hum Biol. 1932/1933 origins; Trussell & Portman,
 * Contraception 2013 (PMC3795840) summarizing PI as failures per 100
 * woman-years with ×1200 when the denominator is months.
 */

import type { DurationUnit, PearlIndexInput, PearlIndexResult } from './types';

export const SOURCE_NOTE =
  'Classic Pearl Index: pregnancies per 100 woman-years of exposure (equal full follow-up: woman-years = n × months / 12). See Trussell & Portman, Contraception 2013 (PMC3795840). Educational rate arithmetic only.';

export const DISCLAIMER =
  'Educational study-rate calculator — not personal contraceptive advice, not a life-table failure probability, and not a recommendation of any method.';

/** Illustrative comparison figures from the reference UI (not computed here). */
export const ILLUSTRATIVE_COMPARISONS: readonly {
  method: string;
  pearl: number;
}[] = [
  { method: 'Implant', pearl: 0.05 },
  { method: 'Condoms', pearl: 3 },
  { method: 'Estrogen + progesterone pill', pearl: 0.1 },
  { method: 'Pull-out method', pearl: 25 },
  { method: 'Calendar method', pearl: 9 },
];

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function durationToMonths(value: number, unit: DurationUnit): number {
  return unit === 'years' ? value * 12 : value;
}

export function monthsToDurationUnit(months: number, unit: DurationUnit): number {
  return unit === 'years' ? months / 12 : months;
}

/**
 * Pearl Index under equal full follow-up.
 * @throws if women ≤ 0, duration months ≤ 0, or pregnancies < 0
 */
export function pearlIndexEqualFollowUp(
  women: number,
  durationMonths: number,
  pregnancies: number,
): { pearlIndex: number; womanYears: number; womanMonths: number } {
  if (!(women > 0) || !(durationMonths > 0)) {
    throw new Error('Positive women and duration required for exposure.');
  }
  if (!(pregnancies >= 0)) {
    throw new Error('Pregnancies cannot be negative.');
  }
  const womanMonths = women * durationMonths;
  const womanYears = womanMonths / 12;
  const pearlIndex = (100 * pregnancies) / womanYears;
  return { pearlIndex, womanYears, womanMonths };
}

export function calculatePearlIndex(input: PearlIndexInput): PearlIndexResult {
  const women = parseNumber(input.womenText);
  const duration = parseNumber(input.durationText);
  const pregnancies = parseNumber(input.pregnanciesText);

  if (women === null || duration === null || pregnancies === null) {
    return {
      pearlIndex: null,
      womanYears: null,
      womanMonths: null,
      statusHeadline: 'Enter study inputs',
      statusDetail:
        'Enter number of women, study duration, and number of pregnancies. Assumes equal full follow-up for every participant.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(women > 0)) {
    return {
      pearlIndex: null,
      womanYears: null,
      womanMonths: null,
      statusHeadline: 'Invalid number of women',
      statusDetail: 'Number of women must be positive.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }
  if (!(duration > 0)) {
    return {
      pearlIndex: null,
      womanYears: null,
      womanMonths: null,
      statusHeadline: 'Invalid study duration',
      statusDetail: 'Study duration must be positive (zero exposure is invalid).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }
  if (!(pregnancies >= 0)) {
    return {
      pearlIndex: null,
      womanYears: null,
      womanMonths: null,
      statusHeadline: 'Invalid pregnancies',
      statusDetail: 'Number of pregnancies cannot be negative.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const durationMonths = durationToMonths(duration, input.durationUnit);
  const { pearlIndex, womanYears, womanMonths } = pearlIndexEqualFollowUp(
    women,
    durationMonths,
    pregnancies,
  );

  return {
    pearlIndex,
    womanYears,
    womanMonths,
    statusHeadline: 'Pearl Index (rate)',
    statusDetail: `Exposure ${womanYears} woman-years (${womanMonths} woman-months). Pearl = 100 × pregnancies / woman-years — a failure rate, not an individual probability.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatPearlIndex(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  // Keep enough precision for small indices like 0.05 without noisy tails.
  const rounded = Math.round(value * 1e6) / 1e6;
  return String(rounded);
}
