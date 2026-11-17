import assert from 'node:assert/strict';
import {
  calculateGssIi,
  resolveGssIiPaymentAmountUsd,
  assessFilingDeadline,
  CA_AGI_MAX_USD,
} from './calculation';

// Payment matrix (non-MFS) from FTB PSB 2021-18 / §8150.2(c)
assert.equal(
  resolveGssIiPaymentAmountUsd({
    taxFileId: 'ssn',
    qualifiedGssI: true,
    claimedChildDependent: true,
  })?.amountUsd,
  500
);
assert.equal(
  resolveGssIiPaymentAmountUsd({
    taxFileId: 'ssn',
    qualifiedGssI: false,
    claimedChildDependent: false,
  })?.amountUsd,
  600
);
assert.equal(
  resolveGssIiPaymentAmountUsd({
    taxFileId: 'itin',
    qualifiedGssI: true,
    claimedChildDependent: true,
  })?.amountUsd,
  1000
);
assert.equal(
  resolveGssIiPaymentAmountUsd({
    taxFileId: 'ssn',
    qualifiedGssI: false,
    claimedChildDependent: true,
  })?.amountUsd,
  1100
);
assert.equal(
  resolveGssIiPaymentAmountUsd({
    taxFileId: 'ssn',
    qualifiedGssI: true,
    claimedChildDependent: false,
  }),
  null
);

// Residency gate
{
  const r = calculateGssIi({
    californiaAgi: 40_000,
    californiaResident2020: false,
    taxFileId: 'ssn',
    qualifiedGssI: false,
    claimedChildDependent: false,
    paymentMethod: 'direct-deposit',
    taxFilingDate: '2021-04-15',
  });
  assert.equal(r.eligibilityStatus, 'ineligible');
  assert.equal(r.paymentAmountUsd, null);
}

// AGI above band
{
  const r = calculateGssIi({
    californiaAgi: CA_AGI_MAX_USD + 1,
    californiaResident2020: true,
    taxFileId: 'ssn',
    qualifiedGssI: false,
    claimedChildDependent: false,
    paymentMethod: 'paper-check',
    taxFilingDate: '2021-04-15',
  });
  assert.equal(r.eligibilityStatus, 'ineligible');
}

// Happy path $1,100
{
  const r = calculateGssIi({
    californiaAgi: 50_000,
    californiaResident2020: true,
    taxFileId: 'ssn',
    qualifiedGssI: false,
    claimedChildDependent: true,
    paymentMethod: 'direct-deposit',
    taxFilingDate: '2021-04-15',
  });
  assert.equal(r.eligibilityStatus, 'eligible');
  assert.equal(r.paymentAmountUsd, 1100);
  assert.ok(r.historicalTimingGuidance.includes('July 15, 2022'));
  assert.ok(r.programClosedNotice.includes('Historical program'));
}

// Late SSN filing
assert.equal(
  assessFilingDeadline({ taxFileId: 'ssn', taxFilingDate: '2021-10-16' }).status,
  'late-standard'
);

// ITIN within extended window
assert.equal(
  assessFilingDeadline({ taxFileId: 'itin', taxFilingDate: '2022-02-01' }).status,
  'ok'
);

console.log('california-stimulus-check-ii calculation.test.ts: ok');
