import assert from 'node:assert/strict';
import { calculateAmericanRescuePlanStimulus } from './calculation';

// Single, full payment at threshold
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 75_000,
  });
  assert.equal(r?.paymentUsd, 1400);
}

// Single midpoint phaseout: $77,500 → $700
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 77_500,
  });
  assert.equal(r?.paymentUsd, 700);
}

// Single zero at upper threshold
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 80_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// Married + 2 dependents (incl. adult dependents), full payment
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'married',
    dependents: 2,
    agi: 150_000,
  });
  assert.equal(r?.paymentUsd, 5600);
}

// Married midpoint: $155,000 → half of $2,800 = $1,400
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'married',
    dependents: 0,
    agi: 155_000,
  });
  assert.equal(r?.paymentUsd, 1400);
}

// Married fully phased out at $160,000
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'married',
    dependents: 2,
    agi: 160_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

// HoH + 1 dependent at threshold → $2,800
{
  const full = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 112_500,
  });
  assert.equal(full?.paymentUsd, 2800);

  const gone = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'head_of_household',
    dependents: 1,
    agi: 120_000,
  });
  assert.equal(gone?.paymentUsd, 0);
}

// No 2019/2020 filing → $0 (SSI/VA/RRB automatic paths not modeled)
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: false,
    filingStatus: 'single',
    dependents: 0,
    agi: 40_000,
  });
  assert.equal(r?.paymentUsd, 0);
  assert.equal(r?.ineligibleNoFiling, true);
}

// Never negative
{
  const r = calculateAmericanRescuePlanStimulus({
    filed2019Or2020Taxes: true,
    filingStatus: 'single',
    dependents: 0,
    agi: 200_000,
  });
  assert.equal(r?.paymentUsd, 0);
}

console.log('american-rescue-plan-stimulus/calculation.test.ts: ok');
