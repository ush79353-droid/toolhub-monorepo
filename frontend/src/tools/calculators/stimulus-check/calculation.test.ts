import assert from 'node:assert/strict';
import { calculateStimulusCheck } from './calculation';

// Single, full payment at threshold
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 1200);
}

// Single phaseout: $87,000 → $600
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 87_000,
  });
  assert.equal(r?.paymentUsd, 600);
}

// Single fully phased out at $99,000 with 0 kids
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 99_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// Married + 2 qualifying children, full payment → $3,400
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'married',
    kids: 2,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 3400);
}

// Married + 2 kids fully phased out at $218,000
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'married',
    kids: 2,
    agi: 218_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// HoH + 1 kid at threshold → $1,700
{
  const full = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    kids: 1,
    agi: 112_500,
  });
  assert.equal(full?.paymentUsd, 1700);

  const gone = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    kids: 1,
    agi: 146_500,
  });
  assert.equal(gone?.paymentUsd, 0);
}

// Zero kids and zero AGI allowed
{
  const r = calculateStimulusCheck({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 0,
  });
  assert.equal(r?.paymentUsd, 1200);
}

// No 2019 filing → $0 (SSI/VA/RRB automatic paths not modeled)
{
  const r = calculateStimulusCheck({
    filed2019Taxes: false,
    filingStatus: 'single',
    kids: 0,
    agi: 40_000,
  });
  assert.equal(r?.paymentUsd, 0);
  assert.equal(r?.ineligibleNoFiling, true);
}

// Reject negative / non-finite inputs
{
  assert.equal(
    calculateStimulusCheck({
      filed2019Taxes: true,
      filingStatus: 'single',
      kids: -1,
      agi: 10_000,
    }),
    null
  );
  assert.equal(
    calculateStimulusCheck({
      filed2019Taxes: true,
      filingStatus: 'single',
      kids: 0,
      agi: Number.NaN,
    }),
    null
  );
}

console.log('stimulus-check/calculation.test.ts: ok');
