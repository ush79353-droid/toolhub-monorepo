import assert from 'node:assert/strict';
import { calculateCarLease } from './calculation';

// Guide example: MSRP 50k, negotiated 48k, 36 mo, 5% tax, 58% residual, MF 0.001
{
  const result = calculateCarLease({
    msrp: 50_000,
    negotiatedPrice: 48_000,
    leaseTermMonths: 36,
    salesTaxPercent: 5,
    residualFactorPercent: 58,
    moneyFactor: 0.001,
    dealerFee: 0,
    registrationFee: 0,
    downPayment: 0,
    tradeInValue: 0,
    otherReductions: 0,
  });
  assert.ok(result);
  assert.equal(result.residualValue, 29_000);
  assert.equal(result.netCapitalizedCost, 48_000);
  assert.ok(Math.abs(result.monthlyDepreciation - 19_000 / 36) < 1e-9);
  assert.equal(result.monthlyLeaseFee, 77);
  assert.ok(Math.abs(result.monthlyBasePayment - (19_000 / 36 + 77)) < 1e-9);
  assert.ok(
    Math.abs(result.monthlySalesTax - result.monthlyBasePayment * 0.05) < 1e-9
  );
  assert.ok(
    Math.abs(
      result.monthlyLeasePayment -
        (result.monthlyBasePayment + result.monthlySalesTax)
    ) < 1e-9
  );
}

// Fees financed; reductions subtracted once
{
  const result = calculateCarLease({
    msrp: 40_000,
    negotiatedPrice: 38_000,
    leaseTermMonths: 24,
    salesTaxPercent: 0,
    residualFactorPercent: 50,
    moneyFactor: 0,
    dealerFee: 500,
    registrationFee: 200,
    downPayment: 1_000,
    tradeInValue: 2_000,
    otherReductions: 300,
  });
  assert.ok(result);
  assert.equal(result.residualValue, 20_000);
  assert.equal(result.netCapitalizedCost, 35_400);
  assert.equal(result.monthlyLeaseFee, 0);
  assert.equal(result.monthlySalesTax, 0);
  assert.equal(result.monthlyLeasePayment, result.monthlyBasePayment);
}

// Unsupported: residual above net cap → negative depreciation
{
  const result = calculateCarLease({
    msrp: 50_000,
    negotiatedPrice: 20_000,
    leaseTermMonths: 36,
    salesTaxPercent: 5,
    residualFactorPercent: 58,
    moneyFactor: 0.001,
    dealerFee: 0,
    registrationFee: 0,
    downPayment: 0,
    tradeInValue: 0,
    otherReductions: 0,
  });
  assert.equal(result, null);
}

// Reject non-positive term
{
  assert.equal(
    calculateCarLease({
      msrp: 10_000,
      negotiatedPrice: 10_000,
      leaseTermMonths: 0,
      salesTaxPercent: 0,
      residualFactorPercent: 50,
      moneyFactor: 0,
      dealerFee: 0,
      registrationFee: 0,
      downPayment: 0,
      tradeInValue: 0,
      otherReductions: 0,
    }),
    null
  );
}

console.log('car-lease calculation.test.ts: all assertions passed');
