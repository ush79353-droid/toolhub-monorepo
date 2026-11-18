import {
  LENGTH_UNITS,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
  type LengthUnit,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;

  return String(Number(value.toFixed(digits)));
}

export function toMeters(value: number, unit: LengthUnit): number {
  return value * METERS_PER_UNIT[unit];
}

export function fromMeters(meters: number, unit: LengthUnit): number {
  return meters / METERS_PER_UNIT[unit];
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  if (from === to) return value;
  return fromMeters(toMeters(value, from), to);
}

export function allFromMeters(meters: number): Record<LengthUnit, number> {
  const out = {} as Record<LengthUnit, number>;
  for (const unit of LENGTH_UNITS) {
    out[unit] = fromMeters(meters, unit);
  }
  return out;
}

export function shareResultText(meters: number): string {
  const values = allFromMeters(meters);
  return [
    'Meter Converter — Omega Calculators',
    '',
    `${formatLength(meters)} meter equals:`,
    '',
    `${formatLength(values.km)} kilometers`,
    `${formatLength(values.cm)} centimeters`,
    `${formatLength(values.mm)} millimeters`,
    `${formatLength(values.ft)} feet`,
    `${formatLength(values.in)} inches`,
    `${formatLength(values.yd)} yards`,
    `${formatLength(values.mi)} statute miles`,
    `${formatLength(values.nmi)} nautical miles`,
    '',
    `Primary: ${formatLength(values.m)} ${UNIT_SYMBOLS.m}`,
  ].join('\n');
}
