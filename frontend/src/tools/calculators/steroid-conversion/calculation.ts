/**
 * Steroid Conversion — UI stub (engine commit wires published-table math).
 */

import type {
  SteroidConversionInput,
  SteroidConversionResult,
} from './types';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information and contraindications on the leaflet; consult your health provider before administering any medication. This tool cannot replace real medical consultation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateSteroidConversion(
  _input: SteroidConversionInput,
): SteroidConversionResult {
  return {
    convertedDoses: {},
    activeSourceId: null,
    statusHeadline: 'Enter one steroid dose',
    statusDetail:
      'Enter the dose (mg) of one systemic corticosteroid to see approximate anti-inflammatory equivalents in the other fields.',
    disclaimer: DISCLAIMER,
  };
}

export function formatDoseMg(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const digits = abs >= 10 ? 2 : abs >= 1 ? 3 : 4;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
