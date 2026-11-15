import { formatAngle } from '../coordinates/calculation';
import {
  EXTRA_SPEED_UNITS,
  MAIN_SPEED_UNITS,
  SPEED_UNIT_DEFS,
  type ExtraSpeedUnit,
  type MainSpeedUnit,
  type SpeedUnit,
} from './types';

export function formatSpeed(value: number): string {
  return formatAngle(value, 12);
}

export function metersPerSecondToKmh(mps: number): number {
  return mps * 3.6;
}

export function kmhToMetersPerSecond(kmh: number): number {
  return kmh / 3.6;
}

export function toMetersPerSecond(value: number, unit: SpeedUnit): number {
  return value / SPEED_UNIT_DEFS[unit].fromMps;
}

export function fromMetersPerSecond(mps: number, unit: SpeedUnit): number {
  return mps * SPEED_UNIT_DEFS[unit].fromMps;
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  if (from === to) return value;
  return fromMetersPerSecond(toMetersPerSecond(value, from), to);
}

export function valuesFromMps(mps: number): Record<SpeedUnit, string> {
  const out = {} as Record<SpeedUnit, string>;
  for (const unit of [...MAIN_SPEED_UNITS, ...EXTRA_SPEED_UNITS] as SpeedUnit[]) {
    out[unit] = formatSpeed(fromMetersPerSecond(mps, unit));
  }
  return out;
}

export function mainRowsFromMps(mps: number): { unit: MainSpeedUnit; value: string }[] {
  return MAIN_SPEED_UNITS.map((unit) => ({
    unit,
    value: formatSpeed(fromMetersPerSecond(mps, unit)),
  }));
}

export function extraRowsFromMps(mps: number): { unit: ExtraSpeedUnit; value: string }[] {
  return EXTRA_SPEED_UNITS.map((unit) => ({
    unit,
    value: formatSpeed(fromMetersPerSecond(mps, unit)),
  }));
}

export function shareResultText(inputLabel: string, mps: number): string {
  const values = valuesFromMps(mps);
  return [
    'm/s to km/h Converter',
    'Omega Calculators',
    '',
    'Input:',
    inputLabel,
    '',
    'Conversions:',
    `${values.kmh} kilometers per hour`,
    `${values.mph} miles per hour`,
    `${values.fps} feet per second`,
    `${values.knots} knots`,
    `${values.cms} centimeters per second`,
    `${values.mms} millimeters per second`,
    `${values.kms} kilometers per second`,
    `${values.mpm} meters per minute`,
    `${values.kmpm} kilometers per minute`,
    `${values.fpm} feet per minute`,
    `${values.mips} miles per second`,
    `${values.mipm} miles per minute`,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}
