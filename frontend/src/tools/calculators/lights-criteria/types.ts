/** Light's criteria for pleural fluid — screenshot-first (ADR-023). */

export type ProteinUnit = 'g_dl' | 'g_l';

export interface LightsCriteriaInput {
  pleuralProteinText: string;
  serumProteinText: string;
  proteinUnit: ProteinUnit;
  pleuralLdhText: string;
  serumLdhText: string;
  ldhUpperLimitText: string;
}

export type LightsClassification =
  | 'exudate'
  | 'transudate'
  | 'incomplete'
  | 'invalid';

export interface LightsCriteriaResult {
  proteinRatio: number | null;
  ldhRatio: number | null;
  twoThirdsUpperLimit: number | null;
  proteinCriterionMet: boolean | null;
  ldhRatioCriterionMet: boolean | null;
  ldhAbsoluteCriterionMet: boolean | null;
  classification: LightsClassification;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LightsCriteriaFieldErrors = {
  pleuralProteinText?: string;
  serumProteinText?: string;
  pleuralLdhText?: string;
  serumLdhText?: string;
  ldhUpperLimitText?: string;
  form?: string;
};

export function createDefaultInput(): LightsCriteriaInput {
  return {
    pleuralProteinText: '',
    serumProteinText: '',
    proteinUnit: 'g_dl',
    pleuralLdhText: '',
    serumLdhText: '',
    ldhUpperLimitText: '',
  };
}

export function createEmptyInput(): LightsCriteriaInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: LightsCriteriaInput,
  b: LightsCriteriaInput,
): boolean {
  return (
    a.pleuralProteinText === b.pleuralProteinText &&
    a.serumProteinText === b.serumProteinText &&
    a.proteinUnit === b.proteinUnit &&
    a.pleuralLdhText === b.pleuralLdhText &&
    a.serumLdhText === b.serumLdhText &&
    a.ldhUpperLimitText === b.ldhUpperLimitText
  );
}
