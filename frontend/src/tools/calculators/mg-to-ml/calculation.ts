import {
  MG_PER_ML_PER_DENSITY_UNIT,
  WATER_DENSITY_MG_PER_ML,
  type DensityUnit,
  type MgToMlInput,
  type MgToMlResult,
  type OtherUnitRow,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function densityToMgPerMl(value: number, unit: DensityUnit): number {
  return value * MG_PER_ML_PER_DENSITY_UNIT[unit];
}

export function mgPerMlToDensity(mgPerMl: number, unit: DensityUnit): number {
  return mgPerMl / MG_PER_ML_PER_DENSITY_UNIT[unit];
}

/** Labeled ingredient mass / labeled volume → concentration in mg/mL. */
export function concentrationFromLabel(massMg: number, volumeMl: number): number {
  return massMg / volumeMl;
}

export function resolveFactorMgPerMl(input: MgToMlInput): number | null {
  if (input.mode === 'density') {
    if (input.substance === 'water') return WATER_DENSITY_MG_PER_ML;
    if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
    if (input.densityValue <= 0) return null;
    return densityToMgPerMl(input.densityValue, input.densityUnit);
  }

  if (input.concentrationFormat === 'mgPerMl') {
    if (input.concentrationMgPerMl === null || !Number.isFinite(input.concentrationMgPerMl)) {
      return null;
    }
    if (input.concentrationMgPerMl <= 0) return null;
    return input.concentrationMgPerMl;
  }

  if (
    input.labelMassMg === null ||
    input.labelVolumeMl === null ||
    !Number.isFinite(input.labelMassMg) ||
    !Number.isFinite(input.labelVolumeMl)
  ) {
    return null;
  }
  if (input.labelMassMg < 0 || input.labelVolumeMl <= 0) return null;
  return concentrationFromLabel(input.labelMassMg, input.labelVolumeMl);
}

function factorLabel(input: MgToMlInput, factor: number): string {
  if (input.mode === 'density') {
    return `Density ${formatMeasure(factor)} mg/mL`;
  }
  return `Concentration ${formatMeasure(factor)} mg/mL`;
}

function substanceLabel(input: MgToMlInput): string {
  if (input.mode === 'medication') return 'Custom medication (user-supplied concentration)';
  if (input.substance === 'water') {
    return 'Water (approximate reference ≈ 1 g/mL)';
  }
  return 'Custom substance';
}

function otherMassUnits(massMg: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mcg', label: 'Micrograms (mcg)', value: massMg * 1000 },
    { unit: 'mg', label: 'Milligrams (mg)', value: massMg },
    { unit: 'g', label: 'Grams (g)', value: massMg / 1000 },
    { unit: 'kg', label: 'Kilograms (kg)', value: massMg / 1_000_000 },
  ];
}

function otherVolumeUnits(volumeMl: number): readonly OtherUnitRow[] {
  return [
    { unit: 'µL', label: 'Microliters (µL)', value: volumeMl * 1000 },
    { unit: 'mL', label: 'Milliliters (mL)', value: volumeMl },
    { unit: 'cL', label: 'Centiliters (cL)', value: volumeMl / 10 },
    { unit: 'L', label: 'Liters (L)', value: volumeMl / 1000 },
  ];
}

export function massToVolume(massMg: number, factorMgPerMl: number): number {
  return massMg / factorMgPerMl;
}

export function volumeToMass(volumeMl: number, factorMgPerMl: number): number {
  return volumeMl * factorMgPerMl;
}

export function calculateMgToMl(input: MgToMlInput): MgToMlResult {
  const factor = resolveFactorMgPerMl(input)!;
  let massMg: number;
  let volumeMl: number;

  if (input.source === 'mass') {
    massMg = input.massMg!;
    volumeMl = massToVolume(massMg, factor);
  } else {
    volumeMl = input.volumeMl!;
    massMg = volumeToMass(volumeMl, factor);
  }

  return {
    mode: input.mode,
    source: input.source,
    massMg,
    volumeMl,
    factorMgPerMl: factor,
    factorLabel: factorLabel(input, factor),
    substanceLabel: substanceLabel(input),
    otherMassUnits: otherMassUnits(massMg),
    otherVolumeUnits: otherVolumeUnits(volumeMl),
  };
}
