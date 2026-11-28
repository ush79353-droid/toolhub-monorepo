/**
 * Pulse per Mile Calculator — WRM and VSS PPM from axle ratio, reluctor teeth, tire diameter.
 */

export type TireDiameterUnit = 'in' | 'cm' | 'mm' | 'ft';

export type SpeedUnit = 'mph' | 'km/h';

export const TIRE_DIAMETER_UNIT_LABELS: Record<TireDiameterUnit, string> = {
  in: 'in',
  cm: 'cm',
  mm: 'mm',
  ft: 'ft',
};

export const SPEED_UNIT_LABELS: Record<SpeedUnit, string> = {
  mph: 'mph',
  'km/h': 'km/h',
};

export interface PulsePerMileInput {
  axleRatio: string;
  reluctorTeeth: string;
  tireDiameter: string;
  tireDiameterUnit: TireDiameterUnit;
  /** Optional: circumference / rev-only panel uses same diameter */
  showCircumference: boolean;
  showSensorFrequency: boolean;
  vehicleSpeed: string;
  vehicleSpeedUnit: SpeedUnit;
}

export interface PulsePerMileResult {
  wheelRotationsPerMile: number;
  pulsesPerMile: number;
  tireDiameterInches: number;
  circumferenceIn: number;
  circumferenceCm: number;
  circumferenceMm: number;
  wrmDisplay: string;
  ppmDisplay: string;
  circumferenceInDisplay: string;
  circumferenceCmDisplay: string;
  circumferenceMmDisplay: string;
  pulsesPerSecondHz: number | null;
  pulsesPerMinute: number | null;
  frequencyDisplay: string | null;
  formulaSteps: string[];
  interpretation: string;
}

export type PulsePerMileFieldErrors = {
  axleRatio?: string;
  reluctorTeeth?: string;
  tireDiameter?: string;
  vehicleSpeed?: string;
  form?: string;
};

/** Spec fixture: AR 3.42 · 20 teeth · 26 in → ~775.7 rev/mi · ~53,058 PPM */
export function createEmptyInput(): PulsePerMileInput {
  return {
    axleRatio: '3.42',
    reluctorTeeth: '20',
    tireDiameter: '26',
    tireDiameterUnit: 'in',
    showCircumference: false,
    showSensorFrequency: false,
    vehicleSpeed: '60',
    vehicleSpeedUnit: 'mph',
  };
}
