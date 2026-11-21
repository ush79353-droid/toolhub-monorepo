import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateTransferFee,
  requiredPaymentForPromoPayoff,
  resolveNewStartingBalance,
  simulateBalanceTransferCard,
  simulateFixedRateCard,
} from './calculation';
import { createDefaultInput } from './types';
import { validateBalanceTransferInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 0.02) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('transfer fee & starting balance', () => {
  it('3% of 10000 = 300', () => {
    nearly(calculateTransferFee(10000, 3, 'percentage'), 300, 1e-9);
  });

  it('financed fee → 10300', () => {
    const s = resolveNewStartingBalance(10000, 300, 'financed')!;
    nearly(s.interestBearing, 10300, 1e-9);
    nearly(s.upfrontFee, 0, 1e-9);
  });

  it('upfront fee → 10000 bearing + 300 upfront', () => {
    const s = resolveNewStartingBalance(10000, 300, 'upfront')!;
    nearly(s.interestBearing, 10000, 1e-9);
    nearly(s.upfrontFee, 300, 1e-9);
  });

  it('zero fee', () => {
    nearly(calculateTransferFee(5000, 0, 'percentage'), 0, 1e-9);
  });
});

describe('promotional simulation', () => {
  it('0% promo 18 months leaves 1300', () => {
    const sim = simulateBalanceTransferCard({
      newStartingBalance: 10300,
      promotionalApr: 0,
      promotionalMonths: 18,
      regularApr: 22,
      monthlyPayment: 500,
    })!;
    nearly(sim.remainingAfterPromotion, 1300, 0.5);
  });

  it('paid off during promo', () => {
    const sim = simulateBalanceTransferCard({
      newStartingBalance: 6000,
      promotionalApr: 0,
      promotionalMonths: 12,
      regularApr: 24,
      monthlyPayment: 500,
    })!;
    nearly(sim.remainingAfterPromotion, 0, 0.5);
    nearly(sim.newCard.interestAfterPromo, 0, 1e-6);
  });

  it('required payment at 0%', () => {
    nearly(requiredPaymentForPromoPayoff(10300, 0, 18), 10300 / 18, 1e-6);
  });
});

describe('insufficient payment', () => {
  it('warns never pays off', () => {
    const sim = simulateFixedRateCard(10000, 24, 100)!;
    assert.equal(sim.neverPaysOff, true);
    assert.equal(sim.months, null);
  });
});

describe('post-promotional interest', () => {
  it('0% for 6 months then 24%', () => {
    const sim = simulateBalanceTransferCard({
      newStartingBalance: 10000,
      promotionalApr: 0,
      promotionalMonths: 6,
      regularApr: 24,
      monthlyPayment: 500,
    })!;
    nearly(sim.newCard.interestDuringPromo, 0, 1e-6);
    assert.ok(sim.remainingAfterPromotion! > 0);
    assert.ok(sim.newCard.interestAfterPromo > 0);
  });
});

describe('validateBalanceTransferInput', () => {
  it('example transfer with 3% fee', () => {
    const { result, isValid } = validateBalanceTransferInput({
      ...createDefaultInput(),
      currentBalance: '10000',
      oldApr: '24',
      monthlyPayment: '500',
      transferAmount: '10000',
      transferFee: '3',
      transferFeeType: 'percentage',
      promotionalApr: '0',
      promotionalMonths: '18',
      regularApr: '22',
      feeTreatment: 'financed',
    });
    assert.equal(isValid, true);
    nearly(result!.transferFeeAmount!, 300, 1e-6);
    nearly(result!.newStartingBalance!, 10300, 1e-6);
    nearly(result!.remainingBalanceAfterPromotion!, 1300, 1);
  });

  it('rejects transfer > balance', () => {
    const { result, errors } = validateBalanceTransferInput({
      ...createDefaultInput(),
      currentBalance: '5000',
      oldApr: '20',
      monthlyPayment: '200',
      transferAmount: '6000',
      transferFee: '0',
      promotionalMonths: '12',
      regularApr: '20',
    });
    assert.equal(result, null);
    assert.ok(errors.transferAmount);
  });

  it('rejects zero balance', () => {
    const { result, errors } = validateBalanceTransferInput({
      ...createDefaultInput(),
      currentBalance: '0',
      oldApr: '20',
      monthlyPayment: '200',
      promotionalMonths: '12',
      regularApr: '20',
    });
    assert.equal(result, null);
    assert.ok(errors.currentBalance);
  });

  it('empty → no result', () => {
    assert.equal(
      validateBalanceTransferInput(createDefaultInput()).result,
      null
    );
  });
});
