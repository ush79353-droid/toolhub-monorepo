import assert from 'node:assert/strict';
import { calculateBidensTaxPlan } from './calculation';

/** Manual check: single, AGI $80,000, no kids — baseline vs AFP ordinary tax only. */
{
  const r = calculateBidensTaxPlan({
    age: 40,
    agi: 80_000,
    filingStatus: 'single',
    childrenUnder6: 0,
    children6to17: 0,
    dependents: 0,
  });
  assert.ok(r);
  // Taxable = 80000 - 12950 = 67050
  // 10% of 10275 + 12% of (41775-10275) + 22% of (67050-41775)
  // = 1027.5 + 3780 + 5560.5 = 10368 → round 10368
  assert.equal(r!.baselineTaxUsd, 10_368);
  assert.equal(r!.bidenTaxUsd, 10_368); // below AFP top threshold
  assert.ok(r!.baselineEffectiveRatePct !== null);
  assert.ok(Math.abs(r!.baselineEffectiveRatePct! - (10_368 / 80_000) * 100) < 1e-9);
}

/** High earner: AFP 39.6% kicks in above $452,700 taxable. */
{
  const r = calculateBidensTaxPlan({
    age: null,
    agi: 600_000,
    filingStatus: 'single',
    childrenUnder6: 0,
    children6to17: 0,
    dependents: 0,
  });
  assert.ok(r);
  assert.ok(r!.bidenTaxUsd > r!.baselineTaxUsd);
}

/** AFP refundable CTC can produce negative net tax. */
{
  const r = calculateBidensTaxPlan({
    age: 30,
    agi: 20_000,
    filingStatus: 'single',
    childrenUnder6: 2,
    children6to17: 0,
    dependents: 0,
  });
  assert.ok(r);
  assert.ok(r!.bidenTaxUsd < 0);
  assert.ok(r!.baselineTaxUsd >= 0);
}

/** AGI = 0 → effective rates null (no NaN). */
{
  const r = calculateBidensTaxPlan({
    age: null,
    agi: 0,
    filingStatus: 'married',
    childrenUnder6: 0,
    children6to17: 0,
    dependents: 0,
  });
  assert.ok(r);
  assert.equal(r!.baselineTaxUsd, 0);
  assert.equal(r!.baselineEffectiveRatePct, null);
  assert.equal(r!.bidenEffectiveRatePct, null);
}

/** Age ≥ 65 increases standard deduction (single). */
{
  const young = calculateBidensTaxPlan({
    age: 40,
    agi: 50_000,
    filingStatus: 'single',
    childrenUnder6: 0,
    children6to17: 0,
    dependents: 0,
  });
  const aged = calculateBidensTaxPlan({
    age: 65,
    agi: 50_000,
    filingStatus: 'single',
    childrenUnder6: 0,
    children6to17: 0,
    dependents: 0,
  });
  assert.ok(young && aged);
  assert.ok(aged!.baselineTaxUsd < young!.baselineTaxUsd);
}

console.log('bidens-tax-plan calculation.test.ts: all assertions passed');
