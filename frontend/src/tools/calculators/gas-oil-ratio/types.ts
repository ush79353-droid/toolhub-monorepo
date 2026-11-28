/**
 * Gas Oil Ratio Calculator — two-stroke premix (educational).
 * Oil = Gas / Ratio (same volume units).
 * Modes: oil | gas | ratio | total mixture.
 * Always follow the engine manufacturer’s recommended ratio.
 */

export type FuelVolumeUnit =
  | 'mL'
  | 'L'
  | 'flOzUS'
  | 'galUS'
  | 'flOzImp'
  | 'galImp';

export type GasOilMode =
  | 'calculateOil'
  | 'calculateGas'
  | 'calculateRatio'
  | 'calculateTotalMixture';

export const VOLUME_UNIT_LABELS: Record<FuelVolumeUnit, string> = {
  mL: 'mL',
  L: 'L',
  flOzUS: 'fl oz (US)',
  galUS: 'gal (US)',
  flOzImp: 'fl oz (imp)',
  galImp: 'gal (imp)',
};

export const MODE_LABELS: Record<GasOilMode, string> = {
  calculateOil: 'Calculate oil',
  calculateGas: 'Calculate gas',
  calculateRatio: 'Calculate ratio',
  calculateTotalMixture: 'Total mixture',
};

/** Common two-stroke presets — not universal recommendations. */
export const RATIO_PRESETS = [
  16, 20, 25, 32, 40, 50, 60, 80, 100,
] as const;

export interface GasOilInput {
  mode: GasOilMode;
  ratio: string;
  gasVolume: string;
  gasUnit: FuelVolumeUnit;
  oilVolume: string;
  oilUnit: FuelVolumeUnit;
  totalMixtureVolume: string;
  totalMixtureUnit: FuelVolumeUnit;
  /** Mixing chart display system */
  chartSystem: 'metric' | 'us';
}

export interface GasOilResult {
  mode: GasOilMode;
  ratio: number | null;
  gasVolumeMl: number | null;
  oilVolumeMl: number | null;
  totalMixtureMl: number | null;
  oilPercentageOfMixture: number | null;
  oilPercentageOfGasoline: number | null;
  formattedGas: string | null;
  formattedOil: string | null;
  formattedTotal: string | null;
  formattedRatio: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type GasOilFieldErrors = {
  ratio?: string;
  gasVolume?: string;
  oilVolume?: string;
  totalMixtureVolume?: string;
  form?: string;
};

export function createEmptyInput(): GasOilInput {
  return {
    mode: 'calculateOil',
    ratio: '50',
    gasVolume: '',
    gasUnit: 'L',
    oilVolume: '',
    oilUnit: 'mL',
    totalMixtureVolume: '',
    totalMixtureUnit: 'L',
    chartSystem: 'metric',
  };
}

/** Spec fixture: 5 L · 50:1 → 100 mL oil */
export function createExampleFiveLiters(): GasOilInput {
  return {
    ...createEmptyInput(),
    gasVolume: '5',
  };
}
