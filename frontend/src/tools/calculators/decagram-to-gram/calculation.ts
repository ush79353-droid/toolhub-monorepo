import {
  CENTIGRAMS_PER_GRAM,
  DECIGRAMS_PER_GRAM,
  GRAMS_PER_DECAGRAM,
  GRAMS_PER_HECTOGRAM,
  GRAMS_PER_KILOGRAM,
  GRAMS_PER_TONNE,
  MICROGRAMS_PER_GRAM,
  MILLIGRAMS_PER_GRAM,
  type DecagramToGramInput,
  type DecagramToGramResult,
  type OtherUnitRow,
} from './types';

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
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

export function dagToGrams(dag: number): number {
  return dag * GRAMS_PER_DECAGRAM;
}

export function gramsToDag(g: number): number {
  return g / GRAMS_PER_DECAGRAM;
}

function otherUnitsFromGrams(g: number): readonly OtherUnitRow[] {
  return [
    { unit: 'µg', label: 'Micrograms (µg / mcg)', value: g * MICROGRAMS_PER_GRAM },
    { unit: 'mg', label: 'Milligrams (mg)', value: g * MILLIGRAMS_PER_GRAM },
    { unit: 'cg', label: 'Centigrams (cg)', value: g * CENTIGRAMS_PER_GRAM },
    { unit: 'dg', label: 'Decigrams (dg)', value: g * DECIGRAMS_PER_GRAM },
    { unit: 'g', label: 'Grams (g)', value: g },
    { unit: 'dag', label: 'Decagrams (dag)', value: gramsToDag(g) },
    { unit: 'hg', label: 'Hectograms (hg)', value: g / GRAMS_PER_HECTOGRAM },
    { unit: 'kg', label: 'Kilograms (kg)', value: g / GRAMS_PER_KILOGRAM },
    { unit: 't', label: 'Metric tonnes (t)', value: g / GRAMS_PER_TONNE },
  ];
}

export function calculateDecagramToGram(input: DecagramToGramInput): DecagramToGramResult {
  let dag: number;
  let g: number;

  if (input.source === 'dag') {
    dag = input.dag!;
    g = dagToGrams(dag);
  } else {
    g = input.g!;
    dag = gramsToDag(g);
  }

  return {
    source: input.source,
    dag,
    g,
    otherUnits: otherUnitsFromGrams(g),
  };
}
