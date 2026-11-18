import assert from 'node:assert/strict';
import { calculateHealsStimulusPayment } from './calculation';

// Single, full payment at threshold
{
  const r = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 1200);
}

// Single phaseout: $87,000 → $600
{
  const r = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 87_000,
  });
  assert.equal(r?.paymentUsd, 600);
}

// Single fully phased out
{
  const r = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 99_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// Married + 2 dependents (any age), full payment
{
  const r = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'married',
    dependents: 2,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 3400);
}

// HoH + 1 dependent at threshold → $1,700; phaseout end ≈ $146,500
{
  const full = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 112_500,
  });
  assert.equal(full?.paymentUsd, 1700);

  const gone = calculateHealsStimulusPayment({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 146_500,
  });
  assert.equal(gone?.paymentUsd, 0);
}

// No 2019 filing → $0 (eligibility gate)
{
  const r = calculateHealsStimulusPayment({
    filed2019Taxes: false,
    filingStatus: 'single',
    dependents: 0,
    agi: 40_000,
  });
  assert.equal(r?.paymentUsd, 0);
  assert.equal(r?.ineligibleNoFiling, true);
}

console.log('heals-act-stimulus/calculation.test.ts: ok');
