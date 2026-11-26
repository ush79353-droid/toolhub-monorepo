export interface AnionGapInput {
  sodiumText: string;
  chlorideText: string;
  bicarbonateText: string;
  /** Correction panel; screenshot default 0. */
  potassiumText: string;
  albuminText: string;
}

export interface AnionGapResult {
  anionGap: number | null;
  anionGapWithK: number | null;
  correctedAnionGap: number | null;
  formattedAnionGap: string;
  formattedCorrected: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AnionGapFieldErrors = {
  sodiumText?: string;
  chlorideText?: string;
  bicarbonateText?: string;
  potassiumText?: string;
  albuminText?: string;
};

/** Screenshot defaults: blank electrolytes; K defaults to 0; blank albumin. */
export function createDefaultInput(): AnionGapInput {
  return {
    sodiumText: '',
    chlorideText: '',
    bicarbonateText: '',
    potassiumText: '0',
    albuminText: '',
  };
}

export function createEmptyInput(): AnionGapInput {
  return {
    sodiumText: '',
    chlorideText: '',
    bicarbonateText: '',
    potassiumText: '0',
    albuminText: '',
  };
}

export function inputsEqual(a: AnionGapInput, b: AnionGapInput): boolean {
  return (
    a.sodiumText === b.sodiumText &&
    a.chlorideText === b.chlorideText &&
    a.bicarbonateText === b.bicarbonateText &&
    a.potassiumText === b.potassiumText &&
    a.albuminText === b.albuminText
  );
}
