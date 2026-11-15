import {
  HP_UNIT_TO_W,
  TORQUE_UNIT_TO_NM,
  type HpUnit,
  type IndependentKind,
  type PowerUnit,
  type SpeedUnit,
  type TorqueToHpInput,
  type TorqueToHpResult,
  type TorqueUnit,
} from './types';

export function formatPowerNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(8)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
      .replace(/e\+?/, 'e');
  }

  let digits = 10;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 8;
  else digits = 12;

  const rounded = Number(value.toFixed(digits));
  if (Math.abs(rounded) >= 1) {
    const nearest = Math.round(rounded);
    if (Math.abs(rounded - nearest) < 1e-8 * Math.max(1, Math.abs(nearest))) {
      return String(nearest);
    }
  }
  return String(rounded);
}

export function toNewtonMeters(value: number, unit: TorqueUnit): number {
  return value * TORQUE_UNIT_TO_NM[unit];
}

export function fromNewtonMeters(nm: number, unit: TorqueUnit): number {
  return nm / TORQUE_UNIT_TO_NM[unit];
}

export function toRadiansPerSecond(value: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'rads':
      return value;
    case 'rpm':
      return (value * 2 * Math.PI) / 60;
    case 'revs':
      return value * 2 * Math.PI;
    case 'degs':
      return (value * Math.PI) / 180;
    default:
      return value;
  }
}

export function fromRadiansPerSecond(radS: number, unit: SpeedUnit): number {
  switch (unit) {
    case 'rads':
      return radS;
    case 'rpm':
      return (radS * 60) / (2 * Math.PI);
    case 'revs':
      return radS / (2 * Math.PI);
    case 'degs':
      return (radS * 180) / Math.PI;
    default:
      return radS;
  }
}

export function rpmToRadiansPerSecond(rpm: number): number {
  return (rpm * 2 * Math.PI) / 60;
}

export function radiansPerSecondToRpm(radiansPerSecond: number): number {
  return (radiansPerSecond * 60) / (2 * Math.PI);
}

export function toWatts(value: number, unit: PowerUnit): number {
  switch (unit) {
    case 'W':
      return value;
    case 'kW':
      return value * 1000;
    case 'MW':
      return value * 1_000_000;
    default:
      return value;
  }
}

export function fromWatts(watts: number, unit: PowerUnit): number {
  switch (unit) {
    case 'W':
      return watts;
    case 'kW':
      return watts / 1000;
    case 'MW':
      return watts / 1_000_000;
    default:
      return watts;
  }
}

export function horsepowerToWatts(hp: number, unit: HpUnit): number {
  return hp * HP_UNIT_TO_W[unit];
}

export function wattsToHorsepower(watts: number, unit: HpUnit): number {
  return watts / HP_UNIT_TO_W[unit];
}

export function calculateMechanicalPowerWatts(
  torqueNm: number,
  angularSpeedRadPerSec: number
): number {
  return torqueNm * angularSpeedRadPerSec;
}

export function calculateTorqueFromPower(
  powerWatts: number,
  angularSpeedRadPerSec: number
): number {
  return powerWatts / angularSpeedRadPerSec;
}

export function calculateAngularSpeedFromPower(
  powerWatts: number,
  torqueNm: number
): number {
  return powerWatts / torqueNm;
}

export function resolvePowerWatts(input: TorqueToHpInput): number | null {
  if (input.powerVia === 'horsepower') {
    if (input.horsepower === null || !Number.isFinite(input.horsepower)) return null;
    return horsepowerToWatts(input.horsepower, input.hpUnit);
  }
  if (input.power === null || !Number.isFinite(input.power)) return null;
  return toWatts(input.power, input.powerUnit);
}

function pairKinds(input: TorqueToHpInput): [IndependentKind, IndependentKind] {
  return [input.primary, input.secondary];
}

export function calculateTorqueToHp(input: TorqueToHpInput): TorqueToHpResult {
  const kinds = new Set(pairKinds(input));
  let torqueNm: number;
  let angularSpeedRadS: number;
  let powerW: number;

  if (kinds.has('torque') && kinds.has('speed')) {
    torqueNm = toNewtonMeters(input.torque!, input.torqueUnit);
    angularSpeedRadS = toRadiansPerSecond(input.speed!, input.speedUnit);
    powerW = calculateMechanicalPowerWatts(torqueNm, angularSpeedRadS);
  } else if (kinds.has('power') && kinds.has('speed')) {
    powerW = resolvePowerWatts(input)!;
    angularSpeedRadS = toRadiansPerSecond(input.speed!, input.speedUnit);
    torqueNm = calculateTorqueFromPower(powerW, angularSpeedRadS);
  } else if (kinds.has('torque') && kinds.has('power')) {
    torqueNm = toNewtonMeters(input.torque!, input.torqueUnit);
    powerW = resolvePowerWatts(input)!;
    angularSpeedRadS = calculateAngularSpeedFromPower(powerW, torqueNm);
  } else {
    throw new Error('Insufficient independent inputs.');
  }

  const horsepower = wattsToHorsepower(powerW, input.hpUnit);

  return {
    torqueNm,
    angularSpeedRadS,
    powerW,
    horsepower,
    torqueUnit: input.torqueUnit,
    speedUnit: input.speedUnit,
    powerUnit: input.powerUnit,
    hpUnit: input.hpUnit,
    torqueDisplay: fromNewtonMeters(torqueNm, input.torqueUnit),
    speedDisplay: fromRadiansPerSecond(angularSpeedRadS, input.speedUnit),
    powerDisplay: fromWatts(powerW, input.powerUnit),
    horsepowerDisplay: horsepower,
  };
}
