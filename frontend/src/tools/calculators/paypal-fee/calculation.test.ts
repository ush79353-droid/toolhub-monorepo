import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateEffectiveFeeRate,
  calculateNetAmount,
  calculatePayPalFee,
  calculatePayPalFeeFromInput,
  calculateRequiredGross,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  type PayPalFeeInput,
} from './types';
import { validatePayPalFeeInput } from './validation';
import { PAYPAL_PRESETS, US_FIXED_FEES } from './presets';

function approx(actual: number | null | undefined, expected: number, tol = 0.02) {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.ok(
    Math.abs(actual! - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

const usdConfig = {
  percentageFee: 3.49,
  fixedFee: 0.49,
  additionalPercentageFee: 0,
  currency: 'USD' as const,
};

describe('PayPal Fee Calculator engine', () => {
  it('basic fee: $100, 3.49% + $0.49 → $3.98', () => {
    const r = calculatePayPalFee(100, usdConfig);
    assert.ok(r);
    approx(r!.totalFee, 3.98);
    approx(r!.percentageFeeAmount, 3.49);
    approx(r!.fixedFeeAmount, 0.49);
  });

  it('basic net: $100 → $96.02', () => {
    approx(calculateNetAmount(100, usdConfig), 96.02);
  });

  it('reverse fee: net $100 → gross ≈ $104.12', () => {
    const gross = calculateRequiredGross(100, usdConfig);
    assert.ok(gross);
    approx(gross!, 104.12, 0.05);
    const fwd = calculatePayPalFee(gross!, usdConfig);
    assert.ok(fwd);
    assert.ok(fwd!.netAmount + 1e-9 >= 100);
  });

  it('zero fee: $100, 0% + $0 → net $100', () => {
    const r = calculatePayPalFee(100, {
      ...usdConfig,
      percentageFee: 0,
      fixedFee: 0,
    });
    assert.ok(r);
    approx(r!.totalFee, 0);
    approx(r!.netAmount, 100);
  });

  it('fixed only: $100, 0% + $0.50 → net $99.50', () => {
    const r = calculatePayPalFee(100, {
      ...usdConfig,
      percentageFee: 0,
      fixedFee: 0.5,
    });
    assert.ok(r);
    approx(r!.netAmount, 99.5);
  });

  it('percentage only: $100, 5% + $0 → fee $5', () => {
    const r = calculatePayPalFee(100, {
      ...usdConfig,
      percentageFee: 5,
      fixedFee: 0,
    });
    assert.ok(r);
    approx(r!.totalFee, 5);
  });

  it('international example: $200, 3.49%+1.50% + $0.49 → fee $10.47', () => {
    const r = calculatePayPalFee(200, {
      percentageFee: 3.49,
      fixedFee: 0.49,
      additionalPercentageFee: 1.5,
      currency: 'USD',
    });
    assert.ok(r);
    approx(r!.totalFee, 10.47);
    approx(r!.netAmount, 189.53);
  });

  it('small transaction: $10, 3.49% + $0.49 → fee $0.84', () => {
    const r = calculatePayPalFee(10, usdConfig);
    assert.ok(r);
    approx(r!.totalFee, 0.84);
    approx(r!.netAmount, 9.16);
  });

  it('effective fee rate', () => {
    approx(calculateEffectiveFeeRate(100, 3.98), 3.98);
    assert.equal(calculateEffectiveFeeRate(0, 1), null);
  });

  it('negative payment fails validation', () => {
    const input: PayPalFeeInput = {
      ...createExampleInput(),
      grossAmount: '-100',
    };
    const v = validatePayPalFeeInput(input);
    assert.ok(v.errors.grossAmount);
    assert.equal(v.result, null);
  });

  it('100% fee blocks reverse mode', () => {
    const input: PayPalFeeInput = {
      ...createDefaultInput(),
      region: 'CUSTOM',
      transactionType: 'custom',
      solveMode: 'fromNet',
      desiredNet: '100',
      customPercentage: '100',
      customFixed: '0',
      customAdditional: '0',
    };
    const v = validatePayPalFeeInput(input);
    assert.equal(v.result, null);
    assert.ok(
      v.errors.customPercentage || v.errors.form,
      'expected reverse validation error',
    );
  });

  it('empty amount yields no result', () => {
    const v = validatePayPalFeeInput(createDefaultInput());
    assert.equal(v.result, null);
  });

  it('example input matches Omni reference', () => {
    const r = calculatePayPalFeeFromInput(createExampleInput());
    assert.ok(r);
    approx(r!.totalFee, 3.98);
    approx(r!.netAmount, 96.02);
    assert.equal(r!.excludesCurrencyConversion, true);
  });

  it('clear/reload helpers', () => {
    assert.equal(createEmptyInput().grossAmount, '');
    assert.equal(createExampleInput().grossAmount, '100');
  });

  it('US fixed fee table includes USD 0.49', () => {
    assert.equal(US_FIXED_FEES.USD, 0.49);
  });

  it('all presets are verified with sources', () => {
    for (const p of PAYPAL_PRESETS) {
      assert.ok(p.verified);
      assert.ok(p.sourceUrl.startsWith('https://'));
      assert.ok(p.effectiveDate);
    }
  });

  it('UK commercial domestic from input', () => {
    const input: PayPalFeeInput = {
      ...createDefaultInput(),
      region: 'UK',
      presetId: 'uk-other',
      transactionType: 'uk_other_commercial',
      currency: 'GBP',
      location: 'domestic',
      grossAmount: '100',
    };
    const r = calculatePayPalFeeFromInput(input);
    assert.ok(r);
    // 2.9% of 100 + 0.30 = 3.20
    approx(r!.totalFee, 3.2);
    approx(r!.netAmount, 96.8);
  });

  it('goods & services US has no fixed fee', () => {
    const input: PayPalFeeInput = {
      ...createExampleInput(),
      presetId: 'us-goods-services',
      transactionType: 'goods_and_services',
      grossAmount: '100',
    };
    const r = calculatePayPalFeeFromInput(input);
    assert.ok(r);
    approx(r!.fixedFeeAmount, 0);
    approx(r!.totalFee, 2.99);
  });

  it('no NaN/Infinity on reverse with high fee', () => {
    assert.equal(
      calculateRequiredGross(100, {
        percentageFee: 100,
        fixedFee: 0,
        additionalPercentageFee: 0,
        currency: 'USD',
      }),
      null,
    );
  });
});
