/** Orthogonal sac diameter display unit (canonical math uses mm). */
export type SacDimUnit = 'mm' | 'cm' | 'in';

/** How gestational age is shown when dating is in range. */
export type GaDisplayUnit = 'days' | 'weeksDays';

export interface MeanSacDiameterInput {
  lengthValue: string;
  lengthUnit: SacDimUnit;
  widthValue: string;
  widthUnit: SacDimUnit;
  heightValue: string;
  heightUnit: SacDimUnit;
  msdDisplayUnit: SacDimUnit;
  gaDisplayUnit: GaDisplayUnit;
  /** Screenshot: expanded gestational sac dimensions panel. */
  dimensionsExpanded: boolean;
}

export interface MeanSacDiameterResult {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  msdMm: number;
  msdDisplay: number;
  /** Approximate menstrual GA days when MSD is in the educational dating window. */
  gestationalAgeDays: number | null;
  weeks: number | null;
  daysRemainder: number | null;
  ageInRange: boolean;
  formattedMsd: string;
  formattedGestationalAge: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type MeanSacDiameterFieldErrors = {
  form?: string;
  lengthValue?: string;
  widthValue?: string;
  heightValue?: string;
};

export const SAC_DIM_UNIT_LABELS: Record<SacDimUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
};

export const GA_DISPLAY_LABELS: Record<GaDisplayUnit, string> = {
  days: 'days',
  weeksDays: 'wks + days',
};

export function createDefaultInput(): MeanSacDiameterInput {
  return {
    lengthValue: '',
    lengthUnit: 'mm',
    widthValue: '',
    widthUnit: 'mm',
    heightValue: '',
    heightUnit: 'mm',
    msdDisplayUnit: 'mm',
    gaDisplayUnit: 'days',
    dimensionsExpanded: true,
  };
}

export function createEmptyInput(): MeanSacDiameterInput {
  return createDefaultInput();
}

/** Fixture: 12, 15, 18 mm → MSD 15 mm → approx GA 45 days. */
export function createExampleInput(): MeanSacDiameterInput {
  return {
    ...createDefaultInput(),
    lengthValue: '12',
    widthValue: '15',
    heightValue: '18',
  };
}

export function inputsEqual(
  a: MeanSacDiameterInput,
  b: MeanSacDiameterInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
