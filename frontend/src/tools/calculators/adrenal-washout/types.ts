/**
 * Adrenal Washout Calculator — CT HU washout for adenoma assessment (educational).
 */

export interface AdrenalWashoutInput {
  preContrastHuText: string;
  enhancedHuText: string;
  delayedHuText: string;
}

export interface AdrenalWashoutResult {
  absoluteWashoutPercent: number | null;
  relativeWashoutPercent: number | null;
  formattedAbsolute: string;
  formattedRelative: string;
  absoluteSuggestsAdenoma: boolean | null;
  relativeSuggestsAdenoma: boolean | null;
  absoluteInterpretation: string;
  relativeInterpretation: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AdrenalWashoutFieldErrors = {
  preContrastHuText?: string;
  enhancedHuText?: string;
  delayedHuText?: string;
};

export function createDefaultInput(): AdrenalWashoutInput {
  return {
    preContrastHuText: '',
    enhancedHuText: '',
    delayedHuText: '',
  };
}

export function createEmptyInput(): AdrenalWashoutInput {
  return createDefaultInput();
}

export function inputsEqual(a: AdrenalWashoutInput, b: AdrenalWashoutInput): boolean {
  return (
    a.preContrastHuText === b.preContrastHuText &&
    a.enhancedHuText === b.enhancedHuText &&
    a.delayedHuText === b.delayedHuText
  );
}
