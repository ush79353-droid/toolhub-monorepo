import {
  DISCLAIMER,
  FREQUENCY_NOTE,
  MAX_DOSES_PER_24H,
  SOURCE_NOTE,
  findWeightBand,
  kgToLb,
  lbToKg,
} from './labels';
import type {
  IbuprofenDosageInput,
  IbuprofenDosageResult,
  WeightUnit,
} from './types';

function emptyResult(
  patch: Partial<IbuprofenDosageResult>,
): IbuprofenDosageResult {
  return {
    status: 'awaiting_weight',
    weightKg: null,
    weightLb: null,
    productId: null,
    productLabel: null,
    concentrationNote: null,
    doseMl: null,
    doseMg: null,
    doseLine: null,
    frequencyNote: FREQUENCY_NOTE,
    maxDosesPer24Hours: MAX_DOSES_PER_24H,
    interpretation: '',
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
    ...patch,
  };
}

export function parseWeight(
  raw: string,
): number | null | 'invalid' {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'invalid';
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0 || value > 500) return 'invalid';
  return value;
}

export function toKgAndLb(
  value: number,
  unit: WeightUnit,
): { kg: number; lb: number } {
  if (unit === 'kg') {
    return { kg: value, lb: kgToLb(value) };
  }
  return { kg: lbToKg(value), lb: value };
}

function formatDoseMl(ml: number): string {
  // Label values are 1.25 / 1.875 / 5 / 7.5 / 10 / 12.5 / 15 — keep exact.
  if (Number.isInteger(ml)) return String(ml);
  return String(ml);
}

export function calculateIbuprofenDosage(
  input: IbuprofenDosageInput,
): IbuprofenDosageResult {
  if (!input.isSixMonthsOrOlder) {
    return emptyResult({
      status: 'age_gate_blocked',
      interpretation:
        'Infants’ MOTRIN® directions say under 6 months: ask a doctor. Checking “6+ months” alone is not enough — enter a valid weight and confirm the carton before any dose.',
    });
  }

  const parsed = parseWeight(input.weightText);
  if (parsed === 'invalid') {
    return emptyResult({
      status: 'awaiting_weight',
      interpretation: 'Enter a valid child weight greater than zero.',
    });
  }
  if (parsed === null) {
    return emptyResult({
      status: 'awaiting_weight',
      interpretation:
        'Enter the child’s weight to map the matching US OTC Motirin weight band. The 6+ months checkbox alone does not authorize a dose.',
    });
  }

  const { kg, lb } = toKgAndLb(parsed, input.weightUnit);

  if (lb < 12) {
    return emptyResult({
      status: 'ask_doctor',
      weightKg: kg,
      weightLb: lb,
      interpretation:
        'Weight is below the Infants’ MOTRIN® drops chart (under 12 lb). Label directions: ask a doctor.',
    });
  }

  if (lb >= 96) {
    return emptyResult({
      status: 'out_of_chart',
      weightKg: kg,
      weightLb: lb,
      interpretation:
        'Weight is above the Children’s MOTRIN® oral suspension chart (over 95 lb). Ask a clinician; this pediatric OTC chart does not apply.',
    });
  }

  const band = findWeightBand(lb);
  if (!band) {
    return emptyResult({
      status: 'ask_doctor',
      weightKg: kg,
      weightLb: lb,
      interpretation:
        'No matching Motirin weight band for this weight. Ask a doctor and confirm the product label.',
    });
  }

  const doseLine = `${formatDoseMl(band.doseMl)} mL (${band.doseMg} mg ibuprofen)`;

  return emptyResult({
    status: 'labeled_dose',
    weightKg: kg,
    weightLb: lb,
    productId: band.productId,
    productLabel: band.productLabel,
    concentrationNote: band.concentrationNote,
    doseMl: band.doseMl,
    doseMg: band.doseMg,
    doseLine,
    interpretation: `${band.productLabel} · chart band ${band.labelLbRange}: ${doseLine} per dose. ${FREQUENCY_NOTE}`,
  });
}
