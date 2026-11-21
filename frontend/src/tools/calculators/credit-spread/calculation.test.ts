import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  basisPointsToPercentagePoints,
  calculateCorporateBondYield,
  calculateCreditSpread,
  calculateCreditSpreadFromYields,
  calculateGovernmentBondYield,
  percentagePointsToBasisPoints,
  spreadToPercentagePoints,
} from './calculation';
import { createExampleInput, type CreditSpreadInput } from './types';
import { validateCreditSpreadInput } from './validation';

function base(
  patch: Partial<CreditSpreadInput> = {},
): CreditSpreadInput {
  return { ...createExampleInput(), ...patch };
}

describe('credit spread conversions', () => {
  it('converts percentage points ↔ basis points', () => {
    assert.equal(percentagePointsToBasisPoints(3.5), 350);
    assert.equal(basisPointsToPercentagePoints(350), 3.5);
    assert.equal(spreadToPercentagePoints(150, 'basisPoints'), 1.5);
    assert.equal(spreadToPercentagePoints(1.5, 'percentagePoints'), 1.5);
    assert.equal(percentagePointsToBasisPoints(0.25), 25);
    assert.equal(percentagePointsToBasisPoints(5), 500);
  });
});

describe('credit spread forward formula', () => {
  it('Test 1: positive spread 5.30 − 1.80 = 3.50 pp / 350 bps', () => {
    const calc = calculateCreditSpreadFromYields(5.3, 1.8);
    assert.ok(calc);
    assert.equal(calc.spreadPercentagePoints, 3.5);
    assert.equal(calc.spreadBasisPoints, 350);

    const result = calculateCreditSpread(createExampleInput());
    assert.ok(result);
    assert.equal(result.spreadPercentagePoints, 3.5);
    assert.equal(result.spreadBasisPoints, 350);
    assert.equal(result.signLabel, 'positive');
  });

  it('Test 2: narrow spread 4.25 − 3.75 = 0.50 pp / 50 bps', () => {
    const calc = calculateCreditSpreadFromYields(4.25, 3.75);
    assert.ok(calc);
    assert.equal(calc.spreadPercentagePoints, 0.5);
    assert.equal(calc.spreadBasisPoints, 50);
  });

  it('Test 3: zero spread', () => {
    const calc = calculateCreditSpreadFromYields(4, 4);
    assert.ok(calc);
    assert.equal(calc.spreadPercentagePoints, 0);
    assert.equal(calc.spreadBasisPoints, 0);
    const result = calculateCreditSpread(
      base({ corporateBondYield: '4', governmentBondYield: '4' }),
    );
    assert.ok(result);
    assert.equal(result.signLabel, 'zero');
  });

  it('Test 4: negative spread 2.50 − 3.00 = −0.50 pp / −50 bps', () => {
    const calc = calculateCreditSpreadFromYields(2.5, 3);
    assert.ok(calc);
    assert.equal(calc.spreadPercentagePoints, -0.5);
    assert.equal(calc.spreadBasisPoints, -50);
    const result = calculateCreditSpread(
      base({ corporateBondYield: '2.50', governmentBondYield: '3' }),
    );
    assert.ok(result);
    assert.equal(result.signLabel, 'negative');
  });
});

describe('credit spread reverse solves', () => {
  it('Test 5: corporate yield from gov 2% + 150 bps = 3.50%', () => {
    assert.equal(calculateCorporateBondYield(2, 1.5), 3.5);
    const result = calculateCreditSpread(
      base({
        solveTarget: 'corporateYield',
        governmentBondYield: '2',
        creditSpread: '150',
        spreadInputUnit: 'basisPoints',
        corporateBondYield: '',
      }),
    );
    assert.ok(result);
    assert.equal(result.corporateBondYield, 3.5);
    assert.equal(result.spreadBasisPoints, 150);
  });

  it('Test 6: government yield from corp 6% − 200 bps = 4.00%', () => {
    assert.equal(calculateGovernmentBondYield(6, 2), 4);
    const result = calculateCreditSpread(
      base({
        solveTarget: 'governmentYield',
        corporateBondYield: '6',
        creditSpread: '200',
        spreadInputUnit: 'basisPoints',
        governmentBondYield: '',
      }),
    );
    assert.ok(result);
    assert.equal(result.governmentBondYield, 4);
    assert.equal(result.spreadBasisPoints, 200);
  });

  it('Test 7: 250 bps → 2.50 percentage points', () => {
    assert.equal(basisPointsToPercentagePoints(250), 2.5);
  });
});

describe('credit spread invalid inputs', () => {
  it('rejects blank, NaN, Infinity, and overflow', () => {
    assert.equal(
      validateCreditSpreadInput(
        base({ corporateBondYield: '', governmentBondYield: '1.8' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateCreditSpreadInput(
        base({ corporateBondYield: 'abc', governmentBondYield: '1.8' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateCreditSpreadInput(
        base({ corporateBondYield: 'NaN', governmentBondYield: '1.8' }),
      ).isValid,
      false,
    );
    assert.equal(
      validateCreditSpreadInput(
        base({
          corporateBondYield: 'Infinity',
          governmentBondYield: '1.8',
        }),
      ).isValid,
      false,
    );
    assert.equal(
      calculateCreditSpreadFromYields(Number.POSITIVE_INFINITY, 1),
      null,
    );
    assert.equal(calculateCorporateBondYield(NaN, 1), null);
    assert.equal(calculateGovernmentBondYield(1, Infinity), null);
    assert.equal(
      validateCreditSpreadInput(
        base({
          corporateBondYield: '1e20',
          governmentBondYield: '1',
        }),
      ).isValid,
      false,
    );
  });

  it('allows negative yields when finite', () => {
    const result = calculateCreditSpread(
      base({ corporateBondYield: '-0.25', governmentBondYield: '-0.50' }),
    );
    assert.ok(result);
    assert.equal(result.spreadPercentagePoints, 0.25);
    assert.equal(result.spreadBasisPoints, 25);
  });
});
