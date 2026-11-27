/** Weight mass unit for body weight and dose-per-mass. */
export type WeightUnit = 'kg' | 'lb';

/** Desired dose mass unit before /weight/time. */
export type DoseMassUnit = 'mg' | 'mcg';

/** Desired dose time unit (per minute or per hour). */
export type DoseTimeUnit = 'min' | 'h';

/** Concentration mass/volume unit. */
export type ConcentrationUnit = 'mg/L' | 'mg/mL' | 'mcg/mL';

/** Bag volume unit. */
export type VolumeUnit = 'mL' | 'L';

/** Drug-in-bag mass unit. */
export type DrugMassUnit = 'mg' | 'mcg' | 'g';

/** Drip rate volume unit (always per hour in UI). */
export type DripVolumeUnit = 'mL' | 'L';

/** Drop-factor denominator volume (gtts per …). */
export type DropFactorVolumeUnit = 'mL' | 'L';

/** Flow rate time denominator (gtts per …). */
export type FlowTimeUnit = 'min' | 'h';

/** Time-to-end-bag unit. */
export type DurationUnit = 'hrs' | 'min';

/**
 * Which input the user last edited — drives Omni-style bidirectional fill
 * without fighting the user's current field.
 */
export type DripRateSource =
  | 'dose'
  | 'weight'
  | 'concentration'
  | 'bagVolume'
  | 'drugInBag'
  | 'dripRate'
  | 'dropFactor'
  | 'flowRate'
  | 'bagDuration';

export interface DripRateInput {
  doseText: string;
  doseMassUnit: DoseMassUnit;
  doseWeightUnit: WeightUnit;
  doseTimeUnit: DoseTimeUnit;
  weightText: string;
  weightUnit: WeightUnit;
  concentrationText: string;
  concentrationUnit: ConcentrationUnit;
  bagVolumeText: string;
  bagVolumeUnit: VolumeUnit;
  drugInBagText: string;
  drugMassUnit: DrugMassUnit;
  dripRateText: string;
  dripVolumeUnit: DripVolumeUnit;
  dropFactorText: string;
  dropFactorVolumeUnit: DropFactorVolumeUnit;
  flowRateText: string;
  flowTimeUnit: FlowTimeUnit;
  bagDurationText: string;
  durationUnit: DurationUnit;
  /** Last authoritative field for write-back precedence. */
  source: DripRateSource;
}

export interface DripRateResult {
  /** Canonical values used for math (SI teaching units). */
  doseMgPerKgPerMin: number | null;
  weightKg: number | null;
  concentrationMgPerL: number | null;
  bagVolumeMl: number | null;
  drugInBagMg: number | null;
  dripRateMlPerH: number | null;
  dropFactorGttsPerMl: number | null;
  flowRateGttsPerMin: number | null;
  bagDurationH: number | null;
  /** Display strings for muted/derived fields (empty when unscored). */
  formattedConcentration: string;
  formattedDrugInBag: string;
  formattedBagVolume: string;
  formattedDripRate: string;
  formattedFlowRate: string;
  formattedBagDuration: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DripRateFieldErrors = {
  doseText?: string;
  weightText?: string;
  concentrationText?: string;
  bagVolumeText?: string;
  drugInBagText?: string;
  dripRateText?: string;
  dropFactorText?: string;
  flowRateText?: string;
  bagDurationText?: string;
};

export function createDefaultInput(): DripRateInput {
  return {
    doseText: '',
    doseMassUnit: 'mg',
    doseWeightUnit: 'kg',
    doseTimeUnit: 'min',
    weightText: '',
    weightUnit: 'kg',
    concentrationText: '',
    concentrationUnit: 'mg/L',
    bagVolumeText: '',
    bagVolumeUnit: 'mL',
    drugInBagText: '',
    drugMassUnit: 'mg',
    dripRateText: '',
    dripVolumeUnit: 'mL',
    dropFactorText: '',
    dropFactorVolumeUnit: 'mL',
    flowRateText: '',
    flowTimeUnit: 'min',
    bagDurationText: '',
    durationUnit: 'hrs',
    source: 'dose',
  };
}

export function createEmptyInput(): DripRateInput {
  return createDefaultInput();
}

export function inputsEqual(a: DripRateInput, b: DripRateInput): boolean {
  return (
    a.doseText === b.doseText &&
    a.doseMassUnit === b.doseMassUnit &&
    a.doseWeightUnit === b.doseWeightUnit &&
    a.doseTimeUnit === b.doseTimeUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.concentrationText === b.concentrationText &&
    a.concentrationUnit === b.concentrationUnit &&
    a.bagVolumeText === b.bagVolumeText &&
    a.bagVolumeUnit === b.bagVolumeUnit &&
    a.drugInBagText === b.drugInBagText &&
    a.drugMassUnit === b.drugMassUnit &&
    a.dripRateText === b.dripRateText &&
    a.dripVolumeUnit === b.dripVolumeUnit &&
    a.dropFactorText === b.dropFactorText &&
    a.dropFactorVolumeUnit === b.dropFactorVolumeUnit &&
    a.flowRateText === b.flowRateText &&
    a.flowTimeUnit === b.flowTimeUnit &&
    a.bagDurationText === b.bagDurationText &&
    a.durationUnit === b.durationUnit
  );
}
