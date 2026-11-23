/**
 * Cardiac Index Calculator — screenshot UI + typed hemodynamics engine.
 *
 * Yes mode (screenshot): known CO L/min + height + weight → CI L/min/m².
 * No mode: Fick principle inputs matching the sibling Cardiac Output tool
 * (local engine until that module can be shared).
 */

export type KnowsCardiacOutput = 'yes' | 'no';

export type HeightUnit = 'cm' | 'in';

export type WeightUnit = 'kg' | 'lb';

export type TensionUnit = 'Torr' | 'kPa';

export type ConcentrationUnit = 'mL/L' | 'mL/dL';

export interface CardiacIndexInput {
  knowsCardiacOutput: KnowsCardiacOutput;
  /** Yes mode — cardiac output text (L/min). */
  cardiacOutputText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  /** No / Fick — hemoglobin g/dL. */
  hemoglobinText: string;
  /** Optional override; blank → estimated VO₂ from BSA. */
  oxygenConsumptionText: string;
  arterialSaturationText: string;
  arterialTensionText: string;
  arterialTensionUnit: TensionUnit;
  venousSaturationText: string;
  venousTensionText: string;
  venousTensionUnit: TensionUnit;
  arterialOpen: boolean;
  venousOpen: boolean;
}

export interface CardiacIndexResult {
  cardiacIndexLPerMinPerM2: number | null;
  cardiacOutputLPerMin: number | null;
  bsaM2: number | null;
  /** Estimated or entered VO₂ (mL/min) in Fick mode. */
  vo2MlPerMin: number | null;
  arterialContentMlPerL: number | null;
  venousContentMlPerL: number | null;
  mode: KnowsCardiacOutput;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CardiacIndexFieldErrors = {
  form?: string;
  cardiacOutputText?: string;
  heightText?: string;
  weightText?: string;
  hemoglobinText?: string;
  oxygenConsumptionText?: string;
  arterialSaturationText?: string;
  arterialTensionText?: string;
  venousSaturationText?: string;
  venousTensionText?: string;
};

/** Screenshot reload defaults: Yes selected, blank numeric fields, cm/kg. */
export function createDefaultInput(): CardiacIndexInput {
  return {
    knowsCardiacOutput: 'yes',
    cardiacOutputText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    hemoglobinText: '',
    oxygenConsumptionText: '',
    arterialSaturationText: '',
    arterialTensionText: '',
    arterialTensionUnit: 'Torr',
    venousSaturationText: '',
    venousTensionText: '',
    venousTensionUnit: 'Torr',
    arterialOpen: true,
    venousOpen: true,
  };
}

export function createEmptyInput(): CardiacIndexInput {
  return createDefaultInput();
}

export function inputsEqual(a: CardiacIndexInput, b: CardiacIndexInput): boolean {
  return (
    a.knowsCardiacOutput === b.knowsCardiacOutput &&
    a.cardiacOutputText === b.cardiacOutputText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.hemoglobinText === b.hemoglobinText &&
    a.oxygenConsumptionText === b.oxygenConsumptionText &&
    a.arterialSaturationText === b.arterialSaturationText &&
    a.arterialTensionText === b.arterialTensionText &&
    a.arterialTensionUnit === b.arterialTensionUnit &&
    a.venousSaturationText === b.venousSaturationText &&
    a.venousTensionText === b.venousTensionText &&
    a.venousTensionUnit === b.venousTensionUnit &&
    a.arterialOpen === b.arterialOpen &&
    a.venousOpen === b.venousOpen
  );
}
