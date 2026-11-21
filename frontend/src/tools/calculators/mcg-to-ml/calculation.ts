import {
  G_PER_ML_PER_DENSITY_UNIT,
  MCG_PER_MASS_UNIT,
  MCG_PER_ML_PER_CONC_UNIT,
  ML_PER_VOLUME_UNIT,
  VITAMIN_B12_EXAMPLE_MCG_PER_ML,
  type ConcentrationUnit,
  type DensityUnit,
  type MassUnit,
  type McgToMlInput,
  type McgToMlResult,
  type VolumeUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function concentrationToMcgPerMl(value: number, unit: ConcentrationUnit): number {
  return value * MCG_PER_ML_PER_CONC_UNIT[unit];
}

export function mcgPerMlToConcentration(mcgPerMl: number, unit: ConcentrationUnit): number {
  return mcgPerMl / MCG_PER_ML_PER_CONC_UNIT[unit];
}

export function densityToGPerMl(value: number, unit: DensityUnit): number {
  return value * G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function gPerMlToDensity(gPerMl: number, unit: DensityUnit): number {
  return gPerMl / G_PER_ML_PER_DENSITY_UNIT[unit];
}

export function toMcg(value: number, unit: MassUnit): number {
  return value * MCG_PER_MASS_UNIT[unit];
}

export function fromMcg(mcg: number, unit: MassUnit): number {
  return mcg / MCG_PER_MASS_UNIT[unit];
}

export function toMl(value: number, unit: VolumeUnit): number {
  return value * ML_PER_VOLUME_UNIT[unit];
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return ml / ML_PER_VOLUME_UNIT[unit];
}

export function mcgToMl(massMcg: number, concentrationMcgPerMl: number): number {
  if (
    !Number.isFinite(massMcg) ||
    !Number.isFinite(concentrationMcgPerMl) ||
    concentrationMcgPerMl <= 0
  ) {
    throw new Error('Invalid mass or concentration');
  }
  return massMcg / concentrationMcgPerMl;
}

export function mlToMcg(volumeMl: number, concentrationMcgPerMl: number): number {
  if (
    !Number.isFinite(volumeMl) ||
    !Number.isFinite(concentrationMcgPerMl) ||
    concentrationMcgPerMl <= 0
  ) {
    throw new Error('Invalid volume or concentration');
  }
  return volumeMl * concentrationMcgPerMl;
}

export function mcgToMlByDensity(massMcg: number, densityGPerMl: number): number {
  if (!Number.isFinite(massMcg) || !Number.isFinite(densityGPerMl) || densityGPerMl <= 0) {
    throw new Error('Invalid mass or density');
  }
  return massMcg / (densityGPerMl * 1_000_000);
}

export function mlToMcgByDensity(volumeMl: number, densityGPerMl: number): number {
  if (!Number.isFinite(volumeMl) || !Number.isFinite(densityGPerMl) || densityGPerMl <= 0) {
    throw new Error('Invalid volume or density');
  }
  return volumeMl * densityGPerMl * 1_000_000;
}

export function resolveConcentrationMcgPerMl(input: McgToMlInput): number | null {
  if (input.mode !== 'medication') return null;
  if (input.medicationPreset === 'vitaminB12Example') {
    return VITAMIN_B12_EXAMPLE_MCG_PER_ML;
  }
  if (input.concentrationValue === null || !Number.isFinite(input.concentrationValue)) {
    return null;
  }
  if (input.concentrationValue <= 0) return null;
  return concentrationToMcgPerMl(input.concentrationValue, input.concentrationUnit);
}

export function resolveDensityGPerMl(input: McgToMlInput): number | null {
  if (input.mode !== 'density') return null;
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToGPerMl(input.densityValue, input.densityUnit);
}

export function calculateMcgToMl(input: McgToMlInput): McgToMlResult {
  let massMcg: number;
  let volumeMl: number;
  let concentrationMcgPerMl: number | null = null;
  let densityGPerMl: number | null = null;
  let factorLabel: string;
  let explanation: string;

  if (input.mode === 'medication') {
    concentrationMcgPerMl = resolveConcentrationMcgPerMl(input)!;
    factorLabel = `Concentration ${formatMeasure(concentrationMcgPerMl)} mcg/mL`;
    if (input.source === 'mass') {
      massMcg = input.massMcg!;
      volumeMl = mcgToMl(massMcg, concentrationMcgPerMl);
      explanation = `${formatMeasure(massMcg)} mcg ÷ ${formatMeasure(concentrationMcgPerMl)} mcg/mL = ${formatMeasure(volumeMl)} mL`;
    } else {
      volumeMl = input.volumeMl!;
      massMcg = mlToMcg(volumeMl, concentrationMcgPerMl);
      explanation = `${formatMeasure(volumeMl)} mL × ${formatMeasure(concentrationMcgPerMl)} mcg/mL = ${formatMeasure(massMcg)} mcg`;
    }
  } else {
    densityGPerMl = resolveDensityGPerMl(input)!;
    factorLabel = `Density ${formatMeasure(densityGPerMl)} g/mL`;
    if (input.source === 'mass') {
      massMcg = input.massMcg!;
      volumeMl = mcgToMlByDensity(massMcg, densityGPerMl);
      explanation = `${formatMeasure(massMcg)} mcg ÷ (${formatMeasure(densityGPerMl)} g/mL × 1,000,000) = ${formatMeasure(volumeMl)} mL`;
    } else {
      volumeMl = input.volumeMl!;
      massMcg = mlToMcgByDensity(volumeMl, densityGPerMl);
      explanation = `${formatMeasure(volumeMl)} mL × ${formatMeasure(densityGPerMl)} g/mL × 1,000,000 = ${formatMeasure(massMcg)} mcg`;
    }
  }

  return {
    mode: input.mode,
    source: input.source,
    massMcg,
    volumeMl,
    factorLabel,
    concentrationMcgPerMl,
    densityGPerMl,
    explanation,
  };
}

export function shareResultText(result: McgToMlResult): string {
  const lines = [
    'mcg to mL Conversion | Omega Calculators',
    '',
    'Mode:',
    result.mode === 'medication' ? 'Medication concentration' : 'Other substance (density)',
    '',
    result.factorLabel,
    '',
    'Medication amount:',
    `${formatMeasure(result.massMcg)} mcg`,
    '',
    'Calculated volume:',
    `${formatMeasure(result.volumeMl)} mL`,
    '',
    'Formula:',
    result.mode === 'medication'
      ? 'Volume = Mass / Concentration'
      : 'Volume = Mass / (Density × 1,000,000)',
    result.explanation,
    '',
    'Mathematical conversion only; not a dosing recommendation.',
  ];
  return lines.join('\n');
}
