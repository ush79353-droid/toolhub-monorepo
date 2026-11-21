/**
 * Pence to Pounds Converter — pure engine (ADR-018).
 *
 * Fixed sterling subdivision (not FX):
 *   100 pence (GBX) = 1 pound (GBP)
 *   GBP = GBX / 100
 *   GBX = GBP × 100
 */

import { PENCE_PER_POUND, type PenceToPoundsInput, type PenceToPoundsResult } from './types';

const MAX_ABS = 1e15;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function penceToPounds(pence: number): number | null {
  if (!Number.isFinite(pence)) return null;
  const pounds = pence / PENCE_PER_POUND;
  if (!Number.isFinite(pounds) || Math.abs(pounds) > MAX_ABS) return null;
  return pounds;
}

export function poundsToPence(pounds: number): number | null {
  if (!Number.isFinite(pounds)) return null;
  const pence = pounds * PENCE_PER_POUND;
  if (!Number.isFinite(pence) || Math.abs(pence) > MAX_ABS) return null;
  return pence;
}

export function formatPence(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const maxFrac = abs >= 1 ? 4 : 8;
  const rounded = Number(n.toFixed(maxFrac));
  return rounded.toLocaleString('en-GB', {
    useGrouping: true,
    maximumFractionDigits: maxFrac,
  });
}

export function formatPounds(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const maxFrac = abs >= 1 ? 4 : 8;
  const rounded = Number(n.toFixed(maxFrac));
  return rounded.toLocaleString('en-GB', {
    useGrouping: true,
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: maxFrac,
  });
}

/**
 * Convert from the last-edited field. Zero is allowed (0p = £0).
 * Negative amounts are rejected (sterling subdivision, not a signed FX quote).
 */
export function calculatePenceToPounds(
  input: PenceToPoundsInput,
): PenceToPoundsResult | null {
  const source = input.lastEdited;

  if (source === 'pence') {
    const pence = num(input.pence);
    if (pence == null) return null;
    if (pence < 0 || Math.abs(pence) > MAX_ABS) return null;
    const pounds = penceToPounds(pence);
    if (pounds == null) return null;
    const formattedPence = formatPence(pence);
    const formattedPounds = formatPounds(pounds);
    return {
      pence,
      pounds,
      formattedPence,
      formattedPounds,
      source,
      formulaBreakdown: [
        'GBP = GBX ÷ 100',
        `GBP = ${formattedPence} ÷ ${PENCE_PER_POUND}`,
        `GBP = ${formattedPounds}`,
      ].join('\n'),
      explanation: `${formattedPence} p = £${formattedPounds} (100 pence = 1 pound). Fixed sterling subdivision — not a live FX rate.`,
    };
  }

  const pounds = num(input.pounds);
  if (pounds == null) return null;
  if (pounds < 0 || Math.abs(pounds) > MAX_ABS) return null;
  const pence = poundsToPence(pounds);
  if (pence == null) return null;
  const formattedPence = formatPence(pence);
  const formattedPounds = formatPounds(pounds);
  return {
    pence,
    pounds,
    formattedPence,
    formattedPounds,
    source,
    formulaBreakdown: [
      'GBX = GBP × 100',
      `GBX = ${formattedPounds} × ${PENCE_PER_POUND}`,
      `GBX = ${formattedPence}`,
    ].join('\n'),
    explanation: `£${formattedPounds} = ${formattedPence} p (100 pence = 1 pound). Fixed sterling subdivision — not a live FX rate.`,
  };
}
