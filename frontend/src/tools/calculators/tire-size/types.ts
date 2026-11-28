/**
 * Tire Size Calculator — decode markings, dimensions, optional comparison.
 * Theoretical unloaded geometry (not rolling radius under load).
 */

export type LengthUnit = 'mm' | 'in';
export type TireConstruction = 'R' | 'B' | 'D';
export type SpeedUnit = 'mph' | 'kmh';

export const CONSTRUCTION_LABELS: Record<TireConstruction, string> = {
  R: 'Radial (R)',
  B: 'Bias belt (B)',
  D: 'Diagonal (D)',
};

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  in: 'inches',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  mph: 'mph',
  kmh: 'km/h',
};

/** Common speed-rating letters for display only — not a speed-limit claim. */
export const SPEED_RATINGS = [
  '',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'H',
  'V',
  'W',
  'Y',
  'ZR',
] as const;

export type SpeedRatingCode = (typeof SPEED_RATINGS)[number];

export interface TireFields {
  width: string;
  widthUnit: LengthUnit;
  aspectRatio: string;
  construction: TireConstruction;
  rimDiameter: string;
  rimUnit: LengthUnit;
  loadIndex: string;
  speedRating: SpeedRatingCode;
}

export interface TireSizeInput {
  primary: TireFields;
  showAdditional: boolean;
  compare: boolean;
  replacement: TireFields;
  indicatedSpeed: string;
  indicatedSpeedUnit: SpeedUnit;
}

export interface TireDimensions {
  tireCode: string;
  widthMm: number;
  aspectRatio: number;
  construction: TireConstruction;
  sidewallHeightMm: number;
  rimDiameterMm: number;
  rimDiameterIn: number;
  overallDiameterMm: number;
  overallDiameterIn: number;
  circumferenceMm: number;
  circumferenceIn: number;
  revolutionsPerKm: number;
  revolutionsPerMile: number;
  loadIndex: number | null;
  speedRating: string | null;
}

export type DiameterBand = 'small' | 'moderate' | 'significant';

export interface TireComparison {
  original: TireDimensions;
  replacement: TireDimensions;
  diameterDifferenceMm: number;
  diameterDifferencePercent: number;
  sidewallDifferenceMm: number;
  circumferenceDifferenceMm: number;
  widthDifferenceMm: number;
  groundClearanceDifferenceMm: number;
  indicatedSpeed: number;
  indicatedSpeedUnit: SpeedUnit;
  estimatedActualSpeed: number;
  speedDifference: number;
  speedErrorPercent: number;
  diameterBand: DiameterBand;
}

export interface TireSizeResult {
  primary: TireDimensions;
  comparison: TireComparison | null;
  formulaSteps: string[];
  interpretation: string;
}

export type TireSizeFieldErrors = {
  width?: string;
  aspectRatio?: string;
  rimDiameter?: string;
  loadIndex?: string;
  repWidth?: string;
  repAspectRatio?: string;
  repRimDiameter?: string;
  indicatedSpeed?: string;
  tireCode?: string;
  form?: string;
};

function blankTire(overrides?: Partial<TireFields>): TireFields {
  return {
    width: '',
    widthUnit: 'mm',
    aspectRatio: '',
    construction: 'R',
    rimDiameter: '',
    rimUnit: 'in',
    loadIndex: '',
    speedRating: '',
    ...overrides,
  };
}

/** Spec fixture: 225/65 R17 */
export function createEmptyInput(): TireSizeInput {
  return {
    primary: {
      width: '225',
      widthUnit: 'mm',
      aspectRatio: '65',
      construction: 'R',
      rimDiameter: '17',
      rimUnit: 'in',
      loadIndex: '',
      speedRating: '',
    },
    showAdditional: false,
    compare: false,
    replacement: {
      width: '235',
      widthUnit: 'mm',
      aspectRatio: '60',
      construction: 'R',
      rimDiameter: '18',
      rimUnit: 'in',
      loadIndex: '',
      speedRating: '',
    },
    indicatedSpeed: '60',
    indicatedSpeedUnit: 'mph',
  };
}

export function createBlankInput(): TireSizeInput {
  return {
    primary: blankTire(),
    showAdditional: false,
    compare: false,
    replacement: blankTire({ construction: 'R', widthUnit: 'mm', rimUnit: 'in' }),
    indicatedSpeed: '',
    indicatedSpeedUnit: 'mph',
  };
}
