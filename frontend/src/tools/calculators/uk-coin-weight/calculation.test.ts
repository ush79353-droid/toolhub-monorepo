import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateUkCoinWeightFromInput,
  formatMass,
  gramsToDisplay,
} from './calculation';
import { UK_COIN_MASS_GRAMS } from './constants';
import {
  createDefaultInput,
  createExampleInput,
  createEmptyInput,
  type UkCoinWeightInput,
} from './types';
import { validateUkCoinWeightInput } from './validation';

function base(patch: Partial<UkCoinWeightInput> = {}): UkCoinWeightInput {
  return { ...createExampleInput(), ...patch };
}

describe('uk coin weight', () => {
  it('Test 1: 100 of each → 5418 g', () => {
    const r = calculateUkCoinWeightFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.totalGrams, 5418);
    assert.ok(Math.abs(r.totalKilograms - 5.418) < 1e-12);
    assert.equal(formatMass(r.totalGrams, 'g', 4), '5,418 g');
  });

  it('Test 2: single 1p = 3.56 g', () => {
    const r = calculateUkCoinWeightFromInput(
      base({
        oneP: '1',
        twoP: '0',
        fiveP: '0',
        tenP: '0',
        twentyP: '0',
        fiftyP: '0',
        onePound: '0',
        twoPound: '0',
      }),
    );
    assert.ok(r);
    assert.equal(r.totalGrams, UK_COIN_MASS_GRAMS.oneP);
  });

  it('Test 3: unit switch preserves grams', () => {
    const g = calculateUkCoinWeightFromInput(base({ weightUnit: 'g' }));
    const kg = calculateUkCoinWeightFromInput(base({ weightUnit: 'kg' }));
    assert.ok(g && kg);
    assert.equal(g.totalGrams, kg.totalGrams);
    assert.equal(gramsToDisplay(g.totalGrams, 'kg'), kg.displayWeight);
  });

  it('Test 4: all zeros → 0 g', () => {
    const r = calculateUkCoinWeightFromInput(createDefaultInput());
    assert.ok(r);
    assert.equal(r.totalGrams, 0);
    assert.equal(r.totalCoins, 0);
  });

  it('Test 5: fractional count rejected', () => {
    const v = validateUkCoinWeightInput(base({ oneP: '1.5' }));
    assert.equal(v.isValid, false);
    assert.ok(v.errors.oneP);
  });

  it('Test 6: negative count rejected', () => {
    const v = validateUkCoinWeightInput(base({ twoP: '-1' }));
    assert.equal(v.isValid, false);
  });

  it('Test 7: blank fields invalid', () => {
    const v = validateUkCoinWeightInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('Test 8: £2 mass 12 g × 10 = 120 g', () => {
    const r = calculateUkCoinWeightFromInput(
      base({
        oneP: '0',
        twoP: '0',
        fiveP: '0',
        tenP: '0',
        twentyP: '0',
        fiftyP: '0',
        onePound: '0',
        twoPound: '10',
      }),
    );
    assert.ok(r);
    assert.equal(r.totalGrams, 120);
    assert.equal(r.formattedFaceValue, '£20.00');
  });
});
