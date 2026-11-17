import assert from 'node:assert/strict';
import { calculateHeroesStimulusPayment } from './calculation';

// Single, full payment at threshold
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'single',
    dependents: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 1200);
}

// Single phase-out: $87,000 → $600
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'single',
    dependents: 0,
    agi: 87_000,
  });
  assert.equal(r?.paymentUsd, 600);
}

// Single fully phased out
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'single',
    dependents: 0,
    agi: 99_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// Married + 3 dependents at threshold → household max $6,000
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'married',
    dependents: 3,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 6000);
  assert.equal(r?.eligibleDependents, 3);
}

// Fourth dependent does not increase payment (cap at three)
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'married',
    dependents: 4,
    agi: 100_000,
  });
  assert.equal(r?.paymentUsd, 6000);
  assert.equal(r?.eligibleDependents, 3);
}

// HoH + 1 dependent at threshold → $2,400
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 112_500,
  });
  assert.equal(r?.paymentUsd, 2400);
}

// HoH + 1 dependent fully phased out: 2400 / 0.05 = 48,000 → AGI 160,500
{
  const r = calculateHeroesStimulusPayment({
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 160_500,
  });
  assert.equal(r?.paymentUsd, 0);
}

console.log('heroes-act-stimulus/calculation.test.ts: ok');
