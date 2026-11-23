/**
 * ANC (cells/µL) from WBC ×10³/µL and lab-report neutrophil % (ADR-018).
 *
 *   ANC (cells/µL) = WBC (×10³/µL) × 1,000 × (neutrophil % ÷ 100)
 *
 * Band % is added only in POLY+Bands and SEGS+Bands modes; NEUT and POLY
 * modes treat the entered % as already reflecting total segmented neutrophils.
 */

import type { AncWithoutBandsInput, AncWithoutBandsResult, LabReportMode } from './types';
import { modeUsesBands } from './types';

export const SOURCE_NOTE =
  'Absolute neutrophil count (cells/µL) = WBC (×10³/µL) × 1,000 × (combined neutrophil % ÷ 100). Band forms are added only when the selected lab-report mode separates bands from segs/POLY. Educational arithmetic only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function combinedNeutrophilPercent(
  mode: LabReportMode,
  primaryPercent: number,
  bandsPercent: number,
): number {
  if (!modeUsesBands(mode)) return primaryPercent;
  const combined = primaryPercent + bandsPercent;
  if (combined > 100) {
    throw new Error('Combined neutrophil and band percentages must not exceed 100.');
  }
  return combined;
}

/**
 * Core ANC in cells/µL.
 * @throws on invalid WBC or percent ranges
 */
export function absoluteNeutrophilCountCellsPerMicroliter(
  wbcTimes10e3PerMicroliter: number,
  neutrophilPercent: number,
): number {
  if (!(Number.isFinite(wbcTimes10e3PerMicroliter) && wbcTimes10e3PerMicroliter > 0)) {
    throw new Error('WBC must be a positive finite number.');
  }
  if (
    !(
      Number.isFinite(neutrophilPercent) &&
      neutrophilPercent >= 0 &&
      neutrophilPercent <= 100
    )
  ) {
    throw new Error('Neutrophil percentage must be between 0 and 100.');
  }
  return wbcTimes10e3PerMicroliter * 1000 * (neutrophilPercent / 100);
}

export function calculateAncWithoutBands(
  input: AncWithoutBandsInput,
): AncWithoutBandsResult {
  const wbc = parseNumber(input.wbcText);
  const primary = parseNumber(input.primaryPercentText);
  const bands = modeUsesBands(input.labReportMode)
    ? parseNumber(input.bandsPercentText)
    : 0;

  const empty = {
    ancCellsPerMicroliter: null,
    combinedNeutrophilPercent: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const needsBands = modeUsesBands(input.labReportMode);

  if (wbc === null || primary === null) {
    return {
      ...empty,
      statusHeadline: 'Enter WBC and differential %',
      statusDetail:
        'Enter WBC (×10³/µL) and the neutrophil percentage for your lab-report layout.',
    };
  }

  if (!(wbc > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid WBC',
      statusDetail: 'White blood cell count must be positive.',
    };
  }

  if (!(primary >= 0 && primary <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid percentage',
      statusDetail: 'Neutrophil percentage must be between 0 and 100.',
    };
  }

  if (needsBands) {
    if (input.bandsPercentText.trim() === '') {
      return {
        ...empty,
        statusHeadline: 'Enter band forms %',
        statusDetail: 'This lab-report mode requires band form percentage in addition to segs/POLY %.',
      };
    }
    if (bands === null) {
      return {
        ...empty,
        statusHeadline: 'Invalid bands %',
        statusDetail: 'Enter a valid band forms percentage.',
      };
    }
    if (!(bands >= 0 && bands <= 100)) {
      return {
        ...empty,
        statusHeadline: 'Invalid bands %',
        statusDetail: 'Band forms percentage must be between 0 and 100.',
      };
    }
  }

  const bandsVal = needsBands && bands !== null ? bands : 0;

  let combined: number;
  try {
    combined = combinedNeutrophilPercent(input.labReportMode, primary, bandsVal);
  } catch {
    return {
      ...empty,
      statusHeadline: 'Invalid differential',
      statusDetail:
        'Combined neutrophil and band percentages must not exceed 100%.',
    };
  }

  const anc = absoluteNeutrophilCountCellsPerMicroliter(wbc, combined);

  return {
    ancCellsPerMicroliter: anc,
    combinedNeutrophilPercent: combined,
    statusHeadline: 'Absolute neutrophil count',
    statusDetail: `ANC = ${wbc} × 1,000 × (${combined} ÷ 100) = ${formatCount(anc)} cells/µL.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/** cells/µL — typically whole numbers, show decimals when small. */
export function formatCount(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const maxFrac = abs >= 10 ? 0 : abs >= 1 ? 1 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(value);
}