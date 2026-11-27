/**
 * Archery draw-length estimate from wingspan — educational (ADR-018).
 *
 * Draw length = wingspan / 2.5  (same length unit)
 * Wingspan = draw length × 2.5
 *
 * Omni / ATA-style wingspan method. Starting estimate only — not bow fitting.
 * Fixture: 70 in → 28 in; 1 m wingspan → 0.4 m (= 40 cm).
 */

import type {
  DrawLengthInput,
  DrawLengthResult,
  LengthUnit,
} from './types';

export const SOURCE_NOTE =
  'Estimated draw length = wingspan ÷ 2.5 (fingertip-to-fingertip wingspan). Educational anthropometric estimate — not a bow-shop fitting.';

export const DISCLAIMER =
  'Anthropometric estimate only. Does not include weapon fitting, shooting form, or operating guidance.';

export const DRAW_LENGTH_DIVISOR = 2.5;

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toCm(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * CM_PER_INCH;
    case 'ft':
      return value * CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromCm(cm: number, unit: LengthUnit): number {
  switch (unit) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / CM_PER_INCH;
    case 'ft':
      return cm / CM_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function drawLengthFromWingspanCm(wingspanCm: number): number {
  return wingspanCm / DRAW_LENGTH_DIVISOR;
}

export function wingspanFromDrawLengthCm(drawLengthCm: number): number {
  return drawLengthCm * DRAW_LENGTH_DIVISOR;
}

export function formatLength(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return String(Number(rounded.toFixed(4)));
}

function emptyResult(partial?: Partial<DrawLengthResult>): DrawLengthResult {
  return {
    wingspanCm: null,
    drawLengthCm: null,
    formattedWingspan: '',
    formattedDrawLength: '',
    statusHeadline: 'Enter wingspan or draw length.',
    statusDetail:
      'Draw length ≈ wingspan ÷ 2.5 after converting both to the same unit.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateDrawLength(input: DrawLengthInput): DrawLengthResult {
  if (input.lastEdited === 'wingspan') {
    const raw = parseNumber(input.wingspanText);
    if (raw === null) return emptyResult();
    if (!(raw > 0)) {
      return emptyResult({
        statusHeadline: 'Wingspan must be greater than 0.',
        statusDetail: 'Enter a positive fingertip-to-fingertip measurement.',
      });
    }
    const wingspanCm = toCm(raw, input.wingspanUnit);
    const drawCm = drawLengthFromWingspanCm(wingspanCm);
    if (!Number.isFinite(drawCm)) return emptyResult();
    return {
      wingspanCm,
      drawLengthCm: drawCm,
      formattedWingspan: formatLength(raw),
      formattedDrawLength: formatLength(fromCm(drawCm, input.drawLengthUnit)),
      statusHeadline: 'Draw length estimated.',
      statusDetail: `Using wingspan ÷ ${DRAW_LENGTH_DIVISOR}.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const raw = parseNumber(input.drawLengthText);
  if (raw === null) return emptyResult();
  if (!(raw > 0)) {
    return emptyResult({
      statusHeadline: 'Draw length must be greater than 0.',
      statusDetail: 'Enter a positive length to back-solve wingspan.',
    });
  }
  const drawCm = toCm(raw, input.drawLengthUnit);
  const wingspanCm = wingspanFromDrawLengthCm(drawCm);
  if (!Number.isFinite(wingspanCm)) return emptyResult();
  return {
    wingspanCm,
    drawLengthCm: drawCm,
    formattedWingspan: formatLength(fromCm(wingspanCm, input.wingspanUnit)),
    formattedDrawLength: formatLength(raw),
    statusHeadline: 'Wingspan estimated from draw length.',
    statusDetail: `Using draw length × ${DRAW_LENGTH_DIVISOR}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
