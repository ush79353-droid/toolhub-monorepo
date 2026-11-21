import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  averageAnnualInflationPercent,
  calculateCustomAdjusted,
  calculateHistoricalAdjusted,
  cumulativeInflationPercent,
  timePeriodToYears,
} from './calculation';
import {
  createCustomExampleInput,
  createDefaultInput,
  createEmptyInput,
  createHistoricalExampleInput,
} from './types';
import { validateInflationInput } from './validation';

describe('historical inflation math', () => {
  it('1000 × 260/200 = 1300', () => {
    assert.equal(calculateHistoricalAdjusted(1000, 200, 260), 1300);
  });

  it('table fixtures', () => {
    assert.equal(calculateHistoricalAdjusted(100, 100, 150), 150);
    assert.equal(calculateHistoricalAdjusted(500, 250, 200), 400);
    assert.equal(calculateHistoricalAdjusted(1000, 100, 100), 1000);
    assert.equal(calculateHistoricalAdjusted(2000, 200, 220), 2200);
  });

  it('cumulative 30%', () => {
    assert.ok(Math.abs(cumulativeInflationPercent(200, 260) - 30) < 1e-9);
  });

  it('annualized over 10 years', () => {
    const r = averageAnnualInflationPercent(200, 260, 10);
    assert.ok(r != null);
    assert.ok(Math.abs(r! - ((Math.pow(260 / 200, 0.1) - 1) * 100)) < 1e-9);
  });

  it('rejects bad CPI / negative amount', () => {
    assert.throws(() => calculateHistoricalAdjusted(-1, 100, 100));
    assert.throws(() => calculateHistoricalAdjusted(100, 0, 100));
  });
});

describe('custom compound inflation', () => {
  it('0% stays same', () => {
    const r = calculateCustomAdjusted(1000, 0, 5);
    assert.equal(r.adjustedAmount, 1000);
  });

  it('3% × 5y ≈ 1159.27', () => {
    const r = calculateCustomAdjusted(1000, 3, 5);
    assert.ok(Math.abs(r.adjustedAmount - 1159.2740743) < 0.01);
  });

  it('5% × 10y ≈ 1628.89', () => {
    const r = calculateCustomAdjusted(1000, 5, 10);
    assert.ok(Math.abs(r.adjustedAmount - 1628.8946267) < 0.01);
  });

  it('10% × 2y = 605', () => {
    const r = calculateCustomAdjusted(500, 10, 2);
    assert.ok(Math.abs(r.adjustedAmount - 605) < 1e-9);
  });

  it('-2% × 3y ≈ 941.19', () => {
    const r = calculateCustomAdjusted(1000, -2, 3);
    assert.ok(Math.abs(r.adjustedAmount - 941.192) < 0.01);
  });

  it('rejects r ≤ -100%', () => {
    assert.throws(() => calculateCustomAdjusted(1000, -100, 1));
    assert.throws(() => calculateCustomAdjusted(1000, -101, 1));
  });

  it('purchasing power factor 5% × 10y ≈ 0.6139', () => {
    const r = calculateCustomAdjusted(1, 5, 10);
    assert.ok(Math.abs(r.purchasingPowerFactor - 0.6139132535) < 1e-6);
  });

  it('time unit conversion', () => {
    assert.equal(timePeriodToYears(24, 'months'), 2);
    assert.equal(timePeriodToYears(8, 'quarters'), 2);
  });
});

describe('validateInflationInput', () => {
  it('default historical valid', () => {
    const v = validateInflationInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.dataMode, 'historical');
    assert.ok(v.result!.adjustedAmount > 0);
  });

  it('historical example 2000→2020', () => {
    const v = validateInflationInput(createHistoricalExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.chart.kind, 'historical-cpi');
  });

  it('custom example', () => {
    const v = validateInflationInput(createCustomExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(Math.abs(v.result!.adjustedAmount - 1159.27) < 0.01);
    assert.equal(v.result?.chart.kind, 'custom-projection');
  });

  it('quarterly blocked', () => {
    const input = createDefaultInput();
    input.frequency = 'quarterly';
    const v = validateInflationInput(input);
    assert.equal(v.isValid, false);
    assert.ok(v.errors.frequency);
  });

  it('empty invalid', () => {
    assert.equal(validateInflationInput(createEmptyInput()).isValid, false);
  });
});
