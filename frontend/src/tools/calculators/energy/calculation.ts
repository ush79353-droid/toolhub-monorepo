import { formatAngle } from '../coordinates/calculation';
import {
  ENERGY_TO_JOULES,
  ENERGY_UNITS,
  ENERGY_UNIT_SYMBOLS,
  type EnergyUnit,
} from './types';

export function formatEnergy(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toJoules(value: number, unit: EnergyUnit): number {
  return value * ENERGY_TO_JOULES[unit];
}

export function fromJoules(joules: number, unit: EnergyUnit): number {
  return joules / ENERGY_TO_JOULES[unit];
}

export function allFromJoules(joules: number): Record<EnergyUnit, number> {
  const out = {} as Record<EnergyUnit, number>;
  for (const unit of ENERGY_UNITS) {
    out[unit] = fromJoules(joules, unit);
  }
  return out;
}

export function shareResultText(joules: number, sourceUnit: EnergyUnit): string {
  const a = allFromJoules(joules);
  const highlight: EnergyUnit[] = [
    'joule',
    'kilojoule',
    'kilocalorie',
    'wattHour',
    'kilowattHour',
    'electronvolt',
  ];
  const lines = highlight
    .filter((u) => u !== sourceUnit)
    .map((u) => `${formatEnergy(a[u])} ${ENERGY_UNIT_SYMBOLS[u]}`);
  return [
    'Energy Conversion Calculator — Omega Calculators',
    '',
    'Input:',
    `${formatEnergy(a[sourceUnit])} ${ENERGY_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    `Joule equivalent: ${formatEnergy(joules)} J`,
    '',
    'Selected conversions:',
    ...lines,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
