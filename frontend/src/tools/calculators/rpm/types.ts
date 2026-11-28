/**
 * RPM Calculator — engine RPM, drivetrain ratio, wheel RPM, tire diameter, vehicle speed.
 */

export type TireDiameterUnit = 'in' | 'cm' | 'mm' | 'ft' | 'm';

export type VehicleSpeedUnit = 'km/h' | 'mph' | 'm/s' | 'ft/s';

export const TIRE_DIAMETER_UNIT_LABELS: Record<TireDiameterUnit, string> = {
  in: 'in',
  cm: 'cm',
  mm: 'mm',
  ft: 'ft',
  m: 'm',
};

export const SPEED_UNIT_LABELS: Record<VehicleSpeedUnit, string> = {
  'km/h': 'km/h',
  mph: 'mph',
  'm/s': 'm/s',
  'ft/s': 'ft/s',
};

export type RpmFieldKey =
  | 'engineRPM'
  | 'drivetrainRatio'
  | 'wheelRPM'
  | 'tireDiameter'
  | 'vehicleSpeed';

export interface RpmInput {
  engineRPM: string;
  drivetrainRatio: string;
  wheelRPM: string;
  tireDiameter: string;
  tireDiameterUnit: TireDiameterUnit;
  vehicleSpeed: string;
  vehicleSpeedUnit: VehicleSpeedUnit;
  /** Optional: R = G × F */
  showGearSplit: boolean;
  gearboxRatio: string;
  finalDriveRatio: string;
  showExtras: boolean;
}

export interface RpmResult {
  engineRPM: number | null;
  drivetrainRatio: number | null;
  wheelRPM: number | null;
  tireDiameterMeters: number | null;
  tireDiameterDisplay: number | null;
  vehicleSpeedMps: number | null;
  vehicleSpeedDisplay: number | null;
  engineRPMDisplay: string | null;
  drivetrainRatioDisplay: string | null;
  wheelRPMDisplay: string | null;
  tireDiameterFormatted: string | null;
  vehicleSpeedFormatted: string | null;
  circumferenceIn: number | null;
  circumferenceM: number | null;
  wheelRotationsPerMile: number | null;
  engineRps: number | null;
  derived: Partial<Record<RpmFieldKey, boolean>>;
  formulaSteps: string[];
  interpretation: string;
  insufficient: boolean;
  inconsistent: boolean;
}

export type RpmFieldErrors = {
  engineRPM?: string;
  drivetrainRatio?: string;
  wheelRPM?: string;
  tireDiameter?: string;
  vehicleSpeed?: string;
  gearboxRatio?: string;
  finalDriveRatio?: string;
  form?: string;
};

/** Spec fixture: 3000 rpm · R=4 · 26 in → 750 WRPM · ~58.01 mph / ~93.36 km/h */
export function createEmptyInput(): RpmInput {
  return {
    engineRPM: '3000',
    drivetrainRatio: '4',
    wheelRPM: '',
    tireDiameter: '26',
    tireDiameterUnit: 'in',
    vehicleSpeed: '',
    vehicleSpeedUnit: 'km/h',
    showGearSplit: false,
    gearboxRatio: '1',
    finalDriveRatio: '4',
    showExtras: false,
  };
}

export function createBlankInput(): RpmInput {
  return {
    ...createEmptyInput(),
    engineRPM: '',
    drivetrainRatio: '',
    wheelRPM: '',
    tireDiameter: '',
    vehicleSpeed: '',
    showGearSplit: false,
    showExtras: false,
  };
}
