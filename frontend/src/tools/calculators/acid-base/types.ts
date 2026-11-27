export interface AcidBaseInput {
  phText: string;
  pco2Text: string;
  bicarbonateText: string;
  chlorideText: string;
  sodiumText: string;
  albuminText: string;
}

export interface AcidBaseResult {
  anionGap: number | null;
  correctedAnionGap: number | null;
  formattedAnionGap: string;
  formattedCorrected: string;
  abgHeadline: string;
  abgDetail: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AcidBaseFieldErrors = {
  phText?: string;
  pco2Text?: string;
  bicarbonateText?: string;
  chlorideText?: string;
  sodiumText?: string;
  albuminText?: string;
};

/** Screenshot defaults: blank ABG + electrolytes (no clinically seeded values). */
export function createDefaultInput(): AcidBaseInput {
  return {
    phText: '',
    pco2Text: '',
    bicarbonateText: '',
    chlorideText: '',
    sodiumText: '',
    albuminText: '',
  };
}

export function createEmptyInput(): AcidBaseInput {
  return createDefaultInput();
}

export function inputsEqual(a: AcidBaseInput, b: AcidBaseInput): boolean {
  return (
    a.phText === b.phText &&
    a.pco2Text === b.pco2Text &&
    a.bicarbonateText === b.bicarbonateText &&
    a.chlorideText === b.chlorideText &&
    a.sodiumText === b.sodiumText &&
    a.albuminText === b.albuminText
  );
}
