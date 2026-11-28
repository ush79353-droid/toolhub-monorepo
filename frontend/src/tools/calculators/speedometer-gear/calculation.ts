/**
 * Speedometer gear — R = 20168/D_in (practical approx); Td = A×R×Tg/C.
 * Theoretical ideal WRM = 63360/(πD) is documented but not used for gear formula.
 */

import type {
  SpeedometerGearInput,
  SpeedometerGearResult,
  TireDiameterUnit,
  TireRevolutionUnit,
} from './types';

/** Practical tire-rev/mi constant from reference formula */
export const TIRE_REV_CONSTANT = 20_168;
export const DEFAULT_CALIBRATION = 1000;
export const MI_PER_KM = 1.609344;

export const DIAMETER_TO_INCHES: Record<TireDiameterUnit, number> = {
  mm: 1 / 25.4,
  cm: 1 / 2.54,
  in: 1,
  ft: 12,
  m: 1 / 0.0254,
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
  return (value * DIAMETER_TO_INCHES[from]) / DIAMETER_TO_INCHES[to];
}

export function toInches(value: number, unit: TireDiameterUnit): number {
  return value * DIAMETER_TO_INCHES[unit];
}

/** Convert revolutions between per-mile and per-km */
export function convertTireRevolutions(
  value: number,
  from: TireRevolutionUnit,
  to: TireRevolutionUnit,
): number {
  if (from === to) return value;
  if (from === 'rev/mi' && to === 'rev/km') return value / MI_PER_KM;
  return value * MI_PER_KM;
}

export function toRevPerMile(
  value: number,
  unit: TireRevolutionUnit,
): number {
  return unit === 'rev/mi' ? value : value * MI_PER_KM;
}

export function fromRevPerMile(
  revPerMile: number,
  unit: TireRevolutionUnit,
): number {
  return unit === 'rev/mi' ? revPerMile : revPerMile / MI_PER_KM;
}

/** Practical approximation R = 20168 / D_inches */
export function calculateTireRevolutionsPerMile(
  diameterInches: number,
): number {
  return TIRE_REV_CONSTANT / diameterInches;
}

/** Ideal circular: 63360 / (π D) — for comparison/education only */
export function calculateIdealRevolutionsPerMile(
  diameterInches: number,
): number {
  return 63_360 / (Math.PI * diameterInches);
}

export function calculateSpeedometerGearRatio(
  axleRatio: number,
  revPerMile: number,
  calibration: number,
): number {
  return (axleRatio * revPerMile) / calibration;
}

export function calculateDrivenGearTeeth(
  axleRatio: number,
  revPerMile: number,
  drivingTeeth: number,
  calibration: number,
): number {
  return (axleRatio * revPerMile * drivingTeeth) / calibration;
}

export function roundDrivenGearTeeth(theoretical: number): number {
  return Math.round(theoretical);
}

export function calculateGearToothDeviation(
  selected: number,
  theoretical: number,
): number {
  if (theoretical === 0) return 0;
  return ((selected - theoretical) / theoretical) * 100;
}

export function calculateSpeedometerGearFromInput(
  input: SpeedometerGearInput,
  parsed: {
    tireDiameter: number | null;
    axleRatio: number;
    tireRevolutions: number | null;
    drivingGearTeeth: number;
    calibration: number;
  },
): SpeedometerGearResult {
  let revPerMile: number;

  if (input.useManualRevolutions && parsed.tireRevolutions != null) {
    revPerMile = toRevPerMile(
      parsed.tireRevolutions,
      input.tireRevolutionUnit,
    );
  } else {
    const dIn = toInches(parsed.tireDiameter!, input.tireDiameterUnit);
    revPerMile = calculateTireRevolutionsPerMile(dIn);
  }

  const ratio = calculateSpeedometerGearRatio(
    parsed.axleRatio,
    revPerMile,
    parsed.calibration,
  );
  const theoretical = calculateDrivenGearTeeth(
    parsed.axleRatio,
    revPerMile,
    parsed.drivingGearTeeth,
    parsed.calibration,
  );
  const recommended = roundDrivenGearTeeth(theoretical);
  const deviation = calculateGearToothDeviation(recommended, theoretical);

  const revDisplay = fromRevPerMile(revPerMile, input.tireRevolutionUnit);

  const formulaSteps = [
    input.useManualRevolutions
      ? `R = ${fmt(revPerMile, 2)} rev/mi (manual)`
      : `R = ${TIRE_REV_CONSTANT} / D = ${TIRE_REV_CONSTANT} / ${fmt(toInches(parsed.tireDiameter!, input.tireDiameterUnit), 4)} = ${fmt(revPerMile, 2)} rev/mi (practical approx.)`,
    `G = A × R / C = ${fmt(parsed.axleRatio, 4)} × ${fmt(revPerMile, 2)} / ${fmt(parsed.calibration, 0)} = ${fmt(ratio, 4)}`,
    `Td = G × Tg = ${fmt(ratio, 4)} × ${parsed.drivingGearTeeth} = ${fmt(theoretical, 2)} teeth`,
    `Recommended = round(${fmt(theoretical, 2)}) = ${recommended} teeth`,
    `Tooth-count deviation = ${fmt(deviation, 2)}% (not speedometer reading error)`,
  ];

  return {
    tireRevolutionsPerMile: revPerMile,
    tireRevolutionsDisplay: revDisplay,
    speedometerGearRatio: ratio,
    theoreticalDrivenGearTeeth: theoretical,
    recommendedDrivenGearTeeth: recommended,
    gearToothDeviationPercent: deviation,
    tireRevolutionsPerMileDisplay: `${fmt(revDisplay, 2)} ${input.tireRevolutionUnit}`,
    gearRatioDisplay: fmt(ratio, 4),
    theoreticalTeethDisplay: `${fmt(theoretical, 2)} teeth`,
    recommendedTeethDisplay: `${recommended} teeth`,
    deviationDisplay: `${fmt(deviation, 2)}%`,
    formulaSteps,
    interpretation:
      'Uses practical R = 20168/D (inches), not ideal 63360/(πD). Suggested teeth are rounded; confirm gear availability and transmission compatibility. Applicable to mechanical speedometers with the stated cable calibration — not electronic VSS relearn procedures.',
  };
}
