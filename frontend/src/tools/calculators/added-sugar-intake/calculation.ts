/**
 * Added sugar intake — sum quantity × label-derived grams per serving (ADR-018).
 */

import {
  CANDY_OPTIONS,
  CEREAL_OPTIONS,
  DAIRY_OPTIONS,
  DRESSING_OPTIONS,
  DRINK_OPTIONS,
  GRAMS_PER_TEASPOON,
  HIDDEN_BREAD_OPTIONS,
  HIDDEN_SNACK_OPTIONS,
  OBVIOUS_BAKED_OPTIONS,
  SEX_SPECIFIC_LIMIT_G,
  findFoodOption,
  type FoodOption,
  type Sex,
} from './food-data';
import type { AddedSugarIntakeInput, AddedSugarIntakeResult } from './types';

export const SOURCE_NOTE =
  'Total added sugar = Σ (serving count × grams added sugar per serving) + tea/coffee teaspoons × 4 g/tsp + direct gram entries. Limits: AHA-style 25 g/day (women) and 36 g/day (men); distinct from the 10%-of-energy dietary guidance.';

export const DISCLAIMER =
  'Educational nutrition estimator from reference label values — not individualized medical or dietary advice.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Non-negative quantity; empty string → 0 for summation. */
export function parseQuantity(raw: string): number | null {
  if (raw.trim() === '') return 0;
  const n = parseNumber(raw);
  if (n === null) return null;
  if (n < 0) return null;
  return n;
}

export function lineItemGrams(
  options: readonly FoodOption[],
  productId: string,
  qty: number,
): number {
  const item = findFoodOption(options, productId);
  if (!item) return 0;
  return qty * item.gramsAddedSugarPerServing;
}

export function totalAddedSugarGrams(
  input: AddedSugarIntakeInput,
  quantities: {
    drink: number;
    dairy: number;
    cereal: number;
    obviousBaked: number;
    candy: number;
    teaTsp: number;
    otherObvious: number;
    hiddenSnack: number;
    hiddenBread: number;
    dressing: number;
    otherHidden: number;
  },
): number {
  const food =
    lineItemGrams(DRINK_OPTIONS, input.drinkId, quantities.drink) +
    lineItemGrams(DAIRY_OPTIONS, input.dairyId, quantities.dairy) +
    lineItemGrams(CEREAL_OPTIONS, input.cerealId, quantities.cereal) +
    lineItemGrams(
      OBVIOUS_BAKED_OPTIONS,
      input.obviousBakedId,
      quantities.obviousBaked,
    ) +
    lineItemGrams(CANDY_OPTIONS, input.candyId, quantities.candy) +
    lineItemGrams(HIDDEN_SNACK_OPTIONS, input.hiddenSnackId, quantities.hiddenSnack) +
    lineItemGrams(HIDDEN_BREAD_OPTIONS, input.hiddenBreadId, quantities.hiddenBread) +
    lineItemGrams(DRESSING_OPTIONS, input.dressingId, quantities.dressing);

  const teaGrams = quantities.teaTsp * GRAMS_PER_TEASPOON;
  return food + teaGrams + quantities.otherObvious + quantities.otherHidden;
}

export function guidelineGramsForSex(sex: Sex): number {
  return SEX_SPECIFIC_LIMIT_G[sex];
}

export function gramsToTeaspoons(grams: number): number {
  return grams / GRAMS_PER_TEASPOON;
}

export function calculateAddedSugarIntake(
  input: AddedSugarIntakeInput,
): AddedSugarIntakeResult {
  const empty = {
    totalGrams: null,
    approximateTeaspoons: null,
    guidelineGrams: guidelineGramsForSex(input.sex),
    differenceFromGuideline: null,
    overGuideline: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const fields = [
    parseQuantity(input.drinkQtyText),
    parseQuantity(input.dairyQtyText),
    parseQuantity(input.cerealQtyText),
    parseQuantity(input.obviousBakedQtyText),
    parseQuantity(input.candyQtyText),
    parseQuantity(input.teaCoffeeTspText),
    parseQuantity(input.otherObviousGramsText),
    parseQuantity(input.hiddenSnackQtyText),
    parseQuantity(input.hiddenBreadQtyText),
    parseQuantity(input.dressingQtyText),
    parseQuantity(input.otherHiddenGramsText),
  ];

  if (fields.some((f) => f === null)) {
    return {
      ...empty,
      statusHeadline: 'Check quantities',
      statusDetail: 'Enter valid non-negative numbers for each quantity field.',
    };
  }

  const [
    drink,
    dairy,
    cereal,
    obviousBaked,
    candy,
    teaTsp,
    otherObvious,
    hiddenSnack,
    hiddenBread,
    dressing,
    otherHidden,
  ] = fields as number[];

  const totalGrams = totalAddedSugarGrams(input, {
    drink,
    dairy,
    cereal,
    obviousBaked,
    candy,
    teaTsp,
    otherObvious,
    hiddenSnack,
    hiddenBread,
    dressing,
    otherHidden,
  });

  const guideline = guidelineGramsForSex(input.sex);
  const teaspoons = gramsToTeaspoons(totalGrams);
  const diff = totalGrams - guideline;

  return {
    totalGrams,
    approximateTeaspoons: Math.round(teaspoons * 10) / 10,
    guidelineGrams: guideline,
    differenceFromGuideline: Math.round(diff * 10) / 10,
    overGuideline: diff > 0,
    statusHeadline: 'Daily added sugar estimate',
    statusDetail: `≈ ${formatGrams(totalGrams)} g (${formatTeaspoons(teaspoons)} tsp) vs ${guideline} g sex-specific limit — ${diff > 0 ? `${formatGrams(diff)} g over` : diff < 0 ? `${formatGrams(Math.abs(diff))} g under` : 'at'} limit.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatGrams(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatTeaspoons(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}