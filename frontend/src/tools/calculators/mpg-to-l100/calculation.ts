import { formatAngle } from '../coordinates/calculation';
import {
  FUEL_UNITS,
  FUEL_UNIT_SYMBOLS,
  UK_MPG_TO_KM_PER_L,
  US_MPG_TO_KM_PER_L,
  type FuelEconomyUnit,
} from './types';

export function formatFuel(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

/** Convert any supported unit into kilometers per liter. */
export function toKmPerLiter(value: number, unit: FuelEconomyUnit): number {
  switch (unit) {
    case 'usMpg':
      return value * US_MPG_TO_KM_PER_L;
    case 'ukMpg':
      return value * UK_MPG_TO_KM_PER_L;
    case 'kmPerLiter':
      return value;
    case 'lPer100Km':
      return 100 / value;
  }
}

export function fromKmPerLiter(kmPerLiter: number, unit: FuelEconomyUnit): number {
  switch (unit) {
    case 'usMpg':
      return kmPerLiter / US_MPG_TO_KM_PER_L;
    case 'ukMpg':
      return kmPerLiter / UK_MPG_TO_KM_PER_L;
    case 'kmPerLiter':
      return kmPerLiter;
    case 'lPer100Km':
      return 100 / kmPerLiter;
  }
}

export function allFromKmPerLiter(kmPerLiter: number): Record<FuelEconomyUnit, number> {
  const out = {} as Record<FuelEconomyUnit, number>;
  for (const unit of FUEL_UNITS) {
    out[unit] = fromKmPerLiter(kmPerLiter, unit);
  }
  return out;
}

/** Exact US-mpg → L/100 km factor derived from mile/gallon definitions. */
export function usMpgToLPer100KmFactor(): number {
  return 100 / US_MPG_TO_KM_PER_L;
}

export function ukMpgToLPer100KmFactor(): number {
  return 100 / UK_MPG_TO_KM_PER_L;
}

export function shareResultText(
  kmPerLiter: number,
  sourceUnit: FuelEconomyUnit,
): string {
  const a = allFromKmPerLiter(kmPerLiter);
  return [
    'MPG to L/100 km Converter | Omega Calculators',
    '',
    'Input:',
    `${formatFuel(a[sourceUnit])} ${FUEL_UNIT_SYMBOLS[sourceUnit]}`,
    '',
    'Results:',
    `${formatFuel(a.usMpg)} US mpg`,
    `${formatFuel(a.ukMpg)} UK mpg`,
    `${formatFuel(a.lPer100Km)} L/100 km`,
    `${formatFuel(a.kmPerLiter)} km/L`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
