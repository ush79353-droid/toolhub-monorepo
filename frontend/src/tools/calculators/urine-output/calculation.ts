/**
 * Urine output rate (mL/kg/h) and simple fluid balance.
 *
 * rate = urineVolume_mL ÷ (weight_kg × time_h)
 * balance = fluidIntake_mL − urineVolume_mL (insensible/GI losses omitted)
 *
 * Fixture: 1680 mL urine, 24 h, 70 kg → 1.0 mL/kg/h.
 */

import type {
  PatientAgeGroup,
  TimeUnit,
  UrineOutputInput,
  UrineOutputResult,
  VolumeUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Urine output rate = urine volume (mL) ÷ [body weight (kg) × collection time (h)]. Fluid balance here is intake − urine only; insensible losses, sweat, stool, and drains are not included.';

export const DISCLAIMER =
  'Educational worksheet only — not monitoring equipment, not a hospital record, and not a treatment directive.';

const LB_PER_KG = 2.2046226218;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value / LB_PER_KG : value;
}

export function weightFromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg * LB_PER_KG : kg;
}

export function timeToHours(value: number, unit: TimeUnit): number {
  return unit === 'days' ? value * 24 : value;
}

export function timeFromHours(hours: number, unit: TimeUnit): number {
  return unit === 'days' ? hours / 24 : hours;
}

export function volumeToMl(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value * 1000 : value;
}

export function volumeFromMl(ml: number, unit: VolumeUnit): number {
  return unit === 'L' ? ml / 1000 : ml;
}

export function urineOutputRateMlKgHr(
  urineMl: number,
  weightKg: number,
  timeHours: number,
): number | null {
  if (!(weightKg > 0) || !(timeHours > 0) || !(urineMl >= 0)) return null;
  return urineMl / (weightKg * timeHours);
}

/** Teaching bands; pediatric oliguria threshold often cited <1 mL/kg/h vs adult <0.5. */
export function interpretRate(
  ageGroup: PatientAgeGroup,
  rate: number,
): string {
  const oliguriaCutoff = ageGroup === 'pediatric' ? 1 : 0.5;
  if (rate < oliguriaCutoff) {
    return ageGroup === 'pediatric'
      ? `Below typical pediatric concern (<${oliguriaCutoff} mL/kg/h)`
      : `Possible oliguria (<${oliguriaCutoff} mL/kg/h)`;
  }
  if (rate <= 2) return 'Within common hourly range (≈0.5–2 mL/kg/h)';
  return 'High hourly output (>2 mL/kg/h)';
}

export function formatMeasure(value: number | null, digits = 4): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatRate(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(rounded);
}

export function formatBalanceMl(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = Math.round(value * 10) / 10;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(rounded);
}

export function calculateUrineOutput(input: UrineOutputInput): UrineOutputResult {
  const empty: UrineOutputResult = {
    weightKg: null,
    timeHours: null,
    urineMl: null,
    intakeMl: null,
    rateMlKgHr: null,
    fluidBalanceMl: null,
    rateLabel: null,
    balanceNote: null,
    statusHeadline: 'Enter weight, time, and urine volume',
    statusDetail:
      'Urine output rate needs weight (kg), collection interval, and urine volume. Fluid intake is optional.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const weightRaw = parseNumber(input.weightText);
  const timeRaw = parseNumber(input.timeText);
  const urineRaw = parseNumber(input.urineText);
  const intakeRaw = parseNumber(input.intakeText);

  const hasUrine = urineRaw !== null;
  const hasWeight = weightRaw !== null;
  const hasTime = timeRaw !== null;
  const hasIntake = intakeRaw !== null;

  if (!hasUrine && !hasWeight && !hasTime && !hasIntake) {
    return empty;
  }

  if (!hasWeight || !hasTime || !hasUrine) {
    return {
      ...empty,
      statusHeadline: 'Complete required inputs',
      statusDetail:
        'Weight, collection time, and urine volume are required for the urine output rate.',
    };
  }

  if (!(weightRaw! > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Body weight must be greater than zero.',
    };
  }

  if (!(timeRaw! > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid time',
      statusDetail: 'Collection time must be greater than zero.',
    };
  }

  if (urineRaw! < 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid urine volume',
      statusDetail: 'Urine volume cannot be negative.',
    };
  }

  if (hasIntake && intakeRaw! < 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid fluid intake',
      statusDetail: 'Fluid intake cannot be negative.',
    };
  }

  const weightKg = weightToKg(weightRaw!, input.weightUnit);
  const timeHours = timeToHours(timeRaw!, input.timeUnit);
  const urineMl = volumeToMl(urineRaw!, input.urineUnit);
  const intakeMl = hasIntake
    ? volumeToMl(intakeRaw!, input.intakeUnit)
  : null;

  const rate = urineOutputRateMlKgHr(urineMl, weightKg, timeHours);
  const rateRounded =
    rate != null ? Math.round(rate * 100) / 100 : null;
  const rateLabel =
    rateRounded != null ? interpretRate(input.ageGroup, rateRounded) : null;

  let fluidBalanceMl: number | null = null;
  let balanceNote: string | null = null;
  if (intakeMl != null) {
    fluidBalanceMl = intakeMl - urineMl;
    balanceNote =
      'Intake minus urine only; omits insensible water loss, sweat, stool, vomiting, and other unmeasured outputs.';
  }

  const ageLabel =
    input.ageGroup === 'pediatric' ? '<18 years' : '≥18 years';

  return {
    weightKg,
    timeHours,
    urineMl,
    intakeMl,
    rateMlKgHr: rateRounded,
    fluidBalanceMl,
    rateLabel,
    balanceNote,
    statusHeadline: 'Urine output rate',
    statusDetail: `${rateRounded != null ? formatRate(rateRounded) : '—'} mL/kg/h over ${formatMeasure(timeHours, 4)} h (${ageLabel}). ${
      rateLabel ?? ''
    }`.trim(),
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}