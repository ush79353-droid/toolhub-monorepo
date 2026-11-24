/**
 * Isotretinoin cumulative-dose worksheet (ADR-018) — educational arithmetic only.
 *
 * total_mg = weight_kg × planned_mg_per_kg
 * duration_days = total_mg ÷ daily_mg
 * daily_mg = total_mg ÷ duration_days
 *
 * Screenshot offers a mean cumulative example of 135 mg/kg (within commonly cited
 * 120–150 mg/kg teaching band). FDA Accutane labeling recommends 0.5–1 mg/kg/day
 * for 15–20 weeks and does not prescribe a cumulative mg/kg target.
 *
 * Sources: DailyMed Accutane dosage (0.5–1 mg/kg/day, 15–20 weeks);
 * literature teaching cumulative 120–150 mg/kg (not FDA label text).
 */

import {
  MEAN_CUMULATIVE_MG_PER_KG,
  type IsotretinoinDoseInput,
  type IsotretinoinDoseResult,
} from './types';

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Arithmetic: cumulative mass (mg) = body weight (kg) × planned mg/kg; duration (days) = mass ÷ daily mg (or inverse). FDA-labeled Accutane dosing is 0.5–1 mg/kg/day for 15–20 weeks (DailyMed). The 135 mg/kg mean is a screenshot teaching example within a commonly cited 120–150 mg/kg cumulative band — not an FDA-labeled target or prescription.';

export const DISCLAIMER =
  'Educational worksheet only — not a prescription, dosing order, or medical advice. Isotretinoin requires clinician supervision (iPLEDGE / local program).';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

export function durationToDays(value: number, unit: 'days' | 'weeks'): number {
  return unit === 'days' ? value : value * 7;
}

export function formatFixed(n: number, digits: number): string {
  const f = n.toFixed(digits);
  return f.replace(/\.?0+$/, '');
}

export function calculateIsotretinoinDose(
  input: IsotretinoinDoseInput,
): IsotretinoinDoseResult {
  const empty = (
    headline: string,
    detail: string,
  ): IsotretinoinDoseResult => ({
    weightKg: null,
    cumulativeMgPerKg: null,
    totalCumulativeMg: null,
    dailyDoseMg: null,
    durationDays: null,
    durationWeeks: null,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  });

  const weightRaw = parseNumber(input.weightText);
  if (weightRaw === null) {
    return empty(
      'Enter weight',
      'Enter body weight to compute the cumulative milligram target.',
    );
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const cumulativeMgPerKg =
    input.cumulativeMode === 'mean_135'
      ? MEAN_CUMULATIVE_MG_PER_KG
      : parseNumber(input.exactCumulativeMgPerKgText);

  if (cumulativeMgPerKg === null) {
    return empty(
      'Enter cumulative mg/kg',
      'Choose the mean 135 mg/kg example or enter an exact planned cumulative dose in mg/kg.',
    );
  }

  const totalCumulativeMg = weightKg * cumulativeMgPerKg;

  if (input.solveFor === 'duration') {
    const daily = parseNumber(input.dailyDoseMgText);
    if (daily === null) {
      return {
        weightKg,
        cumulativeMgPerKg,
        totalCumulativeMg,
        dailyDoseMg: null,
        durationDays: null,
        durationWeeks: null,
        statusHeadline: 'Enter daily dose',
        statusDetail: `Cumulative target ≈ ${formatFixed(totalCumulativeMg, 1)} mg. Enter daily dose (mg) to solve duration.`,
        sourceNote: SOURCE_NOTE,
        disclaimer: DISCLAIMER,
      };
    }
    if (!(daily > 0)) {
      throw new Error('Daily dose must be greater than zero.');
    }
    const durationDays = totalCumulativeMg / daily;
    return {
      weightKg,
      cumulativeMgPerKg,
      totalCumulativeMg,
      dailyDoseMg: daily,
      durationDays,
      durationWeeks: durationDays / 7,
      statusHeadline: 'Therapy duration',
      statusDetail: `Target ${formatFixed(totalCumulativeMg, 1)} mg ÷ ${formatFixed(daily, 2)} mg/day ≈ ${formatFixed(durationDays, 1)} days (${formatFixed(durationDays / 7, 2)} weeks). Educational only.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const durationRaw = parseNumber(input.durationValueText);
  if (durationRaw === null) {
    return {
      weightKg,
      cumulativeMgPerKg,
      totalCumulativeMg,
      dailyDoseMg: null,
      durationDays: null,
      durationWeeks: null,
      statusHeadline: 'Enter duration',
      statusDetail: `Cumulative target ≈ ${formatFixed(totalCumulativeMg, 1)} mg. Enter duration to solve daily dose.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }
  const durationDays = durationToDays(durationRaw, input.durationUnit);
  if (!(durationDays > 0)) {
    throw new Error('Duration must be greater than zero.');
  }
  const dailyDoseMg = totalCumulativeMg / durationDays;
  return {
    weightKg,
    cumulativeMgPerKg,
    totalCumulativeMg,
    dailyDoseMg,
    durationDays,
    durationWeeks: durationDays / 7,
    statusHeadline: 'Daily dose',
    statusDetail: `Target ${formatFixed(totalCumulativeMg, 1)} mg ÷ ${formatFixed(durationDays, 1)} days ≈ ${formatFixed(dailyDoseMg, 2)} mg/day. Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
