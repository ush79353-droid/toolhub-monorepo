import {
  convertSpeed,
  formatSpeed,
  fromMetersPerSecond,
  toMetersPerSecond,
} from '../speed/calculation';
import type { KnotsKphField } from './types';
import { EXTRA_FIELDS, FIELD_SYMBOLS, KNOTS_KPH_FIELDS, KNOTS_TO_KPH } from './types';

export { formatSpeed, convertSpeed };

/** Exact: kn × 1.852 = km/h (1 nmi = 1852 m). */
export function knotsToKph(knots: number): number {
  return knots * KNOTS_TO_KPH;
}

export function kphToKnots(kph: number): number {
  return kph / KNOTS_TO_KPH;
}

export function knotsToMetersPerSecond(knots: number): number {
  return toMetersPerSecond(knots, 'knot');
}

export function metersPerSecondToKnots(mps: number): number {
  return fromMetersPerSecond(mps, 'knot');
}

export function allFromKnotsField(
  value: number,
  source: KnotsKphField,
): Record<KnotsKphField, number> {
  const mps = toMetersPerSecond(value, source);
  const out = {} as Record<KnotsKphField, number>;
  for (const field of KNOTS_KPH_FIELDS) {
    out[field] = fromMetersPerSecond(mps, field);
  }
  return out;
}

export function shareResultText(amounts: Record<KnotsKphField, number>): string {
  const lines = [
    'Knots to kph Converter — Omega Calculators',
    '',
    `${formatSpeed(amounts.knot)} kn = ${formatSpeed(amounts.kmh)} km/h`,
  ];
  for (const field of EXTRA_FIELDS) {
    lines.push(`${formatSpeed(amounts[field])} ${FIELD_SYMBOLS[field]}`);
  }
  lines.push('', '1 kn = 1.852 km/h (international nautical mile)', '', 'Calculated with Omega Calculators');
  return lines.join('\n');
}
