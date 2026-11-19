import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ANNUITY_PAYMENT_COUNT,
  calculateFirstAnnuityPayment,
  calculateLumpSum,
  calculateMegaMillionsPayout,
  generateGrossAnnuityPayments,
} from './calculation';
import { calculateFederalIncomeTax } from './tax/federal';
import { calculateStateIncomeTax, getStateTaxKind } from './tax/state';
import { validateMegaMillionsPayoutInput } from './validation';
import { createBlankInput, createDefaultInput } from './types';

describe('mega millions lump sum', () => {
  it('applies payout percentage to advertised jackpot', () => {
    assert.equal(calculateLumpSum(201_000_000, 52), 104_520_000);
  });

  it('updates when percentage changes', () => {
    assert.equal(calculateLumpSum(201_000_000, 40), 80_400_000);
    assert.equal(calculateLumpSum(201_000_000, 60), 120_600_000);
  });
});

describe('mega millions annuity', () => {
  it('matches geometric first-payment formula at 5%', () => {
    const jackpot = 201_000_000;
    const g = 0.05;
    const expected =
      (jackpot * g) / (Math.pow(1 + g, ANNUITY_PAYMENT_COUNT) - 1);
    const actual = calculateFirstAnnuityPayment(
      jackpot,
      g,
      ANNUITY_PAYMENT_COUNT,
    );
    assert.ok(actual !== null);
    assert.ok(Math.abs(actual! - expected) < 1e-6);
  });

  it('grows each payment by the annuity rate', () => {
    const payments = generateGrossAnnuityPayments(201_000_000, 0.05, 30);
    assert.ok(payments);
    assert.ok(Math.abs(payments![1]! - payments![0]! * 1.05) < 1e-4);
    assert.ok(Math.abs(payments![2]! - payments![1]! * 1.05) < 1e-4);
  });

  it('sums to the advertised jackpot', () => {
    const payments = generateGrossAnnuityPayments(201_000_000, 0.05, 30);
    assert.ok(payments);
    const total = payments!.reduce((sum, p) => sum + p, 0);
    assert.ok(Math.abs(total - 201_000_000) < 0.01);
  });

  it('divides equally when growth is zero', () => {
    const first = calculateFirstAnnuityPayment(201_000_000, 0, 30);
    assert.equal(first, 201_000_000 / 30);
    const payments = generateGrossAnnuityPayments(201_000_000, 0, 30);
    assert.ok(payments);
    assert.ok(payments!.every((p) => Math.abs(p - 201_000_000 / 30) < 1e-6));
  });
});

describe('federal tax', () => {
  it('uses progressive brackets for all filing statuses', () => {
    const statuses = [
      'single',
      'married_jointly',
      'married_separately',
      'head_of_household',
      'qualifying_surviving_spouse',
    ] as const;

    for (const status of statuses) {
      const low = calculateFederalIncomeTax(50_000, status, 2025);
      const high = calculateFederalIncomeTax(10_000_000, status, 2025);
      assert.equal(low.available, true);
      assert.equal(high.available, true);
      assert.ok(high.tax > low.tax);
      // Not a flat 37% on the entire amount.
      assert.ok(high.tax < 10_000_000 * 0.37);
      assert.ok(high.tax > 10_000_000 * 0.3);
    }
  });

  it('rejects unsupported tax years without inventing precision', () => {
    const result = calculateFederalIncomeTax(100_000, 'single', 1999);
    assert.equal(result.available, false);
    assert.equal(result.tax, 0);
  });
});

describe('state tax', () => {
  it('returns zero for no-income-tax states', () => {
    for (const state of ['FL', 'TX', 'WA', 'NV', 'AK'] as const) {
      assert.equal(getStateTaxKind(state), 'none');
      const tax = calculateStateIncomeTax(5_000_000, state, 'single', 2025);
      assert.equal(tax.tax, 0);
      assert.equal(tax.available, true);
    }
  });

  it('applies flat rates', () => {
    const il = calculateStateIncomeTax(1_000_000, 'IL', 'single', 2025);
    assert.ok(Math.abs(il.tax - 49_500) < 0.01);
  });

  it('applies progressive rates for California and DC', () => {
    const ca = calculateStateIncomeTax(1_000_000, 'CA', 'single', 2025);
    const dc = calculateStateIncomeTax(1_000_000, 'DC', 'single', 2025);
    assert.ok(ca.tax > 0);
    assert.ok(dc.tax > 0);
    assert.ok(ca.tax > calculateStateIncomeTax(50_000, 'CA', 'single', 2025).tax);
  });
});

describe('mega millions payout comparison', () => {
  it('taxes lump sum once and annuity per payment', () => {
    const result = calculateMegaMillionsPayout({
      jackpot: 201_000_000,
      annuityRatePercent: 5,
      filingStatus: 'single',
      state: 'FL',
      lumpSumPercent: 52,
    });
    assert.ok(result);
    assert.equal(result!.grossLumpSum, 104_520_000);
    assert.equal(result!.annuitySchedule.length, 30);
    assert.ok(
      Math.abs(
        result!.annuitySchedule.reduce((s, r) => s + r.grossPayment, 0) -
          201_000_000,
      ) < 0.01,
    );
    assert.ok(
      Math.abs(
        result!.lumpSum.netPayout -
          (result!.lumpSum.grossPayout - result!.lumpSum.totalTax),
      ) < 0.01,
    );
    assert.ok(
      Math.abs(
        result!.annuity.netPayout -
          (result!.annuity.grossPayout - result!.annuity.totalTax),
      ) < 0.01,
    );
    // Annuity federal tax is sum of per-payment taxes, not one tax on jackpot.
    const scheduleFederal = result!.annuitySchedule.reduce(
      (s, r) => s + r.federalTax,
      0,
    );
    assert.ok(Math.abs(scheduleFederal - result!.annuity.federalTax) < 0.01);
    const oneShotOnJackpot = calculateFederalIncomeTax(
      201_000_000,
      'single',
      2025,
    ).tax;
    assert.notEqual(result!.annuity.federalTax, oneShotOnJackpot);
  });
});

describe('validation', () => {
  it('rejects invalid inputs', () => {
    const negative = validateMegaMillionsPayoutInput({
      ...createDefaultInput(),
      jackpot: '-1',
    });
    assert.equal(negative.isValid, false);
    assert.ok(negative.errors.jackpot);

    const badPct = validateMegaMillionsPayoutInput({
      ...createDefaultInput(),
      lumpSumPercent: '120',
    });
    assert.equal(badPct.isValid, false);
    assert.ok(badPct.errors.lumpSumPercent);

    const missingState = validateMegaMillionsPayoutInput({
      ...createDefaultInput(),
      state: '',
    });
    assert.equal(missingState.isValid, false);
    assert.ok(missingState.errors.state);

    const blank = validateMegaMillionsPayoutInput(createBlankInput());
    assert.equal(blank.incomplete, true);
    assert.equal(blank.isValid, false);
  });

  it('accepts the default example', () => {
    const ok = validateMegaMillionsPayoutInput(createDefaultInput());
    assert.equal(ok.isValid, true);
    assert.ok(ok.result);
    assert.equal(ok.result!.grossLumpSum, 104_520_000);
  });
});
