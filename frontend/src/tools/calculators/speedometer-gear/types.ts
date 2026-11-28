/**
 * Speedometer Gear Calculator — driven gear teeth from tire Ø, axle ratio, driving teeth.
 * Uses R ≈ 20168/D_in and Td = A×R×Tg/C (default C=1000 cable rev/mi).
 */

export type TireDiameterUnit = 'mm' | 'cm' | 'in' | 'ft' | 'm';

export type TireRevolutionUnit = 'rev/mi' | 'rev/km';

export const TIRE_DIAMETER_UNIT_LABELS: Record<TireDiameterUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  in: 'in',
  ft: 'ft',
  m: 'm',
};

export const TIRE_REVOLUTION_UNIT_LABELS: Record<TireRevolutionUnit, string> = {
  'rev/mi': 'rev/mi',
  'rev/km': 'rev/km',
};

export interface SpeedometerGearInput {
  tireDiameter: string;
  tireDiameterUnit: TireDiameterUnit;
  axleRatio: string;
  tireRevolutions: string;
  tireRevolutionUnit: TireRevolutionUnit;
  drivingGearTeeth: string;
  calibrationRevolutionsPerMile: string;
  useManualRevolutions: boolean;
  showAdvanced: boolean;
}

export interface SpeedometerGearResult {
  tireRevolutionsPerMile: number;
  tireRevolutionsDisplay: number;
  speedometerGearRatio: number;
  theoreticalDrivenGearTeeth: number;
  recommendedDrivenGearTeeth: number;
  gearToothDeviationPercent: number;
  tireRevolutionsPerMileDisplay: string;
  gearRatioDisplay: string;
  theoreticalTeethDisplay: string;
  recommendedTeethDisplay: string;
  deviationDisplay: string;
  formulaSteps: string[];
  interpretation: string;
}

export type SpeedometerGearFieldErrors = {
  tireDiameter?: string;
  axleRatio?: string;
  tireRevolutions?: string;
  drivingGearTeeth?: string;
  calibrationRevolutionsPerMile?: string;
  form?: string;
};

/** Spec fixture: 30 in · 3.73 · 8 teeth → ~20.06 → 20 recommended */
export function createEmptyInput(): SpeedometerGearInput {
  return {
    tireDiameter: '30',
    tireDiameterUnit: 'in',
    axleRatio: '3.73',
    tireRevolutions: '',
    tireRevolutionUnit: 'rev/mi',
    drivingGearTeeth: '8',
    calibrationRevolutionsPerMile: '1000',
    useManualRevolutions: false,
    showAdvanced: false,
  };
}

export function createBlankInput(): SpeedometerGearInput {
  return {
    ...createEmptyInput(),
    tireDiameter: '',
    axleRatio: '',
    tireRevolutions: '',
    drivingGearTeeth: '',
    useManualRevolutions: false,
    showAdvanced: false,
  };
}
