/**
 * UK CGT engine self-check — run: npx tsx src/tools/calculators/capital-gains-tax-uk/calculation.test.ts
 * (from frontend/). Assert-based; no test framework.
 */

import assert from 'node:assert/strict';
import {
  calculateUkCapitalGainsTax,
  formatGbp,
  roundGbp,
} from './calculation';
import { validateCapitalGainsTaxUkInput } from './validation';
import { createExampleInput } from './types';

function approx(actual: number, expected: number, tol = 0.005) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

/** GOV.UK example 1 (2026/27). */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2026/27',
    capitalGains: 12_600,
    assetType: 'shares',
    assetsInTrust: false,
    annualIncome: 20_000,
    otherIncome: 0,
  });
  assert.ok(r);
  approx(r!.chargeableGains, 9600);
  approx(r!.capitalGainsTax, 1728);
  assert.equal(r!.formattedCapitalGainsTax, '1,728.00');
}

/** GOV.UK example 2 (2026/27). */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2026/27',
    capitalGains: 52_600,
    assetType: 'shares',
    assetsInTrust: false,
    annualIncome: 20_000,
    otherIncome: 0,
  });
  assert.ok(r);
  approx(r!.taxedAtBasic, 17_700);
  approx(r!.taxedAtHigher, 31_900);
  approx(r!.capitalGainsTax, 10_842);
}

/** Gains within AEA → £0 tax. */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2025/26',
    capitalGains: 3000,
    assetType: 'crypto',
    assetsInTrust: false,
    annualIncome: 50_000,
    otherIncome: 0,
  });
  assert.ok(r);
  approx(r!.capitalGainsTax, 0);
  approx(r!.chargeableGains, 0);
}

/** Higher-rate taxpayer: no basic room. */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2026/27',
    capitalGains: 13_000,
    assetType: 'property',
    assetsInTrust: false,
    annualIncome: 40_000,
    otherIncome: 0,
  });
  assert.ok(r);
  approx(r!.basicRateRoom, 0);
  approx(r!.chargeableGains, 10_000);
  approx(r!.capitalGainsTax, 2400);
}

/** Trustee: half AEA + flat 24%. */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2026/27',
    capitalGains: 10_000,
    assetType: 'other',
    assetsInTrust: true,
    annualIncome: 0,
    otherIncome: 0,
  });
  assert.ok(r);
  approx(r!.annualExemptAmount, 1500);
  approx(r!.chargeableGains, 8500);
  approx(r!.capitalGainsTax, 2040);
}

/** Other income adds to taxable income band usage. */
{
  const r = calculateUkCapitalGainsTax({
    taxYear: '2025/26',
    capitalGains: 8000,
    assetType: 'shares',
    assetsInTrust: false,
    annualIncome: 30_000,
    otherIncome: 5000,
  });
  assert.ok(r);
  approx(r!.totalAnnualIncome, 35_000);
  approx(r!.basicRateRoom, 2700);
  approx(r!.chargeableGains, 5000);
  // 2700@18% + 2300@24% = 486 + 552 = 1038
  approx(r!.capitalGainsTax, 1038);
}

/** Validation + example wiring. */
{
  const v = validateCapitalGainsTaxUkInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approx(v.result!.capitalGainsTax, 1728);
}

/** Reject negatives / blank. */
{
  const v = validateCapitalGainsTaxUkInput({
    ...createExampleInput(),
    capitalGains: '-1',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.capitalGains);
}

assert.equal(roundGbp(10.005), 10.01);
assert.equal(formatGbp(1728), '1,728.00');

console.log('capital-gains-tax-uk calculation.test.ts: ok');
