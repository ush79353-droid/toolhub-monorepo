/**
 * Assert self-check for Silver Melt Calculator.
 * Run: npx tsx src/tools/calculators/silver-melt/calculation.test.ts
 */
import {
  calculateOtherMetalValue,
  calculatePureSilverMassGrams,
  calculateSilverMeltResults,
  calculateSilverMeltValue,
  convertGramsToUnit,
  convertPriceToPerGram,
  convertWeightToGrams,
  GRAMS_PER,
  shareSilverMeltText,
  silverQuarterPureGrams,
  sterlingMeltExample,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateSilverMeltInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(convertWeightToGrams(1, 'g') === 1, '1 g');
assert(convertWeightToGrams(1, 'kg') === 1000, '1 kg');
assert(convertWeightToGrams(1, 'ozt') === GRAMS_PER.ozt, '1 ozt');
assert(convertWeightToGrams(1, 'oz') === GRAMS_PER.oz, '1 oz avoirdupois');
assert(convertWeightToGrams(1, 'dwt') === GRAMS_PER.dwt, '1 dwt');
assert(convertWeightToGrams(1, 'gr') === GRAMS_PER.gr, '1 gr');
assert(GRAMS_PER.ozt !== GRAMS_PER.oz, 'troy ≠ avoirdupois');
assert(Math.abs(convertGramsToUnit(1000, 'kg') - 1) < 1e-12, '1000g → kg');

assert(calculatePureSilverMassGrams(225, 92.5) === 208.125, '225g 92.5%');
assert(calculateSilverMeltValue(208.125, 0.9) === 187.3125, 'melt raw');

const example = sterlingMeltExample();
assert(example.pureGrams === 208.125, 'example pure');
assert(example.rawValue === 187.3125, 'example raw');
assert(example.roundedUsd === 187.31, 'example rounded');

assert(Math.abs(silverQuarterPureGrams() - 5.625) < 1e-12, 'quarter 5.625g');

assert(convertPriceToPerGram(0.9, 'g') === 0.9, 'price/g');
assert(
  Math.abs(convertPriceToPerGram(GRAMS_PER.ozt, 'ozt') - 1) < 1e-9,
  'price/ozt',
);

assert(calculateOtherMetalValue(16.875, 0.01) === 0.16875, 'copper value');

const validated = validateSilverMeltInput(createExampleInput());
assert(validated.isValid && validated.result !== null, 'example valid');
assert(validated.result!.silverMeltValue === 187.31, 'validated melt');

const alloy = validateSilverMeltInput({
  ...createExampleInput(),
  alloyOpen: true,
  deriveOtherFromRemainder: true,
  otherMetalPrice: '0.01',
  otherMetalPriceUnit: 'g',
});
assert(alloy.isValid && alloy.result !== null, 'alloy valid');
assert(
  Math.abs((alloy.result!.otherMetalWeightInGrams ?? 0) - 16.875) < 1e-9,
  'remainder copper grams',
);
assert(alloy.result!.combinedAlloyValue !== null, 'combined set');

const tooHeavy = validateSilverMeltInput({
  ...createExampleInput(),
  alloyOpen: true,
  deriveOtherFromRemainder: false,
  otherMetalWeight: '300',
  otherMetalWeightUnit: 'g',
  otherMetalPrice: '1',
});
assert(
  !tooHeavy.isValid && Boolean(tooHeavy.errors.otherMetalWeight),
  'other > total rejected',
);

const defaults = validateSilverMeltInput(createDefaultInput());
assert(defaults.incomplete, 'empty incomplete');

const zero = calculateSilverMeltResults({
  weight: 0,
  weightUnit: 'g',
  purityPreset: 'sterling-925',
  purityPercent: 92.5,
  pureSilverUnit: 'g',
  pricePerUnit: 0.9,
  priceUnit: 'g',
  currency: 'USD',
  alloyOpen: false,
  otherMetalType: 'copper',
  otherMetalLabel: '',
  deriveOtherFromRemainder: true,
  otherMetalWeight: null,
  otherMetalWeightUnit: 'g',
  otherMetalPrice: null,
  otherMetalPriceUnit: 'g',
});
assert(zero !== null && zero.silverMeltValue === 0, 'zero weight');

const badPurity = validateSilverMeltInput({
  ...createExampleInput(),
  purityPercent: '0',
});
assert(!badPurity.isValid, 'purity 0 invalid');

const negPrice = validateSilverMeltInput({
  ...createExampleInput(),
  pricePerUnit: '-1',
});
assert(!negPrice.isValid, 'neg price');

assert(
  shareSilverMeltText(validated.result!).includes('Silver Melt Calculator'),
  'share',
);

console.log('silver-melt calculation.test.ts: all asserts passed');
