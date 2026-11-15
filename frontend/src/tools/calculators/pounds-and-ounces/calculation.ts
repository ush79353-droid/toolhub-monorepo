import {
  GRAMS_PER_METRIC_UNIT,
  GRAMS_PER_OUNCE,
  GRAMS_PER_POUND,
  OUNCES_PER_POUND,
  OUNCES_PER_STONE,
  POUNDS_PER_STONE,
  type AdditionInput,
  type AdditionResult,
  type EquivalenceInput,
  type EquivalenceResult,
  type MetricUnit,
  type MixedWeight,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function poundsToOunces(pounds: number): number {
  return pounds * OUNCES_PER_POUND;
}

export function ouncesToPounds(ounces: number): number {
  return ounces / OUNCES_PER_POUND;
}

export function mixedToOunces(pounds: number, ounces: number): number {
  return pounds * OUNCES_PER_POUND + ounces;
}

/** Normalize nonnegative total ounces to whole pounds + remaining ounces in [0, 16). */
export function normalizeOunces(totalOunces: number): MixedWeight {
  if (!Number.isFinite(totalOunces) || totalOunces === 0) {
    return { pounds: 0, ounces: 0 };
  }
  const pounds = Math.floor(totalOunces / OUNCES_PER_POUND);
  let ounces = totalOunces - pounds * OUNCES_PER_POUND;
  // Floating-point guard near a pound boundary.
  if (ounces >= OUNCES_PER_POUND - 1e-12) {
    return { pounds: pounds + 1, ounces: 0 };
  }
  if (ounces < 0 && ounces > -1e-12) ounces = 0;
  return { pounds, ounces };
}

export function gramsFromOunces(ounces: number): number {
  return ounces * GRAMS_PER_OUNCE;
}

export function ouncesFromGrams(grams: number): number {
  return grams / GRAMS_PER_OUNCE;
}

export function metricToGrams(value: number, unit: MetricUnit): number {
  return value * GRAMS_PER_METRIC_UNIT[unit];
}

export function gramsToMetric(grams: number, unit: MetricUnit): number {
  return grams / GRAMS_PER_METRIC_UNIT[unit];
}

export function ouncesFromMetric(value: number, unit: MetricUnit): number {
  return ouncesFromGrams(metricToGrams(value, unit));
}

export function stonesFromOunces(ounces: number): number {
  return ounces / OUNCES_PER_STONE;
}

export function ouncesFromStones(stones: number): number {
  return stones * OUNCES_PER_STONE;
}

export function resolveTotalOunces(input: EquivalenceInput): number {
  switch (input.source) {
    case 'pounds':
      return poundsToOunces(input.pounds!);
    case 'ounces':
      return input.ounces!;
    case 'mixed':
      return mixedToOunces(input.mixedPounds ?? 0, input.mixedOunces ?? 0);
    case 'metric':
      return ouncesFromMetric(input.metric!, input.metricUnit);
    case 'stones':
      return ouncesFromStones(input.stones!);
  }
}

export function calculateEquivalence(input: EquivalenceInput): EquivalenceResult {
  const totalOunces = resolveTotalOunces(input);
  const grams = gramsFromOunces(totalOunces);
  const mixed = normalizeOunces(totalOunces);

  return {
    source: input.source,
    totalOunces,
    decimalPounds: ouncesToPounds(totalOunces),
    totalOuncesDisplay: totalOunces,
    mixed,
    grams,
    metric: gramsToMetric(grams, input.metricUnit),
    metricUnit: input.metricUnit,
    stones: stonesFromOunces(totalOunces),
    otherMetric: [
      { unit: 'mg', label: 'Milligrams (mg)', value: gramsToMetric(grams, 'mg') },
      { unit: 'g', label: 'Grams (g)', value: grams },
      { unit: 'kg', label: 'Kilograms (kg)', value: gramsToMetric(grams, 'kg') },
      { unit: 't', label: 'Metric tonnes (t)', value: gramsToMetric(grams, 't') },
    ],
    otherImperial: [
      { unit: 'st', label: 'Stones (st)', value: stonesFromOunces(totalOunces) },
      { unit: 'lb', label: 'Decimal pounds (lb)', value: ouncesToPounds(totalOunces) },
      { unit: 'oz', label: 'Total ounces (oz)', value: totalOunces },
      {
        unit: 'st lb',
        label: `Stones (14 lb = 1 st)`,
        value: ouncesToPounds(totalOunces) / POUNDS_PER_STONE,
      },
    ],
  };
}

export function rowToOunces(pounds: number | null, ounces: number | null): number | null {
  if (pounds === null && ounces === null) return null;
  return mixedToOunces(pounds ?? 0, ounces ?? 0);
}

export function calculateAddition(input: AdditionInput): AdditionResult {
  let totalOunces = 0;
  let counted = 0;
  for (const row of input.rows) {
    const oz = rowToOunces(row.pounds, row.ounces);
    if (oz === null) continue;
    totalOunces += oz;
    counted += 1;
  }
  const mixed = normalizeOunces(totalOunces);
  return {
    totalOunces,
    mixed,
    decimalPounds: ouncesToPounds(totalOunces),
    rowCount: counted,
  };
}

export function formatMixed(mixed: MixedWeight): string {
  return `${formatMeasure(mixed.pounds)} lb ${formatMeasure(mixed.ounces)} oz`;
}

/** Self-check constants used by educational content. */
export const LB_GRAMS = GRAMS_PER_POUND;
export const OZ_GRAMS = GRAMS_PER_OUNCE;
