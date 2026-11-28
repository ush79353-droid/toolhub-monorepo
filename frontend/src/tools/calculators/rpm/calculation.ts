/**
 * RPM Calculator — SI core: meters, m/s, rpm.
 * ERPM = WRPM × R
 * V_mps = WRPM × π × D_m / 60
 */

import type {
  RpmFieldKey,
  RpmInput,
  RpmResult,
  TireDiameterUnit,
  VehicleSpeedUnit,
} from './types';

export const TIRE_DIAMETER_TO_METERS: Record<TireDiameterUnit, number> = {
  in: 0.0254,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  m: 1,
};

export const SPEED_TO_METERS_PER_SECOND: Record<VehicleSpeedUnit, number> = {
  'km/h': 1 / 3.6,
  mph: 0.44704,
  'm/s': 1,
  'ft/s': 0.3048,
};

export const INCHES_PER_MILE = 63_360;
/** mph = WRPM × π × D_in / 1056 */
export const MPH_DENOM = 1056;

const REL_TOL = 1e-6;
const ABS_TOL = 1e-6;

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
  return (
    (value * TIRE_DIAMETER_TO_METERS[from]) / TIRE_DIAMETER_TO_METERS[to]
  );
}

export function toMeters(value: number, unit: TireDiameterUnit): number {
  return value * TIRE_DIAMETER_TO_METERS[unit];
}

export function fromMeters(meters: number, unit: TireDiameterUnit): number {
  return meters / TIRE_DIAMETER_TO_METERS[unit];
}

export function convertSpeed(
  value: number,
  from: VehicleSpeedUnit,
  to: VehicleSpeedUnit,
): number {
  if (from === to) return value;
  const mps = value * SPEED_TO_METERS_PER_SECOND[from];
  return mps / SPEED_TO_METERS_PER_SECOND[to];
}

export function toMps(value: number, unit: VehicleSpeedUnit): number {
  return value * SPEED_TO_METERS_PER_SECOND[unit];
}

export function fromMps(mps: number, unit: VehicleSpeedUnit): number {
  return mps / SPEED_TO_METERS_PER_SECOND[unit];
}

export function calculateEngineRPM(wheelRPM: number, ratio: number): number {
  return wheelRPM * ratio;
}

export function calculateWheelRPMFromEngine(
  engineRPM: number,
  ratio: number,
): number {
  return engineRPM / ratio;
}

export function calculateDrivetrainRatio(
  engineRPM: number,
  wheelRPM: number,
): number {
  return engineRPM / wheelRPM;
}

export function calculateTireCircumference(diameterMeters: number): number {
  return Math.PI * diameterMeters;
}

export function calculateVehicleSpeedMps(
  wheelRPM: number,
  diameterMeters: number,
): number {
  return (wheelRPM * Math.PI * diameterMeters) / 60;
}

export function calculateWheelRPMFromSpeed(
  speedMps: number,
  diameterMeters: number,
): number {
  return (60 * speedMps) / (Math.PI * diameterMeters);
}

export function calculateTireDiameterMeters(
  speedMps: number,
  wheelRPM: number,
): number {
  return (60 * speedMps) / (Math.PI * wheelRPM);
}

export function mphFromWheel(
  wheelRPM: number,
  diameterInches: number,
): number {
  return (wheelRPM * Math.PI * diameterInches) / MPH_DENOM;
}

export function engineRpmFromMph(
  mph: number,
  diameterInches: number,
  ratio: number,
): number {
  return (mph * MPH_DENOM * ratio) / (Math.PI * diameterInches);
}

export function rpmToRps(rpm: number): number {
  return rpm / 60;
}

export function wheelRotationsPerMile(diameterInches: number): number {
  return INCHES_PER_MILE / (Math.PI * diameterInches);
}

function near(a: number, b: number): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= Math.max(ABS_TOL, REL_TOL * scale);
}

export interface SolveState {
  engineRPM: number | null;
  drivetrainRatio: number | null;
  wheelRPM: number | null;
  tireDiameterMeters: number | null;
  vehicleSpeedMps: number | null;
}

export function solveRPMCalculator(known: SolveState): {
  solved: SolveState;
  derived: Partial<Record<RpmFieldKey, boolean>>;
  inconsistent: boolean;
} {
  const s: SolveState = { ...known };
  const entered = {
    E: known.engineRPM != null,
    R: known.drivetrainRatio != null,
    W: known.wheelRPM != null,
    D: known.tireDiameterMeters != null,
    V: known.vehicleSpeedMps != null,
  };
  const derived: Partial<Record<RpmFieldKey, boolean>> = {};
  let inconsistent = false;

  const set = (
    key: keyof SolveState,
    field: RpmFieldKey,
    value: number,
    wasEntered: boolean,
  ) => {
    if (!Number.isFinite(value)) {
      inconsistent = true;
      return;
    }
    const cur = s[key];
    if (cur != null) {
      if (!near(cur, value)) inconsistent = true;
      return;
    }
    s[key] = value;
    if (!wasEntered) derived[field] = true;
  };

  for (let i = 0; i < 8; i++) {
    const before = JSON.stringify(s);

    if (
      s.engineRPM != null &&
      s.drivetrainRatio != null &&
      s.drivetrainRatio !== 0
    ) {
      set(
        'wheelRPM',
        'wheelRPM',
        calculateWheelRPMFromEngine(s.engineRPM, s.drivetrainRatio),
        entered.W,
      );
    }
    if (s.wheelRPM != null && s.drivetrainRatio != null) {
      set(
        'engineRPM',
        'engineRPM',
        calculateEngineRPM(s.wheelRPM, s.drivetrainRatio),
        entered.E,
      );
    }
    if (s.engineRPM != null && s.wheelRPM != null && s.wheelRPM !== 0) {
      set(
        'drivetrainRatio',
        'drivetrainRatio',
        calculateDrivetrainRatio(s.engineRPM, s.wheelRPM),
        entered.R,
      );
    }
    if (
      s.wheelRPM != null &&
      s.tireDiameterMeters != null &&
      s.tireDiameterMeters > 0
    ) {
      set(
        'vehicleSpeedMps',
        'vehicleSpeed',
        calculateVehicleSpeedMps(s.wheelRPM, s.tireDiameterMeters),
        entered.V,
      );
    }
    if (
      s.vehicleSpeedMps != null &&
      s.tireDiameterMeters != null &&
      s.tireDiameterMeters > 0
    ) {
      set(
        'wheelRPM',
        'wheelRPM',
        calculateWheelRPMFromSpeed(s.vehicleSpeedMps, s.tireDiameterMeters),
        entered.W,
      );
    }
    if (s.vehicleSpeedMps != null && s.wheelRPM != null && s.wheelRPM !== 0) {
      set(
        'tireDiameterMeters',
        'tireDiameter',
        calculateTireDiameterMeters(s.vehicleSpeedMps, s.wheelRPM),
        entered.D,
      );
    }

    if (JSON.stringify(s) === before) break;
  }

  if (
    s.engineRPM != null &&
    s.wheelRPM != null &&
    s.drivetrainRatio != null &&
    !near(s.engineRPM, s.wheelRPM * s.drivetrainRatio)
  ) {
    inconsistent = true;
  }
  if (
    s.wheelRPM != null &&
    s.tireDiameterMeters != null &&
    s.vehicleSpeedMps != null &&
    !near(
      s.vehicleSpeedMps,
      calculateVehicleSpeedMps(s.wheelRPM, s.tireDiameterMeters),
    )
  ) {
    inconsistent = true;
  }

  return { solved: s, derived, inconsistent };
}

export function calculateRpmFromInput(
  input: RpmInput,
  parsed: {
    engineRPM: number | null;
    drivetrainRatio: number | null;
    wheelRPM: number | null;
    tireDiameter: number | null;
    vehicleSpeed: number | null;
  },
): RpmResult {
  const known: SolveState = {
    engineRPM: parsed.engineRPM,
    drivetrainRatio: parsed.drivetrainRatio,
    wheelRPM: parsed.wheelRPM,
    tireDiameterMeters:
      parsed.tireDiameter != null
        ? toMeters(parsed.tireDiameter, input.tireDiameterUnit)
        : null,
    vehicleSpeedMps:
      parsed.vehicleSpeed != null
        ? toMps(parsed.vehicleSpeed, input.vehicleSpeedUnit)
        : null,
  };

  const { solved, derived, inconsistent } = solveRPMCalculator(known);

  const enteredCount = [
    parsed.engineRPM,
    parsed.drivetrainRatio,
    parsed.wheelRPM,
    parsed.tireDiameter,
    parsed.vehicleSpeed,
  ].filter((v) => v != null).length;

  const canShow =
    !inconsistent &&
    (Object.keys(derived).length > 0 ||
      (enteredCount >= 2 &&
        (solved.engineRPM != null ||
          solved.wheelRPM != null ||
          solved.vehicleSpeedMps != null)));

  const tireDisp =
    solved.tireDiameterMeters != null
      ? fromMeters(solved.tireDiameterMeters, input.tireDiameterUnit)
      : null;
  const speedDisp =
    solved.vehicleSpeedMps != null
      ? fromMps(solved.vehicleSpeedMps, input.vehicleSpeedUnit)
      : null;

  const diamIn =
    solved.tireDiameterMeters != null
      ? fromMeters(solved.tireDiameterMeters, 'in')
      : null;

  const circM =
    solved.tireDiameterMeters != null
      ? calculateTireCircumference(solved.tireDiameterMeters)
      : null;
  const circIn = diamIn != null ? Math.PI * diamIn : null;
  const wrm =
    diamIn != null && diamIn > 0 ? wheelRotationsPerMile(diamIn) : null;
  const engineRps =
    solved.engineRPM != null ? rpmToRps(solved.engineRPM) : null;

  const formulaSteps: string[] = [];
  if (solved.wheelRPM != null && solved.drivetrainRatio != null) {
    formulaSteps.push(
      `ERPM = WRPM × R = ${fmt(solved.wheelRPM, 2)} × ${fmt(solved.drivetrainRatio, 4)} = ${solved.engineRPM != null ? fmt(solved.engineRPM, 1) : '—'} rpm`,
    );
  }
  if (solved.wheelRPM != null && diamIn != null) {
    formulaSteps.push(
      `mph = WRPM × π × D / 1056 = ${fmt(mphFromWheel(solved.wheelRPM, diamIn), 2)} mph`,
    );
  }
  if (speedDisp != null) {
    formulaSteps.push(`Speed = ${fmt(speedDisp, 2)} ${input.vehicleSpeedUnit}`);
  }

  let interpretation =
    'Assumes a slip-free drivetrain and nominal tire diameter (circumference πD). Torque-converter slip, clutch slip, and rolling circumference differences can change real RPM.';
  if (inconsistent) {
    interpretation =
      'The entered values are inconsistent with ERPM = WRPM × R and V = WRPM × πD / 60. Adjust one of the conflicting fields.';
  } else if (!canShow) {
    interpretation =
      'Enter at least two related values (e.g. engine RPM and ratio, or wheel RPM and tire diameter) to calculate the rest.';
  }

  return {
    engineRPM: solved.engineRPM,
    drivetrainRatio: solved.drivetrainRatio,
    wheelRPM: solved.wheelRPM,
    tireDiameterMeters: solved.tireDiameterMeters,
    tireDiameterDisplay: tireDisp,
    vehicleSpeedMps: solved.vehicleSpeedMps,
    vehicleSpeedDisplay: speedDisp,
    engineRPMDisplay:
      solved.engineRPM != null ? `${fmt(solved.engineRPM, 1)} rpm` : null,
    drivetrainRatioDisplay:
      solved.drivetrainRatio != null
        ? `${fmt(solved.drivetrainRatio, 4)} : 1`
        : null,
    wheelRPMDisplay:
      solved.wheelRPM != null ? `${fmt(solved.wheelRPM, 2)} rpm` : null,
    tireDiameterFormatted:
      tireDisp != null
        ? `${fmt(tireDisp, 4)} ${input.tireDiameterUnit}`
        : null,
    vehicleSpeedFormatted:
      speedDisp != null
        ? `${fmt(speedDisp, 2)} ${input.vehicleSpeedUnit}`
        : null,
    circumferenceIn: circIn,
    circumferenceM: circM,
    wheelRotationsPerMile: wrm,
    engineRps,
    derived,
    formulaSteps,
    interpretation,
    insufficient: !canShow && !inconsistent,
    inconsistent,
  };
}
