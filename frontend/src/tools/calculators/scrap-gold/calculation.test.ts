/**
 * Assert self-check for Scrap Gold Calculator.
 * Run: npx tsx src/tools/calculators/scrap-gold/calculation.test.ts
 */
import {
  calculatePureGoldWeightGrams,
  calculateScrapGoldResults,
  calculateScrapGoldValue,
  convertGramsToUnit,
  convertPriceToPerGram,
  convertWeightToGrams,
  GRAMS_PER,
  karatToPurityPercent,
  mixedKaratExampleValue,
  purityPercentToKarat,
  shareScrapGoldText,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateScrapGoldInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(convertWeightToGrams(1, 'g') === 1, '1 g');
assert(convertWeightToGrams(1, 'kg') === 1000, '1 kg');
assert(convertWeightToGrams(1, 'ozt') === GRAMS_PER.ozt, '1 ozt');
assert(convertWeightToGrams(1, 'dwt') === GRAMS_PER.dwt, '1 dwt');
assert(convertWeightToGrams(1, 'gr') === GRAMS_PER.gr, '1 gr');
assert(
  Math.abs(convertGramsToUnit(1000, 'kg') - 1) < 1e-12,
  '1000 g → 1 kg',
);

assert(karatToPurityPercent(24) === 100, '24K → 100%');
assert(Math.abs(karatToPurityPercent(18) - 75) < 1e-12, '18K → 75%');
assert(Math.abs(karatToPurityPercent(22) - (2200 / 24)) < 1e-12, '22K');
assert(Math.abs(purityPercentToKarat(75) - 18) < 1e-12, '75% → 18K');

assert(calculatePureGoldWeightGrams(120, 75) === 90, '120g 18K → 90g');
assert(calculatePureGoldWeightGrams(350, 37.5) === 131.25, '350g 9K → 131.25g');

assert(convertPriceToPerGram(39, 'g') === 39, 'price per g');
assert(
  Math.abs(convertPriceToPerGram(GRAMS_PER.ozt, 'ozt') - 1) < 1e-9,
  'price per ozt → per g',
);

assert(calculateScrapGoldValue(221.25, 39) === 8628.75, 'mixed value');

const mixed = mixedKaratExampleValue();
assert(mixed.pure18 === 90, 'mixed 18K pure');
assert(mixed.pure9 === 131.25, 'mixed 9K pure');
assert(mixed.totalPure === 221.25, 'mixed total pure');
assert(mixed.value === 8628.75, 'mixed $39/g');

const example = validateScrapGoldInput(createExampleInput());
assert(example.isValid && example.result !== null, 'example valid');
assert(example.result!.pureGoldWeightInGrams === 90, 'example pure 90g');
assert(example.result!.totalValue === 3510, '120g 18K × $39 = $3510');

const defaults = validateScrapGoldInput(createDefaultInput());
assert(defaults.incomplete, 'empty weight/price incomplete');

const zeroWeight = calculateScrapGoldResults({
  weight: 0,
  weightUnit: 'g',
  karat: 24,
  purityPercent: 100,
  pureGoldUnit: 'g',
  pricePerUnit: 39,
  priceUnit: 'g',
  currency: 'USD',
});
assert(zeroWeight !== null && zeroWeight.totalValue === 0, 'zero weight → $0');

const zeroPrice = calculateScrapGoldResults({
  weight: 10,
  weightUnit: 'g',
  karat: 24,
  purityPercent: 100,
  pureGoldUnit: 'g',
  pricePerUnit: 0,
  priceUnit: 'g',
  currency: 'USD',
});
assert(zeroPrice !== null && zeroPrice.totalValue === 0, 'zero price → $0');

const badKarat = validateScrapGoldInput({
  ...createExampleInput(),
  karat: '25',
});
assert(!badKarat.isValid && Boolean(badKarat.errors.karat), 'karat > 24');

const badPurity = validateScrapGoldInput({
  ...createExampleInput(),
  purityPercent: '101',
});
assert(!badPurity.isValid && Boolean(badPurity.errors.purityPercent), 'purity > 100');

const priceOzt = calculateScrapGoldResults({
  weight: 1,
  weightUnit: 'ozt',
  karat: 24,
  purityPercent: 100,
  pureGoldUnit: 'ozt',
  pricePerUnit: 2000,
  priceUnit: 'ozt',
  currency: 'USD',
});
assert(priceOzt !== null, 'ozt price result');
assert(Math.abs(priceOzt!.totalValue - 2000) < 0.01, '1 ozt @ $2000/ozt ≈ $2000');

assert(
  shareScrapGoldText(example.result!).includes('Scrap Gold Calculator'),
  'share text',
);

console.log('scrap-gold calculation.test.ts: all asserts passed');
