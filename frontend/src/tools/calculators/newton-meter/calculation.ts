import {
  formatTorque,
  otherTorqueUnitsFromNm,
} from '../../shared/torque';
import {
  NEWTON_METERS_PER_FOOT_POUND,
  TORQUE_UNIT_TO_NM,
  type NewtonMeterInput,
  type NewtonMeterResult,
  type TorqueUnit,
} from './types';

export { formatTorque, NEWTON_METERS_PER_FOOT_POUND };

export function toNewtonMeters(value: number, unit: TorqueUnit): number {
  return value * TORQUE_UNIT_TO_NM[unit];
}

export function fromNewtonMeters(nm: number, unit: TorqueUnit): number {
  return nm / TORQUE_UNIT_TO_NM[unit];
}

export function convertTorque(value: number, from: TorqueUnit, to: TorqueUnit): number {
  if (from === to) return value;
  return fromNewtonMeters(toNewtonMeters(value, from), to);
}

export function newtonMetersToFootPounds(newtonMeters: number): number {
  return newtonMeters / NEWTON_METERS_PER_FOOT_POUND;
}

export function footPoundsToNewtonMeters(footPounds: number): number {
  return footPounds * NEWTON_METERS_PER_FOOT_POUND;
}

export function calculateNewtonMeter(input: NewtonMeterInput): NewtonMeterResult {
  let nm: number;
  if (input.source === 'first') {
    nm = toNewtonMeters(input.first!, input.firstUnit);
  } else {
    nm = toNewtonMeters(input.second!, input.secondUnit);
  }

  return {
    source: input.source,
    nm,
    first: fromNewtonMeters(nm, input.firstUnit),
    second: fromNewtonMeters(nm, input.secondUnit),
    firstUnit: input.firstUnit,
    secondUnit: input.secondUnit,
    otherUnits: otherTorqueUnitsFromNm(nm),
  };
}
