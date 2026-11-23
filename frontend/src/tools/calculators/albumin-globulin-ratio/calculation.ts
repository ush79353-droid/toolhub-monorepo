/**
 * Albumin–globulin (A/G) ratio — clinical chemistry arithmetic (ADR-018).
 *
 *   globulin (g/dL) = total protein − albumin
 *   A/G ratio = albumin ÷ globulin  (dimensionless)
 */

import type {
  AlbuminGlobulinRatioInput,
  AlbuminGlobulinRatioResult,
} from './types';

export const SOURCE_NOTE =
  'Globulin = total protein − albumin; albumin/globulin ratio = albumin ÷ globulin, all in g/dL. Educational chemistry only.';

export const DISCLAIMER =
  'Not a laboratory report or diagnosis — verify with your clinical laboratory.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function globulinFromAlbuminAndTotal(
  albuminGPerDl: number,
  totalProteinGPerDl: number,
): number {
  return totalProteinGPerDl - albuminGPerDl;
}

export function agRatio(albuminGPerDl: number, globulinGPerDl: number): number {
  if (!(globulinGPerDl > 0)) {
    throw new Error('Globulin must be positive to compute A/G ratio.');
  }
  return albuminGPerDl / globulinGPerDl;
}

export function calculateAlbuminGlobulinRatio(
  input: AlbuminGlobulinRatioInput,
): AlbuminGlobulinRatioResult {
  const empty = {
    albumin: null,
    totalProtein: null,
    globulin: null,
    agRatio: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const albumin = parseNumber(input.albuminText);
  const total = parseNumber(input.totalProteinText);

  if (albumin === null || total === null) {
    return {
      ...empty,
      statusHeadline: 'Enter albumin and total protein',
      statusDetail:
        'Enter albumin and total protein in g/dL to derive globulin and the A/G ratio.',
    };
  }

  if (!(albumin >= 0 && total >= 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid values',
      statusDetail: 'Albumin and total protein must be non-negative.',
    };
  }

  if (total < albumin) {
    return {
      ...empty,
      statusHeadline: 'Inconsistent values',
      statusDetail: 'Total protein must be greater than or equal to albumin.',
    };
  }

  const globulin = globulinFromAlbuminAndTotal(albumin, total);

  if (!(globulin > 0)) {
    return {
      albumin,
      totalProtein: total,
      globulin,
      agRatio: null,
      statusHeadline: 'A/G ratio undefined',
      statusDetail:
        'Globulin is zero or negative — A/G ratio is not defined (albumin cannot equal total protein).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const ratio = agRatio(albumin, globulin);

  return {
    albumin,
    totalProtein: total,
    globulin,
    agRatio: Math.round(ratio * 100) / 100,
    statusHeadline: 'A/G ratio',
    statusDetail: `Globulin = ${formatLab(total)} − ${formatLab(albumin)} = ${formatLab(globulin)} g/dL; A/G = ${formatLab(albumin)} ÷ ${formatLab(globulin)} = ${formatRatio(ratio)}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatLab(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatRatio(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}