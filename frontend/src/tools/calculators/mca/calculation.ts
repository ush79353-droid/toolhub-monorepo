/**
 * Fetal MCA peak systolic velocity — educational MoM = measured / gestation median.
 */

import {
  medianPsvCmForWeek,
  SOURCE_SINGLETON,
  SOURCE_TWIN,
  type PregnancyPlurality,
} from './reference-data';
import type { McaInput, McaResult, VelocityUnit } from './types';

export const DISCLAIMER =
  'Educational MCA-PSV MoM arithmetic only. It does not diagnose fetal anemia, alloimmunization management, or twin discordance. Interpret Doppler with a maternal–fetal medicine specialist and the cited reference cohort.';

const MM_PER_CM = 10;

export function parsePositiveNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function psvToCmPerS(value: number, unit: VelocityUnit): number {
  return unit === 'mm/s' ? value / MM_PER_CM : value;
}

export function psvFromCmPerS(cmPerS: number, unit: VelocityUnit): number {
  return unit === 'mm/s' ? cmPerS * MM_PER_CM : cmPerS;
}

export function formatVelocity(value: number, unit: VelocityUnit): string {
  const display = psvFromCmPerS(value, unit);
  const digits = unit === 'cm/s' ? 1 : 0;
  const rounded = Math.round(display * 10 ** digits) / 10 ** digits;
  return rounded.toFixed(digits);
}

export function formatMom(mom: number): string {
  const rounded = Math.round(mom * 1000) / 1000;
  return String(rounded);
}

function twinGapNote(plurality: PregnancyPlurality, gaWeeks: number): string | undefined {
  if (plurality !== 'twin') return undefined;
  if (gaWeeks < 15) {
    return 'The published MCDA twin median table begins at 15 weeks; week 14 has no cohort median here.';
  }
  if (gaWeeks > 37) {
    return 'The published MCDA twin median table ends at 37 weeks; weeks 38–40 are not filled from that cohort.';
  }
  return undefined;
}

export function referenceForPlurality(plurality: PregnancyPlurality): string {
  return plurality === 'single' ? SOURCE_SINGLETON : SOURCE_TWIN;
}

export function calculateMcaMoM(
  plurality: PregnancyPlurality,
  gaWeeks: number,
  measuredPsvCm: number,
): McaResult | null {
  const medianCm = medianPsvCmForWeek(plurality, gaWeeks);
  if (medianCm == null || !(medianCm > 0)) return null;

  const mom = measuredPsvCm / medianCm;
  const twinGap = twinGapNote(plurality, gaWeeks);
  const unit: VelocityUnit = 'cm/s';

  return {
    measuredPsvCm,
    medianPsvCm: medianCm,
    mom,
    formattedMeasured: formatVelocity(measuredPsvCm, unit),
    formattedMedian: formatVelocity(medianCm, unit),
    formattedMom: formatMom(mom),
    referenceNote: referenceForPlurality(plurality),
    sourceLabel: referenceForPlurality(plurality),
    disclaimer: DISCLAIMER,
    twinReferenceGap: twinGap,
    explanation: `MoM = measured PSV (${formatVelocity(measuredPsvCm, unit)} cm/s) ÷ median (${formatVelocity(medianCm, unit)} cm/s) = ${formatMom(mom)}.`,
  };
}

export function medianDisplayForInput(input: McaInput): {
  medianPsvCm: number | null;
  formattedMedian: string;
  twinReferenceGap?: string;
} {
  const medianCm = medianPsvCmForWeek(input.plurality, input.gaWeeks);
  const twinGap = twinGapNote(input.plurality, input.gaWeeks);
  if (medianCm == null) {
    return { medianPsvCm: null, formattedMedian: '', twinReferenceGap: twinGap };
  }
  return {
    medianPsvCm: medianCm,
    formattedMedian: formatVelocity(medianCm, input.velocityUnit),
    twinReferenceGap: twinGap,
  };
}

export function calculateFromInput(input: McaInput): McaResult | null {
  const measured = parsePositiveNumber(input.psvText);
  if (measured == null) return null;
  const measuredCm = psvToCmPerS(measured, input.velocityUnit);
  return calculateMcaMoM(input.plurality, input.gaWeeks, measuredCm);
}