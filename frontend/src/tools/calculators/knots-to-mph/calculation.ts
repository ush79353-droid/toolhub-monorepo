import {
  convertSpeed,
  formatSpeed,
  fromMetersPerSecond,
  toMetersPerSecond,
} from '../speed/calculation';
import {
  FIELD_SYMBOLS,
  KNOTS_MPH_FIELDS,
  KNOTS_TO_MPH,
  type KnotsMphField,
} from './types';

export { formatSpeed, convertSpeed };

export function knotsToMph(knots: number): number {
  return knots * KNOTS_TO_MPH;
}

export function mphToKnots(mph: number): number {
  return mph / KNOTS_TO_MPH;
}

export function allFromField(
  value: number,
  source: KnotsMphField,
): Record<KnotsMphField, number> {
  const mps = toMetersPerSecond(value, source);
  const out = {} as Record<KnotsMphField, number>;
  for (const field of KNOTS_MPH_FIELDS) {
    out[field] = fromMetersPerSecond(mps, field);
  }
  return out;
}

export function shareResultText(amounts: Record<KnotsMphField, number>): string {
  const lines = ['Knots to MPH Converter — Omega Calculators', ''];
  for (const field of KNOTS_MPH_FIELDS) {
    lines.push(`${formatSpeed(amounts[field])} ${FIELD_SYMBOLS[field]}`);
  }
  lines.push(
    '',
    `1 kn ≈ ${formatSpeed(KNOTS_TO_MPH)} mph (exact 1852/1609.344)`,
    '',
    'Calculated with Omega Calculators',
  );
  return lines.join('\n');
}
