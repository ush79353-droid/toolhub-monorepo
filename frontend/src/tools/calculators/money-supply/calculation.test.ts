import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateM0,
  calculateM1,
  calculateM2,
  calculateMonetaryBase,
  calculateMoneySupplyBundle,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateMoneySupplyInput } from './validation';

describe('money supply math', () => {
  it('M0 notes+coins', () => {
    assert.equal(calculateM0(2_050_000, 50_000), 2_100_000);
  });

  it('monetary base', () => {
    assert.equal(calculateMonetaryBase(2_100_000, 4_050_000), 6_150_000);
  });

  it('M1 reference nonoverlapping', () => {
    assert.equal(
      calculateM1({
        currency: 2_100_000,
        demandDeposits: 4_000_000,
        travelersChecks: 1_000,
        otherCheckableDeposits: 4_000_000,
        savingsDeposits: 11_400_000,
      }),
      21_501_000
    );
  });

  it('M2 from M1 + MMF + time', () => {
    assert.equal(calculateM2(21_501_000, 500_000, 640_000), 22_641_000);
  });

  it('example bundle textbook', () => {
    const b = calculateMoneySupplyBundle({
      definition: 'textbook',
      currency: 'USD',
      magnitude: 'units',
      federalReserveNotes: 2_050_000,
      coins: 50_000,
      currencyInCirculation: 2_100_000,
      reserveBalances: 4_050_000,
      demandDeposits: 4_000_000,
      travelersChecks: 1_000,
      otherCheckableDeposits: 4_000_000,
      savingsDeposits: 11_400_000,
      eligibleMoneyMarketFunds: 500_000,
      eligibleTimeDeposits: 640_000,
      largeTimeDeposits: 2_000_000,
      institutionalMoneyMarketFunds: 800_000,
      otherLiquidInstruments: 500_000,
    });
    assert.equal(b.m0, 2_100_000);
    assert.equal(b.monetaryBase, 6_150_000);
    assert.equal(b.m1, 21_501_000);
    assert.equal(b.m2, 22_641_000);
    assert.equal(b.m3, 22_641_000 + 2_000_000 + 800_000);
    assert.equal(b.m4, b.m3! + 500_000);
    assert.ok(b.mzm != null);
  });

  it('us-fed hides M3/M4', () => {
    const b = calculateMoneySupplyBundle({
      definition: 'us-fed',
      currency: 'USD',
      magnitude: 'units',
      federalReserveNotes: 2_050_000,
      coins: 50_000,
      currencyInCirculation: 2_100_000,
      reserveBalances: 4_050_000,
      demandDeposits: 4_000_000,
      travelersChecks: 1_000,
      otherCheckableDeposits: 4_000_000,
      savingsDeposits: 11_400_000,
      eligibleMoneyMarketFunds: 500_000,
      eligibleTimeDeposits: 640_000,
      largeTimeDeposits: 0,
      institutionalMoneyMarketFunds: 0,
      otherLiquidInstruments: 0,
    });
    assert.equal(b.m3, null);
    assert.equal(b.m4, null);
    assert.ok(b.m3UnavailableReason);
    assert.ok(b.m4UnavailableReason);
  });

  it('magnitude millions scales', () => {
    const b = calculateMoneySupplyBundle({
      definition: 'textbook',
      currency: 'USD',
      magnitude: 'millions',
      federalReserveNotes: 2.05,
      coins: 0.05,
      currencyInCirculation: 2.1,
      reserveBalances: 4.05,
      demandDeposits: 4,
      travelersChecks: 0.001,
      otherCheckableDeposits: 4,
      savingsDeposits: 11.4,
      eligibleMoneyMarketFunds: 0.5,
      eligibleTimeDeposits: 0.64,
      largeTimeDeposits: 0,
      institutionalMoneyMarketFunds: 0,
      otherLiquidInstruments: 0,
    });
    assert.equal(b.m0, 2_100_000);
    assert.equal(b.m1, 21_501_000);
  });
});

describe('validateMoneySupplyInput', () => {
  it('empty invalid', () => {
    assert.equal(validateMoneySupplyInput(createEmptyInput()).isValid, false);
    assert.equal(validateMoneySupplyInput(createDefaultInput()).isValid, false);
  });

  it('example → expected aggregates', () => {
    const v = validateMoneySupplyInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.m0, 2_100_000);
    assert.equal(v.result?.monetaryBase, 6_150_000);
    assert.equal(v.result?.m1, 21_501_000);
    assert.equal(v.result?.m2, 22_641_000);
  });

  it('rejects negatives', () => {
    assert.equal(
      validateMoneySupplyInput({
        ...createExampleInput(),
        coins: '-1',
      }).isValid,
      false
    );
  });

  it('us-fed example without broad fields', () => {
    const v = validateMoneySupplyInput({
      ...createExampleInput(),
      definition: 'us-fed',
      largeTimeDeposits: '',
      institutionalMoneyMarketFunds: '',
      otherLiquidInstruments: '',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.m3, null);
    assert.equal(v.result?.formattedM3, 'Unavailable');
  });
});
