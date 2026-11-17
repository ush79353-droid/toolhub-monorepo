import assert from 'node:assert/strict';
import { calculateCashActStimulus } from './calculation';

// Single, full CASH payment at threshold
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    dependentsUnder17: null,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 2000);
  assert.equal(r?.hasAdditionalComparison, false);
}

// Single + under-17 comparison: $2,000 CASH vs $600 enacted → $1,400 more
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    dependentsUnder17: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 2000);
  assert.equal(r?.enactedPaymentUsd, 600);
  assert.equal(r?.additionalUsd, 1400);
}

// Married family of four (2 under-17): $8,000 vs $2,400 → $5,600 more
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'married',
    dependents: 2,
    dependentsUnder17: 2,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 8000);
  assert.equal(r?.enactedPaymentUsd, 2400);
  assert.equal(r?.additionalUsd, 5600);
}

// Adult dependent counts for CASH but not enacted under-17 amount
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 1,
    dependentsUnder17: 0,
    agi: 50_000,
  });
  assert.equal(r?.paymentUsd, 4000);
  assert.equal(r?.enactedPaymentUsd, 600);
  assert.equal(r?.additionalUsd, 3400);
}

// Phase-out: single $90k → CASH $1,250; enacted fully phased out → additional $1,250
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    dependentsUnder17: 0,
    agi: 90_000,
  });
  assert.equal(r?.paymentUsd, 1250);
  assert.equal(r?.enactedPaymentUsd, 0);
  assert.equal(r?.additionalUsd, 1250);
}

// under17 > dependents → null
{
  const r = calculateCashActStimulus({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 1,
    dependentsUnder17: 2,
    agi: 40_000,
  });
  assert.equal(r, null);
}

// No 2019 filing → $0
{
  const r = calculateCashActStimulus({
    filed2019Taxes: false,
    filingStatus: 'single',
    dependents: 0,
    dependentsUnder17: 0,
    agi: 40_000,
  });
  assert.equal(r?.paymentUsd, 0);
  assert.equal(r?.additionalUsd, 0);
  assert.equal(r?.ineligibleNoFiling, true);
}

console.log('cash-act-stimulus/calculation.test.ts: ok');
