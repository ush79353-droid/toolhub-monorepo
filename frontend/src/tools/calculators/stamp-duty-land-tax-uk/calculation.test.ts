/**
 * SDLT UK engine self-check — run:
 * npx tsx src/tools/calculators/stamp-duty-land-tax-uk/calculation.test.ts
 * (from frontend/). Assert-based; no test framework.
 */

import assert from 'node:assert/strict';
import {
  calculateStampDutyLandTaxUk,
  formatGbp,
  roundGbp,
} from './calculation';
import { validateStampDutyLandTaxUkInput } from './validation';
import { createExampleInput } from './types';

function approx(actual: number, expected: number, tol = 0.005) {
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected}, got ${actual}`,
  );
}

/** GOV.UK standard example: £295,000 → £4,750. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'moving_home',
    residency: 'uk',
    propertyPrice: 295_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 4750);
  assert.equal(r!.formattedStampDuty, '4,750.00');
  assert.equal(r!.usedFirstTimeBuyerRelief, false);
  assert.equal(r!.usedHigherRates, false);
}

/** GOV.UK FTB example: £500,000 → £10,000. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'first_time_buyer',
    residency: 'uk',
    propertyPrice: 500_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 10_000);
  assert.equal(r!.usedFirstTimeBuyerRelief, true);
}

/** FTB over £500,000 falls back to standard bands. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'first_time_buyer',
    residency: 'uk',
    propertyPrice: 500_001,
  });
  assert.ok(r);
  assert.equal(r!.usedFirstTimeBuyerRelief, false);
  // Standard: 0% to 125k + 2% to 250k + 5% on 250001.01 ≈ 12500.05 + 2500
  approx(r!.stampDuty, 15_000.05);
}

/** Higher rates (additional): £295,000 → £19,500. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'additional_property',
    residency: 'uk',
    propertyPrice: 295_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 19_500);
  assert.equal(r!.usedHigherRates, true);
}

/** Let/flip uses higher rates. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'let_or_flip',
    residency: 'uk',
    propertyPrice: 125_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 6250);
}

/** Non-UK resident surcharge on standard £295,000 → £10,650. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'moving_home',
    residency: 'non_uk',
    propertyPrice: 295_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 10_650);
  assert.equal(r!.nonResidentSurchargeApplied, true);
}

/** Non-UK + FTB £500,000 → £20,000. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'first_time_buyer',
    residency: 'non_uk',
    propertyPrice: 500_000,
  });
  assert.ok(r);
  approx(r!.stampDuty, 20_000);
}

/** Zero price → £0. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'moving_home',
    residency: 'uk',
    propertyPrice: 0,
  });
  assert.ok(r);
  approx(r!.stampDuty, 0);
}

/** Negative rejected. */
{
  const r = calculateStampDutyLandTaxUk({
    buyerScenario: 'moving_home',
    residency: 'uk',
    propertyPrice: -1,
  });
  assert.equal(r, null);
}

/** Validation + example input. */
{
  const v = validateStampDutyLandTaxUkInput(createExampleInput());
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  approx(v.result!.stampDuty, 10_000);
}

/** Blank price invalid. */
{
  const v = validateStampDutyLandTaxUkInput({
    buyerScenario: 'first_time_buyer',
    residency: 'uk',
    propertyPrice: '',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.propertyPrice);
}

assert.equal(formatGbp(roundGbp(10_000.004)), '10,000.00');

console.log('stamp-duty-land-tax-uk calculation.test.ts: ok');
