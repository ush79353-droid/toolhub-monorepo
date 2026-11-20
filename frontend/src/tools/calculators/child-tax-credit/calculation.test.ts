import assert from 'node:assert/strict';
import {
  calculateChildTaxCredit,
  isQualifyingChildAge,
} from './calculation';

assert.equal(isQualifyingChildAge(0), true);
assert.equal(isQualifyingChildAge(16), true);
assert.equal(isQualifyingChildAge(17), false);
assert.equal(isQualifyingChildAge(-1), false);

// Guide example: Single · 180k · ages 5 & 10 → $4,400
{
  const result = calculateChildTaxCredit({
    filingStatus: 'single',
    agi: 180_000,
    childAges: [5, 10],
  });
  assert.ok(result);
  assert.equal(result.eligibleChildren, 2);
  assert.equal(result.maxCreditBeforePhaseout, 4_400);
  assert.equal(result.phaseoutReduction, 0);
  assert.equal(result.estimatedCredit, 4_400);
}

// Guide example: Single · 210k · same children → $500 reduction → $3,900
{
  const result = calculateChildTaxCredit({
    filingStatus: 'single',
    agi: 210_000,
    childAges: [5, 10],
  });
  assert.ok(result);
  assert.equal(result.phaseoutReduction, 500);
  assert.equal(result.estimatedCredit, 3_900);
}

// Age 17 does not qualify; blank slots ignored; zero AGI / zero kids OK
{
  const result = calculateChildTaxCredit({
    filingStatus: 'joint',
    agi: 0,
    childAges: [17, null],
  });
  assert.ok(result);
  assert.equal(result.eligibleChildren, 0);
  assert.equal(result.estimatedCredit, 0);
}

// Negative AGI rejected
{
  assert.equal(
    calculateChildTaxCredit({
      filingStatus: 'single',
      agi: -1,
      childAges: [5],
    }),
    null
  );
}

console.log('child-tax-credit calculation.test.ts: all assertions passed');
