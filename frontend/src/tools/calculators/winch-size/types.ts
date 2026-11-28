/**
 * Winch Size Calculator — estimate pulling force for recovery / load moving.
 * Simplified planning model — not a recovery safety assessment.
 */

export type WeightUnit = 'kg' | 'lb' | 'tonne';
export type ForceUnit = 'lbf' | 'kgf' | 'kN';
export type SlopeUnit = 'degree' | 'percent';
export type CalculationMode = 'vehicle-recovery' | 'load-moving';
export type WeightInputMode = 'manual' | 'vehicle-type';
export type TerrainType =
  | 'hard'
  | 'gravel'
  | 'grass'
  | 'soft-soil'
  | 'sand'
  | 'mud'
  | 'deep-mud'
  | 'custom';
export type VehicleTypeKey =
  | 'small-car'
  | 'sedan'
  | 'compact-suv'
  | 'mid-suv'
  | 'full-suv'
  | 'pickup'
  | 'hd-pickup'
  | 'offroad'
  | 'atv-utv'
  | 'other';
export type LineConfig = 'single' | 'double';
export type WeightBasis = 'entered' | 'loaded' | 'gvwr';

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
  tonne: 't',
};

export const FORCE_UNIT_LABELS: Record<ForceUnit, string> = {
  lbf: 'lb',
  kgf: 'kgf',
  kN: 'kN',
};

export const SLOPE_UNIT_LABELS: Record<SlopeUnit, string> = {
  degree: '°',
  percent: '% grade',
};

export const MODE_LABELS: Record<CalculationMode, string> = {
  'vehicle-recovery': 'Recover a vehicle or overcome a resistant load',
  'load-moving': 'Move a load',
};

export const WEIGHT_MODE_LABELS: Record<WeightInputMode, string> = {
  manual: 'Input weight',
  'vehicle-type': 'Choose vehicle type',
};

/** Illustrative rolling-resistance coefficients (planning assumptions). */
export const TERRAIN_PRESETS: Record<
  Exclude<TerrainType, 'custom'>,
  { label: string; coefficient: number }
> = {
  hard: { label: 'Hard level ground', coefficient: 0.02 },
  gravel: { label: 'Gravel', coefficient: 0.05 },
  grass: { label: 'Grass', coefficient: 0.1 },
  'soft-soil': { label: 'Soft soil', coefficient: 0.2 },
  sand: { label: 'Sand', coefficient: 0.3 },
  mud: { label: 'Mud', coefficient: 0.35 },
  'deep-mud': { label: 'Deep mud', coefficient: 0.5 },
};

/** Illustrative mass presets in kg — editable estimates, not OEM specs. */
export const VEHICLE_PRESETS: Record<
  VehicleTypeKey,
  { label: string; massKg: number }
> = {
  'small-car': { label: 'Small passenger car', massKg: 1100 },
  sedan: { label: 'Sedan', massKg: 1500 },
  'compact-suv': { label: 'Compact SUV', massKg: 1700 },
  'mid-suv': { label: 'Mid-size SUV', massKg: 2000 },
  'full-suv': { label: 'Full-size SUV', massKg: 2600 },
  pickup: { label: 'Pickup truck', massKg: 2300 },
  'hd-pickup': { label: 'Heavy-duty pickup', massKg: 3200 },
  offroad: { label: 'Off-road vehicle / Jeep', massKg: 2000 },
  'atv-utv': { label: 'ATV / UTV', massKg: 450 },
  other: { label: 'Other / custom', massKg: 2000 },
};

export const SAFETY_FACTOR_OPTIONS = [1.25, 1.5, 2, 2.5, 3] as const;

export const WINCH_RATING_TIERS_LBF = [
  2000, 3000, 4500, 6000, 8000, 9500, 10000, 12000, 13500, 15000, 17500, 20000,
] as const;

export interface WinchSizeInput {
  calculationMode: CalculationMode;
  weightInputMode: WeightInputMode;
  vehicleType: VehicleTypeKey;
  weight: string;
  weightUnit: WeightUnit;
  terrainType: TerrainType;
  resistanceCoefficient: string;
  slope: string;
  slopeUnit: SlopeUnit;
  safetyFactor: string;
  resultUnit: ForceUnit;
  showAdvanced: boolean;
  linePullPercent: string;
  lineConfig: LineConfig;
  weightBasis: WeightBasis;
}

export interface WinchSizeResult {
  massKg: number;
  weightForceN: number;
  resistanceForceN: number;
  slopeForceN: number;
  totalPullingForceN: number;
  adjustedPullingForceN: number;
  adjustedInResultUnit: number;
  guidelineWinchRatingLbf: number | null;
  recommendedTierLbf: number | null;
  exceedsListedTiers: boolean;
  resistanceLabel: string;
  slopeDegrees: number;
  safetyFactor: number;
  lineMultiplier: number;
  linePullFactor: number;
  formulaSteps: string[];
  interpretation: string;
  adjustedDisplay: string;
  guidelineDisplay: string | null;
  tierDisplay: string | null;
}

export type WinchSizeFieldErrors = {
  weight?: string;
  resistanceCoefficient?: string;
  slope?: string;
  safetyFactor?: string;
  linePullPercent?: string;
  form?: string;
};

export function createEmptyInput(): WinchSizeInput {
  return {
    calculationMode: 'vehicle-recovery',
    weightInputMode: 'manual',
    vehicleType: 'offroad',
    weight: '2000',
    weightUnit: 'kg',
    terrainType: 'mud',
    resistanceCoefficient: '0.35',
    slope: '10',
    slopeUnit: 'degree',
    safetyFactor: '1.5',
    resultUnit: 'lbf',
    showAdvanced: false,
    linePullPercent: '100',
    lineConfig: 'single',
    weightBasis: 'entered',
  };
}

export function createBlankInput(): WinchSizeInput {
  return {
    ...createEmptyInput(),
    weight: '',
    resistanceCoefficient: '',
    slope: '',
    safetyFactor: '',
    linePullPercent: '',
  };
}
