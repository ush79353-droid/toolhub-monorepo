import assert from 'node:assert/strict';
import { calculateSecondStimulus900Billion } from './calculation';

// Single, full payment at threshold
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 600);
}

// Single phaseout: $81,000 → $300
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 81_000,
  });
  assert.equal(r?.paymentUsd, 300);
}

// Single fully phased out at $87,000 with 0 kids
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'single',
    kids: 0,
    agi: 87_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// Married + 2 qualifying children, full payment
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'married',
    kids: 2,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 2400);
}

// Married + 2 kids fully phased out at $198,000 (CRS IN11575)
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'married',
    kids: 2,
    agi: 198_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// HoH + 1 kid at threshold → $1,200
{
  const full = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    kids: 1,
    agi: 112_500,
  });
  assert.equal(full?.paymentUsd, 1200);

  const gone = calculateSecondStimulus900Billion({
    filed2019Taxes: true,
    filingStatus: 'head_of_household',
    kids: 1,
    agi: 136_500,
  });
  assert.equal(gone?.paymentUsd, 0);
}

// No 2019 filing → $0 (SSI/VA/RRB automatic paths not modeled)
{
  const r = calculateSecondStimulus900Billion({
    filed2019Taxes: false,
    filingStatus: 'single',
    kids: 0,
    agi: 40_000,
  });
  assert.equal(r?.paymentUsd, 0);
  assert.equal(r?.ineligibleNoFiling, true);
}

console.log('second-stimulus-900-billion/calculation.test.ts: ok');
