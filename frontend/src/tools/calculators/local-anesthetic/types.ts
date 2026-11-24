import {
  type LocalAnestheticDrug,
  limitFor,
} from './labeling-data';

export type { LocalAnestheticDrug };
export type WeightUnit = 'kg' | 'lb';

export interface LocalAnestheticInput {
  drug: LocalAnestheticDrug;
  weightText: string;
  weightUnit: WeightUnit;
  concentrationPercentText: string;
}

export interface LocalAnestheticResult {
  maxDoseMg: number | null;
  maxDoseMl: number | null;
  formattedMaxDoseMg: string;
  formattedMaxDoseMl: string;
  warningNote: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LocalAnestheticFieldErrors = {
  weightText?: string;
  concentrationPercentText?: string;
};

export function createDefaultInput(): LocalAnestheticInput {
  const bup = limitFor('bupivacaine');
  return {
    drug: 'bupivacaine',
    weightText: '',
    weightUnit: 'kg',
    concentrationPercentText: String(bup.defaultConcentrationPercent),
  };
}

export function createEmptyInput(): LocalAnestheticInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: LocalAnestheticInput,
  b: LocalAnestheticInput,
): boolean {
  return (
    a.drug === b.drug &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.concentrationPercentText === b.concentrationPercentText
  );
}
