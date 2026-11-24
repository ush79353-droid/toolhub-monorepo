/**
 * Adrenal CT washout — absolute & relative percentage washout (ADR-018).
 *
 * APW = ((enhanced − delayed) / (enhanced − unenhanced)) × 100
 * RPW = ((enhanced − delayed) / enhanced) × 100
 *
 * Thresholds commonly cited for adenoma on 15-minute protocols:
 * APW > 60%, RPW > 40% (Radiopaedia; Boland / ACR teaching literature).
 *
 * Educational imaging arithmetic — not a diagnosis or treatment plan.
 */

import type { AdrenalWashoutInput, AdrenalWashoutResult } from './types';

export const ABSOLUTE_ADENOMA_THRESHOLD_PERCENT = 60;
export const RELATIVE_ADENOMA_THRESHOLD_PERCENT = 40;

export const SOURCE_NOTE =
  'APW = ((enhanced − delayed) ÷ (enhanced − pre-contrast)) × 100; RPW = ((enhanced − delayed) ÷ enhanced) × 100. HU from dedicated adrenal CT. Thresholds >60% APW / >40% RPW suggest adenoma (Radiopaedia adrenal washout). Educational only.';

export const DISCLAIMER =
  'Educational imaging calculator — not a diagnosis, biopsy decision, or substitute for radiologist interpretation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Absolute % washout. Throws when (enhanced − unenhanced) is zero. */
export function absoluteWashoutPercent(
  unenhancedHu: number,
  enhancedHu: number,
  delayedHu: number,
): number {
  const denom = enhancedHu - unenhancedHu;
  if (!(Number.isFinite(denom) && denom !== 0)) {
    throw new Error(
      'Absolute washout requires enhanced HU ≠ pre-contrast HU.',
    );
  }
  return ((enhancedHu - delayedHu) / denom) * 100;
}

/** Relative % washout. Throws when enhanced HU is zero. */
export function relativeWashoutPercent(
  enhancedHu: number,
  delayedHu: number,
): number {
  if (!(Number.isFinite(enhancedHu) && enhancedHu !== 0)) {
    throw new Error('Relative washout requires enhanced HU ≠ 0.');
  }
  return ((enhancedHu - delayedHu) / enhancedHu) * 100;
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.0$/, '');
}

const ABSOLUTE_HINT =
  'An absolute washout higher than 60% is strongly suggestive of adrenal adenoma.';
const RELATIVE_HINT =
  'Relative washout higher than 40% is strongly suggestive of adrenal adenoma.';

export function calculateAdrenalWashout(
  input: AdrenalWashoutInput,
): AdrenalWashoutResult {
  const pre = parseNumber(input.preContrastHuText);
  const enhanced = parseNumber(input.enhancedHuText);
  const delayed = parseNumber(input.delayedHuText);

  if (pre === null || enhanced === null || delayed === null) {
    return {
      absoluteWashoutPercent: null,
      relativeWashoutPercent: null,
      formattedAbsolute: '',
      formattedRelative: '',
      absoluteSuggestsAdenoma: null,
      relativeSuggestsAdenoma: null,
      absoluteInterpretation: ABSOLUTE_HINT,
      relativeInterpretation: RELATIVE_HINT,
      statusHeadline: 'Enter three HU values',
      statusDetail:
        'Provide pre-contrast, 60–75 sec post-contrast, and 15 min delayed densities in HU.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  let absolute: number | null = null;
  let absoluteNote = ABSOLUTE_HINT;
  try {
    absolute = absoluteWashoutPercent(pre, enhanced, delayed);
    const suggests = absolute > ABSOLUTE_ADENOMA_THRESHOLD_PERCENT;
    absoluteNote = suggests
      ? `Absolute washout ${formatPercent(absolute)}% is higher than 60% — strongly suggestive of adrenal adenoma (educational threshold).`
      : `Absolute washout ${formatPercent(absolute)}% is not above 60%. ${ABSOLUTE_HINT}`;
  } catch {
    absolute = null;
    absoluteNote =
      'Absolute washout unavailable when enhanced HU equals pre-contrast HU (denominator is zero).';
  }

  let relative: number | null = null;
  let relativeNote = RELATIVE_HINT;
  try {
    relative = relativeWashoutPercent(enhanced, delayed);
    const suggests = relative > RELATIVE_ADENOMA_THRESHOLD_PERCENT;
    relativeNote = suggests
      ? `Relative washout ${formatPercent(relative)}% is higher than 40% — strongly suggestive of adrenal adenoma (educational threshold).`
      : `Relative washout ${formatPercent(relative)}% is not above 40%. ${RELATIVE_HINT}`;
  } catch {
    relative = null;
    relativeNote =
      'Relative washout unavailable when enhanced HU is zero (denominator is zero).';
  }

  return {
    absoluteWashoutPercent: absolute,
    relativeWashoutPercent: relative,
    formattedAbsolute: absolute === null ? '' : formatPercent(absolute),
    formattedRelative: relative === null ? '' : formatPercent(relative),
    absoluteSuggestsAdenoma:
      absolute === null
        ? null
        : absolute > ABSOLUTE_ADENOMA_THRESHOLD_PERCENT,
    relativeSuggestsAdenoma:
      relative === null
        ? null
        : relative > RELATIVE_ADENOMA_THRESHOLD_PERCENT,
    absoluteInterpretation: absoluteNote,
    relativeInterpretation: relativeNote,
    statusHeadline: 'Adrenal washout',
    statusDetail: `Pre-contrast ${pre} HU, enhanced ${enhanced} HU, delayed ${delayed} HU.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
