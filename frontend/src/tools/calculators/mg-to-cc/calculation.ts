import {
  MG_PER_ML_PER_DENSITY_UNIT,
  WATER_DENSITY_MG_PER_ML,
  type ConcentrationUnit,
  type DensityUnit,
  type MgToCcInput,
  type MgToCcResult,
} from './types';

export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  return String(Number(value.toFixed(digits)));
}

/** Normalize concentration to mg/mL (= mg/cc). */
export function normalizeConcentration(value: number, unit: ConcentrationUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Concentration must be greater than zero.');
  }
  switch (unit) {
    case 'mgPerMl':
    case 'mgPerCc':
      return value;
    case 'mgPer5Ml':
      return value / 5;
    default:
      throw new Error('Unknown concentration unit');
  }
}

/** Normalize density to mg/mL (= mg/cc). */
export function normalizeDensity(value: number, unit: DensityUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Density must be greater than zero.');
  }
  return value * MG_PER_ML_PER_DENSITY_UNIT[unit];
}

export function densityToMgPerMl(value: number, unit: DensityUnit): number {
  return normalizeDensity(value, unit);
}

export function mgPerMlToDensity(mgPerMl: number, unit: DensityUnit): number {
  return mgPerMl / MG_PER_ML_PER_DENSITY_UNIT[unit];
}

export function massToVolumeCc(massMg: number, valueMgPerMl: number): number {
  if (!Number.isFinite(massMg) || massMg < 0) {
    throw new Error('Mass must be a non-negative finite number.');
  }
  if (!Number.isFinite(valueMgPerMl) || valueMgPerMl <= 0) {
    throw new Error('Concentration or density must be greater than zero.');
  }
  return massMg / valueMgPerMl;
}

export function volumeToMassMg(volumeCc: number, valueMgPerMl: number): number {
  if (!Number.isFinite(volumeCc) || volumeCc < 0) {
    throw new Error('Volume must be a non-negative finite number.');
  }
  if (!Number.isFinite(valueMgPerMl) || valueMgPerMl <= 0) {
    throw new Error('Concentration or density must be greater than zero.');
  }
  return volumeCc * valueMgPerMl;
}

export function resolveFactorMgPerMl(input: MgToCcInput): number | null {
  if (input.mode === 'substance') {
    if (input.substance === 'water') return WATER_DENSITY_MG_PER_ML;
    if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
    if (input.densityValue <= 0) return null;
    return densityToMgPerMl(input.densityValue, input.densityUnit);
  }

  if (input.concentrationValue === null || !Number.isFinite(input.concentrationValue)) {
    return null;
  }
  if (input.concentrationValue <= 0) return null;
  try {
    return normalizeConcentration(input.concentrationValue, input.concentrationUnit);
  } catch {
    return null;
  }
}

function factorLabel(input: MgToCcInput, factor: number): string {
  if (input.mode === 'substance') {
    return `Density ${formatMeasure(factor)} mg/cc`;
  }
  return `Concentration ${formatMeasure(factor)} mg/mL`;
}

function substanceLabel(input: MgToCcInput): string {
  if (input.mode === 'medication') {
    return 'Custom medication (user-supplied concentration)';
  }
  if (input.substance === 'water') {
    return 'Water (approximate reference ≈ 1 g/mL)';
  }
  return 'Custom substance';
}

export function calculateMgToCc(input: MgToCcInput): MgToCcResult {
  const factor = resolveFactorMgPerMl(input)!;
  let massMg: number;
  let volumeCc: number;

  if (input.source === 'mass') {
    massMg = input.massMg!;
    volumeCc = massToVolumeCc(massMg, factor);
  } else {
    volumeCc = input.volumeCc!;
    massMg = volumeToMassMg(volumeCc, factor);
  }

  const explanation =
    input.source === 'mass'
      ? `${formatMeasure(massMg)} ÷ ${formatMeasure(factor)} = ${formatMeasure(volumeCc)} cc`
      : `${formatMeasure(volumeCc)} × ${formatMeasure(factor)} = ${formatMeasure(massMg)} mg`;

  return {
    mode: input.mode,
    source: input.source,
    massMg,
    volumeCc,
    volumeMl: volumeCc,
    factorMgPerMl: factor,
    factorLabel: factorLabel(input, factor),
    substanceLabel: substanceLabel(input),
    explanation,
  };
}

export function shareResultText(result: MgToCcResult): string {
  return [
    'mg to cc Conversion | Omega Calculators',
    '',
    `Mode: ${result.mode === 'medication' ? 'Medication' : 'Substance'}`,
    result.substanceLabel,
    result.factorLabel,
    `Mass: ${formatMeasure(result.massMg)} mg`,
    `Volume: ${formatMeasure(result.volumeCc)} cc (${formatMeasure(result.volumeMl)} mL)`,
    '',
    'Formula:',
    result.explanation,
    '',
    '/tools/mg-to-cc-conversion',
  ].join('\n');
}
