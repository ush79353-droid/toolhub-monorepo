/**
 * Assert self-check for Scrap Silver Calculator.
 * Run: npx tsx src/tools/calculators/scrap-silver/calculation.test.ts
 */
import {
  calculateDealerDiscountAmount,
  calculateEstimatedSellingValue,
  calculatePureSilverWeightGrams,
  calculateScrapSilverResults,
  calculateSilverValue,
  convertGramsToUnit,
  convertPriceToPerGram,
  convertWeightToGrams,
  GRAMS_PER,
  shareScrapSilverText,
  sterlingExampleValue,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateScrapSilverInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(convertWeightToGrams(1, 'g') === 1, '1 g');
assert(convertWeightToGrams(1, 'kg') === 1000, '1 kg');
assert(convertWeightToGrams(1, 'ozt') === GRAMS_PER.ozt, '1 ozt');
assert(convertWeightToGrams(1, 'dwt') === GRAMS_PER.dwt, '1 dwt');
assert(convertWeightToGrams(1, 'gr') === GRAMS_PER.gr, '1 gr');
assert(Math.abs(convertGramsToUnit(1000, 'kg') - 1) < 1e-12, '1000 g → 1 kg');

assert(calculatePureSilverWeightGrams(100, 92.5) === 92.5, '100g .925 → 92.5g');
assert(calculateSilverValue(92.5, 0.85) === 78.625, '92.5 × 0.85');

const example = sterlingExampleValue();
assert(example.pureGrams === 92.5, 'sterling pure');
assert(example.rawValue === 78.625, 'sterling raw');
assert(example.roundedUsd === 78.63, 'sterling rounded USD');

assert(convertPriceToPerGram(0.85, 'g') === 0.85, 'price per g');
assert(
  Math.abs(convertPriceToPerGram(GRAMS_PER.ozt, 'ozt') - 1) < 1e-9,
  'price per ozt → per g',
);

assert(calculateDealerDiscountAmount(100, 10) === 10, '10% discount');
assert(
  calculateEstimatedSellingValue(100, 10, 5, 2) === 83,
  'sell = 100−10−5−2',
);

const validated = validateScrapSilverInput(createExampleInput());
assert(validated.isValid && validated.result !== null, 'example valid');
assert(validated.result!.pureSilverWeightInGrams === 92.5, 'example pure');
assert(validated.result!.silverValue === 78.63, 'example melt rounded');

const withFees = validateScrapSilverInput({
  ...createExampleInput(),
  sellOpen: true,
  dealerDiscountPercent: '10',
  refiningFee: '2',
  transactionFee: '1',
});
assert(withFees.isValid && withFees.result !== null, 'fees valid');
assert(withFees.result!.dealerDiscountAmount === 7.86, '10% of 78.63');
assert(
  Math.abs(withFees.result!.estimatedSellingValue - (78.63 - 7.86 - 2 - 1)) <
    0.001,
  'selling value',
);

const defaults = validateScrapSilverInput(createDefaultInput());
assert(defaults.incomplete, 'empty incomplete');

const zeroWeight = calculateScrapSilverResults({
  weight: 0,
  weightUnit: 'g',
  purityPreset: 'sterling-925',
  purityPercent: 92.5,
  pureSilverUnit: 'g',
  pricePerUnit: 0.85,
  priceUnit: 'g',
  dealerDiscountPercent: 0,
  refiningFee: 0,
  transactionFee: 0,
  currency: 'USD',
});
assert(zeroWeight !== null && zeroWeight.silverValue === 0, 'zero weight');

const badPurity = validateScrapSilverInput({
  ...createExampleInput(),
  purityPercent: '0',
});
assert(!badPurity.isValid && Boolean(badPurity.errors.purityPercent), 'purity 0');

const negPrice = validateScrapSilverInput({
  ...createExampleInput(),
  pricePerUnit: '-1',
});
assert(!negPrice.isValid && Boolean(negPrice.errors.pricePerUnit), 'neg price');

assert(
  shareScrapSilverText(validated.result!).includes('Scrap Silver Calculator'),
  'share',
);

console.log('scrap-silver calculation.test.ts: all asserts passed');
