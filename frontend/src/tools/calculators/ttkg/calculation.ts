import {
  DISCLAIMER,
  SOURCE_NOTE,
  URINE_SODIUM_APPLICABILITY_NOTE,
} from './content';
import type { TtkgInput, TtkgResult } from './types';

export { DISCLAIMER, SOURCE_NOTE, URINE_SODIUM_APPLICABILITY_NOTE };

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Pure TTKG; rejects non-positive serum K, serum osmolality, or urine osmolality. */
export function computeTtkg(
  urinePotassium: number,
  serumPotassium: number,
  urineOsmolality: number,
  serumOsmolality: number,
): number {
  if (!(serumPotassium > 0) || !(serumOsmolality > 0) || !(urineOsmolality > 0)) {
    throw new Error('Serum potassium and osmolality values must be positive.');
  }
  if (
    !Number.isFinite(urinePotassium) ||
    !Number.isFinite(serumPotassium) ||
    !Number.isFinite(urineOsmolality) ||
    !Number.isFinite(serumOsmolality)
  ) {
    throw new Error('TTKG inputs must be finite.');
  }
  if (urinePotassium < 0) {
    throw new Error('Urine potassium must be non-negative.');
  }
  return (urinePotassium / serumPotassium) / (urineOsmolality / serumOsmolality);
}

export function formatTtkg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateTtkg(input: TtkgInput): TtkgResult {
  const empty: TtkgResult = {
    ttkg: null,
    formattedTtkg: '',
    statusHeadline: 'Enter potassium and osmolality labs',
    statusDetail:
      'Enter serum and urine potassium (mmol/L) and serum and urine osmolality (mOsm/kg H₂O).',
    applicabilityNote: URINE_SODIUM_APPLICABILITY_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const serumK = parseNumber(input.serumPotassiumText);
  const urineK = parseNumber(input.urinePotassiumText);
  const serumOsm = parseNumber(input.serumOsmolalityText);
  const urineOsm = parseNumber(input.urineOsmolalityText);

  if (serumK === null || urineK === null || serumOsm === null || urineOsm === null) {
    return empty;
  }

  if (serumK < 0 || urineK < 0 || serumOsm < 0 || urineOsm < 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid values',
      statusDetail: 'All lab values must be non-negative.',
    };
  }

  if (!(serumK > 0) || !(serumOsm > 0) || !(urineOsm > 0)) {
    return {
      ...empty,
      statusHeadline: 'TTKG undefined',
      statusDetail:
        'Serum potassium, serum osmolality, and urine osmolality must be greater than zero.',
    };
  }

  const raw = computeTtkg(urineK, serumK, urineOsm, serumOsm);
  const ttkg = Math.round(raw * 100) / 100;

  return {
    ttkg,
    formattedTtkg: formatTtkg(ttkg),
    statusHeadline: `TTKG ${formatTtkg(ttkg)}`,
    statusDetail: `${SOURCE_NOTE} ${URINE_SODIUM_APPLICABILITY_NOTE}`,
    applicabilityNote: URINE_SODIUM_APPLICABILITY_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}