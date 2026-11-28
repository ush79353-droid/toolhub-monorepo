/**
 * Pulse per mile — tire diameter normalized to inches; π via Math.PI.
 * WRM = 63360 / (π × TD_in)
 * PPM = WRM × AR × NT
 */

import type {
  PulsePerMileInput,
  PulsePerMileResult,
  SpeedUnit,
  TireDiameterUnit,
} from './types';

/** Inches in one statute mile */
export const INCHES_PER_MILE = 63_360;

export const TIRE_DIAMETER_TO_INCHES: Record<TireDiameterUnit, number> = {
  in: 1,
  cm: 1 / 2.54,
  mm: 1 / 25.4,
  ft: 12,
};

export function fmt(n: number, digits = 4): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function convertTireDiameter(
  value: number,
  from: TireDiameterUnit,
  to: TireDiameterUnit,
): number {
  if (from === to) return value;
  const inches = value * TIRE_DIAMETER_TO_INCHES[from];
  return inches / TIRE_DIAMETER_TO_INCHES[to];
}

export function toInches(
  value: number,
  unit: TireDiameterUnit,
): number {
  return value * TIRE_DIAMETER_TO_INCHES[unit];
}

export function calculateWheelCircumference(diameterInches: number): number {
  return Math.PI * diameterInches;
}

export function calculateWheelRotationsPerMile(
  tireDiameterInches: number,
): number {
  return INCHES_PER_MILE / (Math.PI * tireDiameterInches);
}

export function calculatePulsesPerMile(
  wheelRotationsPerMile: number,
  axleRatio: number,
  reluctorTeeth: number,
): number {
  return wheelRotationsPerMile * axleRatio * reluctorTeeth;
}

/** Combined: PPM = (63360 × AR × NT) / (π × TD) */
export function calculatePulsesPerMileCombined(
  axleRatio: number,
  reluctorTeeth: number,
  tireDiameterInches: number,
): number {
  return (
    (INCHES_PER_MILE * axleRatio * reluctorTeeth) /
    (Math.PI * tireDiameterInches)
  );
}

export function mphFromSpeed(value: number, unit: SpeedUnit): number {
  if (unit === 'mph') return value;
  return value / 1.609344;
}

/** Hz = PPM × mph / 3600 */
export function calculateSensorFrequencyHz(
  pulsesPerMile: number,
  mph: number,
): number {
  return (pulsesPerMile * mph) / 3600;
}

export function calculatePulsePerMileFromInput(
  input: PulsePerMileInput,
  parsed: {
    axleRatio: number;
    reluctorTeeth: number;
    tireDiameter: number;
    vehicleSpeed: number | null;
  },
): PulsePerMileResult {
  const tdIn = toInches(parsed.tireDiameter, input.tireDiameterUnit);
  const wrm = calculateWheelRotationsPerMile(tdIn);
  const ppm = calculatePulsesPerMile(
    wrm,
    parsed.axleRatio,
    parsed.reluctorTeeth,
  );
  const circIn = calculateWheelCircumference(tdIn);
  const circCm = circIn * 2.54;
  const circMm = circIn * 25.4;

  let pulsesPerSecondHz: number | null = null;
  let pulsesPerMinute: number | null = null;
  let frequencyDisplay: string | null = null;

  if (
    input.showSensorFrequency &&
    parsed.vehicleSpeed != null &&
    parsed.vehicleSpeed > 0
  ) {
    const mph = mphFromSpeed(parsed.vehicleSpeed, input.vehicleSpeedUnit);
    pulsesPerSecondHz = calculateSensorFrequencyHz(ppm, mph);
    pulsesPerMinute = pulsesPerSecondHz * 60;
    frequencyDisplay = `${fmt(pulsesPerSecondHz, 2)} Hz (${fmt(pulsesPerMinute, 1)} pulses/min) at ${fmt(parsed.vehicleSpeed, 2)} ${input.vehicleSpeedUnit}`;
  }

  const formulaSteps = [
    `TD = ${fmt(parsed.tireDiameter, 4)} ${input.tireDiameterUnit} = ${fmt(tdIn, 6)} in`,
    `WRM = ${INCHES_PER_MILE} / (π × ${fmt(tdIn, 6)}) = ${fmt(wrm, 4)} rev/mi`,
    `PPM = ${fmt(wrm, 4)} × ${fmt(parsed.axleRatio, 4)} × ${parsed.reluctorTeeth} = ${fmt(ppm, 1)} pulses/mi`,
  ];
  if (pulsesPerSecondHz != null) {
    formulaSteps.push(
      `Hz = PPM × mph / 3600 = ${fmt(pulsesPerSecondHz, 2)} Hz`,
    );
  }

  return {
    wheelRotationsPerMile: wrm,
    pulsesPerMile: ppm,
    tireDiameterInches: tdIn,
    circumferenceIn: circIn,
    circumferenceCm: circCm,
    circumferenceMm: circMm,
    wrmDisplay: `${fmt(wrm, 1)} rev/mi`,
    ppmDisplay: `${fmt(ppm, 0)} pulses/mi`,
    circumferenceInDisplay: `${fmt(circIn, 2)} in`,
    circumferenceCmDisplay: `${fmt(circCm, 2)} cm`,
    circumferenceMmDisplay: `${fmt(circMm, 1)} mm`,
    pulsesPerSecondHz,
    pulsesPerMinute,
    frequencyDisplay,
    formulaSteps,
    interpretation:
      'Theoretical WRM from nominal tire diameter. PPM assumes a shaft-mounted reluctor turning at axle-ratio × wheel speed with one counted pulse per tooth — not a substitute for OEM sensor calibration.',
  };
}
