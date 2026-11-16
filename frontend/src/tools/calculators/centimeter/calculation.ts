import {
  CORE_IMPERIAL,
  CORE_METRIC,
  fromMeters,
  toMeters,
  UNIT_SYMBOLS,
  type LengthUnit,
  type OtherImperialUnit,
  type OtherMetricUnit,
} from './units';

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

export function metersFromUnit(value: number, unit: LengthUnit): number {
  return toMeters(value, unit);
}

export function valueInUnit(meters: number, unit: LengthUnit): number {
  return fromMeters(meters, unit);
}

export function syncUnitsFromMeters(
  meters: number,
  otherImperial: OtherImperialUnit,
  otherMetric: OtherMetricUnit,
): Record<LengthUnit, number> {
  const units: LengthUnit[] = [
    'cm',
    ...CORE_IMPERIAL,
    ...CORE_METRIC,
    otherImperial,
    otherMetric,
  ];
  const out = {} as Record<LengthUnit, number>;
  for (const unit of units) {
    out[unit] = fromMeters(meters, unit);
  }
  return out;
}

export function shareResultText(meters: number, sourceUnit: LengthUnit): string {
  const cm = fromMeters(meters, 'cm');
  const inches = fromMeters(meters, 'in');
  const m = fromMeters(meters, 'm');
  const source = fromMeters(meters, sourceUnit);
  return [
    'Centimeter Calculator — Omega Calculators',
    '',
    `${formatLength(source)} ${UNIT_SYMBOLS[sourceUnit]}`,
    `${formatLength(cm)} cm = ${formatLength(m)} m`,
    `${formatLength(cm)} cm ≈ ${formatLength(inches)} inches`,
  ].join('\n');
}
