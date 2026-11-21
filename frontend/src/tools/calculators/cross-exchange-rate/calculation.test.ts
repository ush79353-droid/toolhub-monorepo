import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  areReciprocals,
  calculateCrossExchangeRate,
  calculateCrossRate,
  formatRate,
  reciprocal,
} from './calculation';
import { createExampleInput, type CrossExchangeRateInput } from './types';
import { validateCrossExchangeRateInput } from './validation';

function base(
  patch: Partial<CrossExchangeRateInput> = {},
): CrossExchangeRateInput {
  return { ...createExampleInput(), ...patch };
}

describe('cross exchange reciprocal helpers', () => {
  it('computes reciprocal of a positive rate', () => {
    assert.equal(reciprocal(2), 0.5);
    assert.equal(reciprocal(0.8), 1.25);
    assert.equal(reciprocal(0), null);
    assert.equal(reciprocal(-1), null);
  });

  it('detects matching reciprocals', () => {
    assert.equal(areReciprocals(1.25, 0.8), true);
    assert.equal(areReciprocals(2, 0.5), true);
    assert.equal(areReciprocals(1.1, 1.1), false);
  });
});

describe('cross rate formula', () => {
  it('Test 1: A/C 1.10, B/C 1.25 → A/B 0.88', () => {
    const cross = calculateCrossRate(1.1, 1.25);
    assert.ok(cross);
    assert.ok(Math.abs(cross.crossAB - 0.88) < 1e-12);
    assert.ok(Math.abs(cross.crossBA - 1 / 0.88) < 1e-12);

    const result = calculateCrossExchangeRate(createExampleInput());
    assert.ok(result);
    assert.ok(Math.abs(result.crossAB - 0.88) < 1e-12);
    assert.equal(result.pairASource, 'AC');
    assert.equal(result.pairBSource, 'BC');
  });

  it('Test 2: derive from C/A and C/B', () => {
    const result = calculateCrossExchangeRate(
      base({
        rateAC: '',
        rateCA: '0.9090909090909091',
        rateBC: '',
        rateCB: '0.8',
      }),
    );
    assert.ok(result);
    assert.ok(Math.abs(result.rateAC - 1.1) < 1e-9);
    assert.ok(Math.abs(result.rateBC - 1.25) < 1e-12);
    assert.ok(Math.abs(result.crossAB - 0.88) < 1e-9);
    assert.equal(result.pairASource, 'CA');
    assert.equal(result.pairBSource, 'CB');
  });

  it('Test 3: matching double entry accepted', () => {
    const result = calculateCrossExchangeRate(
      base({
        rateAC: '2',
        rateCA: '0.5',
        rateBC: '4',
        rateCB: '0.25',
      }),
    );
    assert.ok(result);
    assert.equal(result.crossAB, 0.5);
    assert.equal(result.crossBA, 2);
  });

  it('Test 4: rejects zero / negative / Infinity', () => {
    assert.equal(calculateCrossRate(0, 1.25), null);
    assert.equal(calculateCrossRate(1.1, -1), null);
    assert.equal(
      calculateCrossExchangeRate(base({ rateAC: '0', rateBC: '1' })),
      null,
    );
    assert.equal(
      calculateCrossExchangeRate(base({ rateAC: 'Infinity', rateBC: '1' })),
      null,
    );
  });

  it('Test 5: conflicting double entry rejected by validation', () => {
    const validation = validateCrossExchangeRateInput(
      base({ rateAC: '1.10', rateCA: '0.5', rateBC: '1.25', rateCB: '' }),
    );
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.rateAC || validation.errors.rateCA);
  });

  it('formats rates without grouping commas', () => {
    assert.equal(formatRate(0.88), '0.88');
    assert.equal(formatRate(1.1363636363636365).startsWith('1.13636'), true);
  });
});
