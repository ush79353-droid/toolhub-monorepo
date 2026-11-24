/**
 * Corrected reticulocyte count (CRC) — educational hematology (ADR-018).
 *
 * CRC (%) = reticulocyte % × (patient Hct ÷ reference Hct).
 * Optional RPI = CRC ÷ maturation factor (standard teaching table by patient Hct).
 *
 * Sources: standard reticulocyte correction / production index teaching.
 */

import {
  correctedReticulocytePercent,
  parseNumber,
} from '../absolute-reticulocyte-count/calculation';
import type {
  CorrectedReticulocyteCountInput,
  CorrectedReticulocyteCountResult,
} from './types';
import { DEFAULT_REFERENCE_HEMATOCRIT_PERCENT } from './types';

export const SOURCE_NOTE =
  'Corrected reticulocyte % = reticulocyte % × (patient Hct ÷ reference Hct). Optional reticulocyte production index (RPI) divides corrected % by a maturation factor from patient hematocrit. Educational arithmetic only.';

export const DISCLAIMER =
  'Educational hematology calculator — not a diagnosis, treatment decision, or laboratory report.';

/** Maturation factor from patient hematocrit (published teaching bands). */
export function maturationFactorForHematocrit(hematocritPercent: number): number {
  if (!(Number.isFinite(hematocritPercent) && hematocritPercent >= 0)) {
    throw new Error('Hematocrit must be a finite non-negative number.');
  }
  if (hematocritPercent >= 45) return 1.0;
  if (hematocritPercent >= 40) return 1.0;
  if (hematocritPercent >= 35) return 1.5;
  if (hematocritPercent >= 25) return 2.0;
  return 2.5;
}

export function formatPercent(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function resolveReferenceHematocrit(input: CorrectedReticulocyteCountInput): number | null {
  if (input.useCustomReferenceHematocrit) {
    return parseNumber(input.referenceHematocritPercentText);
  }
  return parseNumber(DEFAULT_REFERENCE_HEMATOCRIT_PERCENT);
}

export function calculateCorrectedReticulocyteCount(
  input: CorrectedReticulocyteCountInput,
): CorrectedReticulocyteCountResult {
  const base = {
    correctedReticulocytePercent: null,
    reticulocyteProductionIndex: null,
    maturationFactor: null,
    referenceHematocritUsed: null,
    formattedCorrectedPercent: '',
    formattedRpi: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const hct = parseNumber(input.hematocritPercentText);
  const retic = parseNumber(input.reticulocytePercentText);
  const refHct = resolveReferenceHematocrit(input);

  if (hct === null || retic === null) {
    return {
      ...base,
      statusHeadline: 'Enter hematocrit and reticulocytes',
      statusDetail:
        'Enter patient hematocrit (%) and reticulocyte differential (%) to compute the corrected reticulocyte count (CRC).',
    };
  }

  if (refHct === null) {
    return {
      ...base,
      statusHeadline: 'Enter reference hematocrit',
      statusDetail:
        'Enable custom normal hematocrit or use the default reference (45%). Reference Hct must be a positive percentage.',
    };
  }

  if (!(hct > 0 && hct <= 100)) {
    return {
      ...base,
      statusHeadline: 'Invalid hematocrit',
      statusDetail: 'Patient hematocrit must be between 0 and 100% (exclusive of 0).',
    };
  }

  if (!(refHct > 0 && refHct <= 100)) {
    return {
      ...base,
      statusHeadline: 'Invalid reference hematocrit',
      statusDetail: 'Reference hematocrit must be between 0 and 100% (exclusive of 0).',
    };
  }

  if (!(retic >= 0 && retic <= 100)) {
    return {
      ...base,
      statusHeadline: 'Invalid reticulocyte %',
      statusDetail: 'Reticulocyte percentage must be between 0 and 100.',
    };
  }

  const crc = correctedReticulocytePercent(retic, hct, refHct);
  let maturation: number | null = null;
  let rpi: number | null = null;

  if (input.showMaturationIndex) {
    maturation = maturationFactorForHematocrit(hct);
    rpi = crc / maturation;
  }

  const detailParts = [
    `CRC = ${formatPercent(retic)}% × (${formatPercent(hct)}% ÷ ${formatPercent(refHct)}%) = ${formatPercent(crc)}%.`,
  ];
  if (input.showMaturationIndex && maturation != null && rpi != null) {
    detailParts.push(
      `Maturation factor ${maturation.toFixed(1)} at Hct ${formatPercent(hct)}%; RPI = ${formatPercent(rpi)}%.`,
    );
  }

  return {
    correctedReticulocytePercent: crc,
    reticulocyteProductionIndex: rpi,
    maturationFactor: maturation,
    referenceHematocritUsed: refHct,
    formattedCorrectedPercent: formatPercent(crc),
    formattedRpi: rpi != null ? formatPercent(rpi) : '',
    statusHeadline: 'Corrected reticulocyte count',
    statusDetail: detailParts.join(' '),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}