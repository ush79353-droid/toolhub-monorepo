import { requireIngredient } from './ingredients';
import {
  US_TABLESPOON_ML,
  type TbspToGramsInput,
  type TbspToGramsResult,
} from './types';

export { US_TABLESPOON_ML };

export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 100) digits = 6;
  else if (abs >= 1) digits = 10;
  else digits = 12;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

/** Kitchen-friendly display (e.g. 28.36 g). */
export function formatKitchen(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1000) return formatMeasure(value);
  return String(Number(value.toFixed(2)));
}

export function tablespoonsToGrams(tablespoons: number, densityGPerMl: number): number {
  if (!Number.isFinite(tablespoons) || tablespoons < 0) {
    throw new RangeError('Tablespoons must be a non-negative finite number.');
  }
  if (!Number.isFinite(densityGPerMl) || densityGPerMl <= 0) {
    throw new RangeError('Density must be a positive finite number.');
  }
  return tablespoons * US_TABLESPOON_ML * densityGPerMl;
}

export function gramsToTablespoons(grams: number, densityGPerMl: number): number {
  if (!Number.isFinite(grams) || grams < 0) {
    throw new RangeError('Grams must be a non-negative finite number.');
  }
  if (!Number.isFinite(densityGPerMl) || densityGPerMl <= 0) {
    return Number.NaN;
  }
  return grams / (US_TABLESPOON_ML * densityGPerMl);
}

export function gramsPerTablespoon(densityGPerMl: number): number {
  if (!Number.isFinite(densityGPerMl) || densityGPerMl <= 0) {
    throw new RangeError('Density must be a positive finite number.');
  }
  return US_TABLESPOON_ML * densityGPerMl;
}

export function calculateTbspToGrams(input: TbspToGramsInput): TbspToGramsResult {
  const ingredient = requireIngredient(input.ingredientId);
  const densityGPerMl = ingredient.densityGPerMl;
  let tablespoons: number;
  let grams: number;

  if (input.source === 'tablespoons') {
    tablespoons = input.tablespoons!;
    grams = tablespoonsToGrams(tablespoons, densityGPerMl);
  } else {
    grams = input.grams!;
    tablespoons = gramsToTablespoons(grams, densityGPerMl);
    if (!Number.isFinite(tablespoons)) {
      throw new RangeError('Unable to convert with this density.');
    }
  }

  const gPerTbsp = gramsPerTablespoon(densityGPerMl);
  const explanation =
    input.source === 'tablespoons'
      ? `${formatMeasure(tablespoons)} US tbsp × ${US_TABLESPOON_ML} mL × ${formatMeasure(densityGPerMl)} g/mL = ${formatKitchen(grams)} g`
      : `${formatKitchen(grams)} g ÷ (${US_TABLESPOON_ML} mL × ${formatMeasure(densityGPerMl)} g/mL) = ${formatMeasure(tablespoons)} US tbsp`;

  return {
    source: input.source,
    ingredientId: ingredient.id,
    ingredientName: ingredient.name,
    densityGPerMl,
    tablespoons,
    grams,
    gramsPerTbsp: gPerTbsp,
    explanation,
  };
}

export function shareResultText(result: TbspToGramsResult): string {
  return [
    'tbsp to Grams Converter',
    'Omega Calculators',
    '',
    `Ingredient: ${result.ingredientName}`,
    '',
    `${formatMeasure(result.tablespoons)} US tbsp ≈ ${formatKitchen(result.grams)} g`,
    '',
    '/tools/tbsp-to-grams-converter-with-ingredient-weights',
  ].join('\n');
}
