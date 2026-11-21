import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  bilateralMarketFromUsdLegs,
  calculateBilateralPPPRate,
  calculateMarketConvertedSalary,
  calculatePPPSalary,
  calculateRelativePriceLevel,
  toAnnualSalary,
} from './calculation';
import { getPppCountry } from './ppp-data';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validatePppInput } from './validation';

describe('ppp math', () => {
  it('PPP salary 100000', () => {
    assert.equal(
      calculatePPPSalary({ salary: 50000, sourcePPP: 1, targetPPP: 2 }),
      100000
    );
  });

  it('bilateral PPP rate 2', () => {
    assert.equal(
      calculateBilateralPPPRate({ sourcePPP: 1, targetPPP: 2 }),
      2
    );
  });

  it('market conversion 67500', () => {
    assert.equal(
      calculateMarketConvertedSalary({
        salary: 50000,
        marketExchangeRate: 1.35,
      }),
      67500
    );
  });

  it('relative price level 0.8', () => {
    assert.equal(
      calculateRelativePriceLevel({
        pppExchangeRate: 2,
        marketExchangeRate: 2.5,
      }),
      0.8
    );
  });

  it('monthly to annual', () => {
    assert.equal(toAnnualSalary(4000, 'monthly'), 48000);
  });

  it('zero PPP blocked', () => {
    assert.equal(
      calculatePPPSalary({ salary: 50000, sourcePPP: 0, targetPPP: 2 }),
      null
    );
  });

  it('same-country US dataset', () => {
    const v = validatePppInput({
      ...createDefaultInput(),
      sourceIso2: 'US',
      targetIso2: 'US',
      salary: '50000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.pppAdjustedSalary, 50000);
  });
});

describe('validatePppInput', () => {
  it('empty invalid', () => {
    assert.equal(validatePppInput(createEmptyInput()).isValid, false);
  });

  it('US→CA 2023 example', () => {
    const v = validatePppInput(createDefaultInput());
    assert.equal(v.isValid, true);
    const us = getPppCountry('US')!;
    const ca = getPppCountry('CA')!;
    const expected =
      50000 * (ca.ppp[2023]! / us.ppp[2023]!);
    assert.ok(v.result != null);
    assert.ok(Math.abs(v.result.pppAdjustedSalary - expected) < 1e-6);
  });

  it('manual example → 100000', () => {
    const v = validatePppInput(createExampleInput('manual'));
    assert.equal(v.isValid, true);
    assert.equal(v.result?.pppAdjustedSalary, 100000);
    assert.equal(v.result?.marketConvertedSalary, 67500);
  });

  it('rejects zero PPP', () => {
    const v = validatePppInput({
      ...createExampleInput('manual'),
      manualSourcePpp: '0',
    });
    assert.equal(v.isValid, false);
  });

  it('bilateral FX from USD legs', () => {
    assert.equal(bilateralMarketFromUsdLegs(1, 1.35), 1.35);
    assert.ok(
      Math.abs(bilateralMarketFromUsdLegs(0.8, 1.35)! - 1.35 / 0.8) < 1e-10
    );
  });
});
