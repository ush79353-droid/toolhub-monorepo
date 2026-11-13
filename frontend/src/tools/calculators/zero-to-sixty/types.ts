export type PowerUnit = 'hp' | 'kW';
export type WeightUnit = 'lb' | 'kg';
export type Drivetrain = 'fwd' | 'rwd' | 'awd';
export type Transmission = 'manual' | 'automatic' | 'dct' | 'cvt';
export type TireCategory = 'standard' | 'performance' | 'track';
export type RoadSurface = 'dry' | 'wet';
export type LaunchQuality = 'conservative' | 'normal' | 'aggressive';

export interface ZeroToSixtyInput {
  // A. Engine and Vehicle
  enginePower: number;
  powerUnit: PowerUnit;
  vehicleWeight: number;
  weightUnit: WeightUnit;
  drivetrain: Drivetrain;
  transmission: Transmission;

  // B. Performance Conditions
  tireCategory: TireCategory;
  roadSurface: RoadSurface;
  roadGradientPercent: number; // positive = uphill, negative = downhill
  launchQuality: LaunchQuality;

  // C. Advanced Settings
  drivetrainEfficiencyPercent: number;
  shiftDelaySeconds: number;
  driverCargoWeight: number; // in current weightUnit
  dragCoefficient: number; // Cd
  frontalAreaSqM: number; // A (m²)
  rollingResistanceCoeff: number; // Crr
}

export type ZeroToSixtyFieldKey = keyof ZeroToSixtyInput | 'form';
export type ZeroToSixtyFieldErrors = Partial<Record<ZeroToSixtyFieldKey, string>>;

export interface ZeroToSixtyValidationResult {
  isValid: boolean;
  errors: ZeroToSixtyFieldErrors;
}

export interface SimulationPoint {
  timeSeconds: number;
  speedMph: number;
  speedKmh: number;
  distanceFeet: number;
  distanceMeters: number;
  accelerationG: number;
}

export interface ZeroToSixtyAssumptions {
  airDensityKgPerM3: number;
  rotationalInertiaFactor: number;
  tireFrictionCoeff: number;
  drivenAxleWeightFraction: number;
  effectiveWheelHp: number;
  powerUtilizationFactor: number;
  effectiveTotalMassKg: number;
  totalMassLb: number;
  gradientAngleDegrees: number;
}

export interface ZeroToSixtyResultSuccess {
  reachable: true;
  timeTo60Mph: number; // seconds
  timeTo100Kmh: number; // seconds
  distanceTo60MphFeet: number;
  distanceTo60MphMeters: number;
  distanceTo100KmhFeet: number;
  distanceTo100KmhMeters: number;
  powerToWeightHpPerTon: number; // hp per US ton (2000 lb)
  powerToWeightHpPerMetricTonne: number; // hp per 1000 kg
  powerToWeightLbPerHp: number;
  powerToWeightKgPerKw: number;
  wheelHorsepower: number;
  averageAcceleration60MphG: number;
  averageAcceleration60MphMps2: number;
  peakAccelerationG: number;
  simulationPoints: SimulationPoint[];
  assumptions: ZeroToSixtyAssumptions;
}

export interface ZeroToSixtyResultFailure {
  reachable: false;
  reason: string;
  assumptions?: Partial<ZeroToSixtyAssumptions>;
}

export type ZeroToSixtyResult = ZeroToSixtyResultSuccess | ZeroToSixtyResultFailure;

export const DEFAULT_DRIVETRAIN_EFFICIENCIES: Record<Drivetrain, number> = {
  fwd: 88,
  rwd: 85,
  awd: 82,
};

export const DEFAULT_SHIFT_DELAYS: Record<Transmission, number> = {
  manual: 0.35,
  automatic: 0.15,
  dct: 0.08,
  cvt: 0.0,
};

export const DEFAULT_ZERO_TO_SIXTY_INPUT: ZeroToSixtyInput = {
  enginePower: 300,
  powerUnit: 'hp',
  vehicleWeight: 3500,
  weightUnit: 'lb',
  drivetrain: 'rwd',
  transmission: 'automatic',
  tireCategory: 'standard',
  roadSurface: 'dry',
  roadGradientPercent: 0,
  launchQuality: 'normal',
  drivetrainEfficiencyPercent: 85,
  shiftDelaySeconds: 0.15,
  driverCargoWeight: 0,
  dragCoefficient: 0.31,
  frontalAreaSqM: 2.2,
  rollingResistanceCoeff: 0.012,
};

