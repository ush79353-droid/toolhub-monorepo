import type {
  Drivetrain,
  LaunchQuality,
  PowerUnit,
  RoadSurface,
  TireCategory,
  Transmission,
  WeightUnit,
  ZeroToSixtyFieldErrors,
  ZeroToSixtyInput,
  ZeroToSixtyValidationResult,
} from './types';

const VALID_POWER_UNITS: readonly PowerUnit[] = ['hp', 'kW'];
const VALID_WEIGHT_UNITS: readonly WeightUnit[] = ['lb', 'kg'];
const VALID_DRIVETRAINS: readonly Drivetrain[] = ['fwd', 'rwd', 'awd'];
const VALID_TRANSMISSIONS: readonly Transmission[] = ['manual', 'automatic', 'dct', 'cvt'];
const VALID_TIRES: readonly TireCategory[] = ['standard', 'performance', 'track'];
const VALID_SURFACES: readonly RoadSurface[] = ['dry', 'wet'];
const VALID_LAUNCHES: readonly LaunchQuality[] = ['conservative', 'normal', 'aggressive'];

export function validateZeroToSixtyInput(input: ZeroToSixtyInput): ZeroToSixtyValidationResult {
  const errors: ZeroToSixtyFieldErrors = {};

  if (!Number.isFinite(input.enginePower) || input.enginePower <= 0) {
    errors.enginePower = 'Engine power must be a positive number greater than 0.';
  } else if (input.enginePower > 5000) {
    errors.enginePower = 'Engine power cannot exceed 5,000.';
  }

  if (!VALID_POWER_UNITS.includes(input.powerUnit)) {
    errors.powerUnit = 'Invalid power unit selected.';
  }

  if (!Number.isFinite(input.vehicleWeight) || input.vehicleWeight <= 0) {
    errors.vehicleWeight = 'Vehicle weight must be greater than 0.';
  } else if (input.vehicleWeight > 100000) {
    errors.vehicleWeight = 'Vehicle weight cannot exceed 100,000.';
  }

  if (!VALID_WEIGHT_UNITS.includes(input.weightUnit)) {
    errors.weightUnit = 'Invalid weight unit selected.';
  }

  if (!VALID_DRIVETRAINS.includes(input.drivetrain)) {
    errors.drivetrain = 'Please select a valid drivetrain option.';
  }

  if (!VALID_TRANSMISSIONS.includes(input.transmission)) {
    errors.transmission = 'Please select a valid transmission type.';
  }

  if (!VALID_TIRES.includes(input.tireCategory)) {
    errors.tireCategory = 'Please select a valid tire category.';
  }

  if (!VALID_SURFACES.includes(input.roadSurface)) {
    errors.roadSurface = 'Please select a valid road surface.';
  }

  if (!VALID_LAUNCHES.includes(input.launchQuality)) {
    errors.launchQuality = 'Please select a valid launch quality.';
  }

  if (!Number.isFinite(input.roadGradientPercent)) {
    errors.roadGradientPercent = 'Road gradient must be a valid number.';
  } else if (input.roadGradientPercent < -30 || input.roadGradientPercent > 30) {
    errors.roadGradientPercent = 'Road gradient must be between -30% (downhill) and +30% (uphill).';
  }

  if (
    !Number.isFinite(input.drivetrainEfficiencyPercent) ||
    input.drivetrainEfficiencyPercent < 50 ||
    input.drivetrainEfficiencyPercent > 100
  ) {
    errors.drivetrainEfficiencyPercent = 'Drivetrain efficiency must be between 50% and 100%.';
  }

  if (
    !Number.isFinite(input.shiftDelaySeconds) ||
    input.shiftDelaySeconds < 0 ||
    input.shiftDelaySeconds > 2.0
  ) {
    errors.shiftDelaySeconds = 'Shift delay must be between 0 and 2.0 seconds.';
  }

  if (!Number.isFinite(input.driverCargoWeight) || input.driverCargoWeight < 0) {
    errors.driverCargoWeight = 'Extra driver/cargo weight cannot be negative.';
  }

  if (
    !Number.isFinite(input.dragCoefficient) ||
    input.dragCoefficient < 0.1 ||
    input.dragCoefficient > 1.5
  ) {
    errors.dragCoefficient = 'Drag coefficient (Cd) must be between 0.10 and 1.50.';
  }

  if (
    !Number.isFinite(input.frontalAreaSqM) ||
    input.frontalAreaSqM < 0.5 ||
    input.frontalAreaSqM > 10.0
  ) {
    errors.frontalAreaSqM = 'Frontal area must be between 0.5 and 10.0 m².';
  }

  if (
    !Number.isFinite(input.rollingResistanceCoeff) ||
    input.rollingResistanceCoeff < 0.001 ||
    input.rollingResistanceCoeff > 0.1
  ) {
    errors.rollingResistanceCoeff = 'Rolling resistance (Crr) must be between 0.001 and 0.10.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

