/**
 * Dosage Calculator — pure educational unit arithmetic (ADR-018).
 *
 * Converts an externally specified mass-per-kg order into mass per
 * administration / per day, and optional liquid volume.
 * Does not recommend drugs, ages, or regimens.
 */

import {
  FREQUENCY_OPTIONS,
  type ConcUnit,
  type DosageBasis,
  type DosageInput,
  type DosageResult,
  type FrequencyId,
  type MassUnit,
  type WeightUnit,
} from './types';

export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

/** Micrograms in one milligram. */
export const MCG_PER_MG = 1000;
/** Milligrams in one gram. */
export const MG_PER_G = 1000;

export const DISCLAIMER =
  'Educational conversion only. Enter the dose your clinician or label already specified. This tool does not recommend medicines, ages, or regimens.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * KG_PER_POUND;
    case 'st':
      return value * KG_PER_STONE;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

/** Convert a mass quantity into milligrams. */
export function massToMg(value: number, unit: MassUnit): number {
  switch (unit) {
    case 'mg':
      return value;
    case 'mcg':
      return value / MCG_PER_MG;
    case 'g':
      return value * MG_PER_G;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

export function mgToMass(mg: number, unit: MassUnit): number {
  switch (unit) {
    case 'mg':
      return mg;
    case 'mcg':
      return mg * MCG_PER_MG;
    case 'g':
      return mg / MG_PER_G;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

/** Concentration expressed as mg per mL. */
export function concentrationToMgPerMl(value: number, unit: ConcUnit): number {
  switch (unit) {
    case 'mg/mL':
      return value;
    case 'mcg/mL':
      return value / MCG_PER_MG;
    case 'g/mL':
      return value * MG_PER_G;
    default: {
      const _e: never = unit;
      return _e;
    }
  }
}

export function dosesPerDayFor(id: FrequencyId): number {
  const row = FREQUENCY_OPTIONS.find((o) => o.id === id);
  return row?.dosesPerDay ?? 1;
}

export function frequencyLabel(id: FrequencyId): string {
  return FREQUENCY_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function formatMass(value: number, unit: MassUnit): string {
  if (!Number.isFinite(value)) return '';
  const digits = unit === 'g' ? 4 : unit === 'mcg' ? 2 : 2;
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })} ${unit}`;
}

export function formatMl(value: number): string {
  if (!Number.isFinite(value)) return '';
  return `${value.toLocaleString('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  })} mL`;
}

/**
 * Compute per-admin and per-day masses in the dosage mass unit.
 * Per-day basis divides by frequency; per-administration multiplies for daily total.
 */
export function computeDoseMasses(
  weightKg: number,
  dosagePerKg: number,
  basis: DosageBasis,
  dosesPerDay: number,
): { perAdmin: number; perDay: number } {
  if (!(weightKg > 0) || !(dosagePerKg > 0) || !(dosesPerDay > 0)) {
    throw new RangeError('Weight, dosage, and frequency must be positive.');
  }
  const product = weightKg * dosagePerKg;
  if (basis === 'per_day') {
    return { perDay: product, perAdmin: product / dosesPerDay };
  }
  return { perAdmin: product, perDay: product * dosesPerDay };
}

export function liquidMlFromDoseMg(
  doseMg: number,
  concentrationMgPerMl: number,
): number {
  if (!(concentrationMgPerMl > 0)) {
    throw new RangeError('Concentration must be positive.');
  }
  return doseMg / concentrationMgPerMl;
}

export function calculateDosage(input: DosageInput): DosageResult | null {
  const w = parseNumber(input.weight);
  const d = parseNumber(input.dosagePerKg);
  if (w == null || d == null) return null;
  if (w <= 0 || d <= 0) return null;

  const weightKg = weightToKg(w, input.weightUnit);
  if (!(weightKg > 0) || weightKg > 500) return null;

  const dosesPerDay = dosesPerDayFor(input.frequencyId);
  if (!(dosesPerDay > 0)) return null;

  let perAdmin: number;
  let perDay: number;
  try {
    ({ perAdmin, perDay } = computeDoseMasses(
      weightKg,
      d,
      input.dosageBasis,
      dosesPerDay,
    ));
  } catch {
    return null;
  }
  if (!Number.isFinite(perAdmin) || !Number.isFinite(perDay)) return null;

  const unit = input.dosageMassUnit;
  let liquidMl: number | null = null;
  let liquidNote: string | null = null;
  const concRaw = parseNumber(input.concentration);
  if (input.liquidOpen && concRaw != null) {
    if (concRaw <= 0) return null;
    const concMgMl = concentrationToMgPerMl(concRaw, input.concentrationUnit);
    const doseMg = massToMg(perAdmin, unit);
    try {
      liquidMl = liquidMlFromDoseMg(doseMg, concMgMl);
    } catch {
      return null;
    }
    if (!Number.isFinite(liquidMl) || liquidMl < 0) return null;
    liquidNote = `Liquid volume per administration = dose (${formatMass(perAdmin, unit)}) ÷ concentration.`;
  } else if (input.liquidOpen && input.concentration.trim() === '') {
    liquidNote = 'Enter medicine concentration to convert the per-administration dose into mL.';
  }

  const basisLabel =
    input.dosageBasis === 'per_day'
      ? 'Dosage rate is per kilogram per day; divided by frequency for each administration.'
      : 'Dosage rate is per kilogram per administration; multiplied by frequency for the daily total.';

  return {
    weightKg,
    dosagePerKg: d,
    dosageMassUnit: unit,
    dosageBasis: input.dosageBasis,
    dosesPerDay,
    frequencyLabel: frequencyLabel(input.frequencyId),
    dosePerAdmin: perAdmin,
    dosePerDay: perDay,
    formattedDosePerAdmin: formatMass(perAdmin, unit),
    formattedDosePerDay: formatMass(perDay, unit),
    liquidMl,
    formattedLiquidMl: liquidMl == null ? null : formatMl(liquidMl),
    liquidNote,
    explanation: `${basisLabel} Weight ${weightKg.toLocaleString('en-US', { maximumFractionDigits: 4 })} kg × ${d} ${unit}/kg.`,
    disclaimer: DISCLAIMER,
  };
}
