import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateComparativeAdvantage,
  compareOpportunityCosts,
  opportunityCostOfA,
  opportunityCostOfB,
  termsOfTradeIntervalForA,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateComparativeAdvantageInput } from './validation';

describe('opportunity costs', () => {
  it('X: 80/100=0.8 and 100/80=1.25', () => {
    assert.equal(opportunityCostOfA(100, 80), 0.8);
    assert.equal(opportunityCostOfB(100, 80), 1.25);
  });

  it('Y: 90/90=1', () => {
    assert.equal(opportunityCostOfA(90, 90), 1);
    assert.equal(opportunityCostOfB(90, 90), 1);
  });

  it('rejects zero / negative', () => {
    assert.equal(opportunityCostOfA(0, 80), null);
    assert.equal(opportunityCostOfA(-1, 80), null);
  });

  it('reciprocal consistency', () => {
    const a = opportunityCostOfA(100, 80)!;
    const b = opportunityCostOfB(100, 80)!;
    assert.ok(Math.abs(a * b - 1) < 1e-12);
  });
});

describe('calculateComparativeAdvantage — reference example', () => {
  it('X→A, Y→B; absolute X A, Y B', () => {
    const r = calculateComparativeAdvantage(100, 80, 90, 90);
    assert.ok(r);
    assert.equal(r.ocXA, 0.8);
    assert.equal(r.ocXB, 1.25);
    assert.equal(r.ocYA, 1);
    assert.equal(r.ocYB, 1);
    assert.equal(r.comparativeA, 'countryX');
    assert.equal(r.comparativeB, 'countryY');
    assert.equal(r.absoluteA, 'countryX');
    assert.equal(r.absoluteB, 'countryY');
    assert.equal(r.specializeX, 'goodA');
    assert.equal(r.specializeY, 'goodB');
  });

  it('swapped relative productivities', () => {
    const r = calculateComparativeAdvantage(80, 100, 90, 90);
    assert.ok(r);
    assert.equal(r.comparativeA, 'countryY');
    assert.equal(r.comparativeB, 'countryX');
  });

  it('equal opportunity costs → tie', () => {
    const r = calculateComparativeAdvantage(50, 50, 100, 100);
    assert.ok(r);
    assert.equal(r.comparativeA, 'tie');
    assert.equal(r.comparativeB, 'tie');
    assert.equal(r.termsOfTrade, null);
  });

  it('absolute advantage both goods for X', () => {
    const r = calculateComparativeAdvantage(100, 100, 50, 40);
    assert.ok(r);
    assert.equal(r.absoluteA, 'countryX');
    assert.equal(r.absoluteB, 'countryX');
    // Still only one comparative per good when OCs differ
    assert.notEqual(r.comparativeA, 'tie');
  });

  it('terms of trade interval', () => {
    const t = termsOfTradeIntervalForA(0.8, 1);
    assert.ok(t);
    assert.equal(t.low, 0.8);
    assert.equal(t.high, 1);
  });

  it('floating-point near-equality → tie', () => {
    assert.equal(compareOpportunityCosts(1, 1 + 1e-15), 'tie');
  });

  it('decimals and large/small', () => {
    const r = calculateComparativeAdvantage(0.001, 0.002, 1000, 1500);
    assert.ok(r);
    assert.ok(Number.isFinite(r.ocXA));
  });
});

describe('validateComparativeAdvantageInput', () => {
  it('empty → invalid', () => {
    assert.equal(
      validateComparativeAdvantageInput(createEmptyInput()).isValid,
      false
    );
    assert.equal(
      validateComparativeAdvantageInput(createDefaultInput()).isValid,
      false
    );
  });

  it('example → expected advantages', () => {
    const v = validateComparativeAdvantageInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.comparativeA, 'countryX');
    assert.equal(v.result.comparativeB, 'countryY');
    assert.equal(v.result.labelCompXA, 'Comparative Advantage');
    assert.equal(v.result.labelCompYB, 'Comparative Advantage');
    assert.ok(v.result.ppf.xAMax === 100);
  });

  it('zero input rejected', () => {
    const input = createExampleInput();
    input.countryXGoodA = '0';
    assert.equal(validateComparativeAdvantageInput(input).isValid, false);
  });

  it('negative rejected', () => {
    const input = createExampleInput();
    input.countryYGoodB = '-5';
    assert.equal(validateComparativeAdvantageInput(input).isValid, false);
  });

  it('invalid string', () => {
    const input = createExampleInput();
    input.countryXGoodA = 'abc';
    assert.equal(validateComparativeAdvantageInput(input).isValid, false);
  });
});
