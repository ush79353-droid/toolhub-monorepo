import {
  ALL_UNITS,
  fromMeters,
  toMeters,
  UNIT_SYMBOLS,
  type LengthUnit,
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

export function allFromMeters(meters: number): Record<LengthUnit, number> {
  const out = {} as Record<LengthUnit, number>;
  for (const unit of ALL_UNITS) {
    out[unit] = fromMeters(meters, unit);
  }
  return out;
}

export function metersFromUnit(value: number, unit: LengthUnit): number {
  return toMeters(value, unit);
}

export interface WrenchRow {
  metricMm: number;
  saeFraction: string;
  saeInches: number;
  saeMm: number;
  differenceMm: number;
}

/** Common metric wrench sizes with nearest fractional SAE equivalents. */
export const WRENCH_CHART: readonly WrenchRow[] = (
  [
    { metricMm: 8, saeFraction: '5/16 in', saeInches: 5 / 16 },
    { metricMm: 10, saeFraction: '3/8 in', saeInches: 3 / 8 },
    { metricMm: 11, saeFraction: '7/16 in', saeInches: 7 / 16 },
    { metricMm: 13, saeFraction: '1/2 in', saeInches: 1 / 2 },
    { metricMm: 14, saeFraction: '9/16 in', saeInches: 9 / 16 },
    { metricMm: 16, saeFraction: '5/8 in', saeInches: 5 / 8 },
    { metricMm: 19, saeFraction: '3/4 in', saeInches: 3 / 4 },
    { metricMm: 21, saeFraction: '13/16 in', saeInches: 13 / 16 },
    { metricMm: 22, saeFraction: '7/8 in', saeInches: 7 / 8 },
    { metricMm: 24, saeFraction: '15/16 in', saeInches: 15 / 16 },
  ] as const
).map((row) => {
  const saeMm = row.saeInches * 25.4;
  return {
    metricMm: row.metricMm,
    saeFraction: row.saeFraction,
    saeInches: row.saeInches,
    saeMm,
    differenceMm: Math.abs(row.metricMm - saeMm),
  };
});

export function shareResultText(
  meters: number,
  sourceUnit: LengthUnit,
): string {
  const values = allFromMeters(meters);
  const source = values[sourceUnit];
  const inches = values.in;
  return [
    'Metric to SAE Calculator — Omega Calculators',
    '',
    `${formatLength(source)} ${UNIT_SYMBOLS[sourceUnit]} = ${formatLength(inches)} in`,
    '',
    `mm ${formatLength(values.mm)} · cm ${formatLength(values.cm)} · m ${formatLength(values.m)} · km ${formatLength(values.km)}`,
    `in ${formatLength(values.in)} · ft ${formatLength(values.ft)} · yd ${formatLength(values.yd)} · mi ${formatLength(values.mi)}`,
  ].join('\n');
}
