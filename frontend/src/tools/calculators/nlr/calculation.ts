/**
 * Neutrophil-to-lymphocyte ratio (NLR) — educational CBC arithmetic (ADR-018).
 *
 *   NLR = neutrophils ÷ lymphocytes
 *
 * Absolute mode: ANC and ALC in ×10³/µL (same numeric basis as ×10⁹/L).
 * Percent mode: neutrophil % and lymphocyte % from the same differential
 * (WBC cancels; no WBC input required).
 *
 * Zero or non-positive lymphocytes make the ratio undefined.
 * Sources: standard CBC differential arithmetic; nonspecific inflammatory marker literature.
 */

import type { NlrInput, NlrResult } from './types';

export const SOURCE_NOTE =
  'NLR = neutrophils ÷ lymphocytes on the same absolute (×10³/µL) or differential-% basis. Educational CBC ratio only.';

export const DISCLAIMER =
  'Educational CBC ratio only — not a diagnosis, prognosis, or treatment decision.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Core NLR formula.
 * @throws if lymphocytes ≤ 0 or either operand is non-finite / neutrophils < 0
 */
export function neutrophilLymphocyteRatio(
  neutrophils: number,
  lymphocytes: number,
): number {
  if (!(Number.isFinite(neutrophils) && neutrophils >= 0)) {
    throw new Error('Neutrophils must be a non-negative finite number.');
  }
  if (!(Number.isFinite(lymphocytes) && lymphocytes > 0)) {
    throw new Error('Lymphocytes must be a positive finite number.');
  }
  return neutrophils / lymphocytes;
}

export function formatNlr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const maxFrac = abs >= 100 ? 2 : abs >= 10 ? 2 : abs >= 1 ? 3 : 4;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function emptyResult(partial?: Partial<NlrResult>): NlrResult {
  return {
    nlr: null,
    formattedNlr: '',
    statusHeadline: 'Enter neutrophil and lymphocyte values.',
    statusDetail:
      'NLR updates when both inputs are valid on the selected absolute or % basis.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateNlr(input: NlrInput): NlrResult {
  const nRaw = parseNumber(input.neutrophilText);
  const lRaw = parseNumber(input.lymphocyteText);

  if (nRaw === null || lRaw === null) {
    return emptyResult();
  }

  if (input.mode === 'percent') {
    if (!(nRaw >= 0 && nRaw <= 100)) {
      return emptyResult({
        statusHeadline: 'Invalid neutrophil %',
        statusDetail: 'Neutrophil percentage must be between 0 and 100.',
      });
    }
    if (!(lRaw >= 0 && lRaw <= 100)) {
      return emptyResult({
        statusHeadline: 'Invalid lymphocyte %',
        statusDetail: 'Lymphocyte percentage must be between 0 and 100.',
      });
    }
  } else {
    if (!(nRaw >= 0)) {
      return emptyResult({
        statusHeadline: 'Invalid ANC',
        statusDetail: 'Absolute neutrophil count must be non-negative.',
      });
    }
    if (!(lRaw >= 0)) {
      return emptyResult({
        statusHeadline: 'Invalid ALC',
        statusDetail: 'Absolute lymphocyte count must be non-negative.',
      });
    }
  }

  if (!(lRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Lymphocytes must be greater than zero.',
      statusDetail:
        'NLR is undefined when lymphocytes are zero (division by zero).',
    });
  }

  try {
    const nlr = neutrophilLymphocyteRatio(nRaw, lRaw);
    if (!Number.isFinite(nlr)) {
      return emptyResult({
        statusHeadline: 'Unable to compute NLR.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      nlr,
      formattedNlr: formatNlr(nlr),
      statusHeadline: 'Neutrophil-lymphocyte ratio',
      statusDetail:
        input.mode === 'absolute'
          ? `NLR = ${nRaw} ÷ ${lRaw} = ${formatNlr(nlr)} (absolute ×10³/µL basis).`
          : `NLR = ${nRaw}% ÷ ${lRaw}% = ${formatNlr(nlr)} (same differential).`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute NLR.',
      statusDetail: 'Check that both values are valid finite numbers.',
    });
  }
}
