import assert from 'node:assert/strict';
import { solveCpm } from './calculation';
import { createDefaultDraft } from './types';
import { validateAndSolveCampaign } from './validation';

// Reference: cost 5,000 / impressions 100,000 → CPM 50
{
  const res = solveCpm({ totalCost: 5_000, impressions: 100_000 });
  assert.equal(res.values.cpm, 50);
  assert.equal(res.inconsistent, false);
}

// Cost from CPM × impressions
{
  const res = solveCpm({ cpm: 50, impressions: 100_000 });
  assert.equal(res.values.totalCost, 5_000);
}

// Impressions from cost / CPM
{
  const res = solveCpm({ totalCost: 5_000, cpm: 50 });
  assert.equal(res.values.impressions, 100_000);
}

// Zero impressions — do not invent CPM
{
  const res = solveCpm({ totalCost: 100, impressions: 0 });
  assert.equal(res.values.cpm, undefined);
}

// Zero CPM — do not invent impressions
{
  const res = solveCpm({ totalCost: 100, cpm: 0 });
  assert.equal(res.values.impressions, undefined);
}

// Negatives rejected
{
  const res = solveCpm({ totalCost: -1, impressions: 1000 });
  assert.ok(res.errors.totalCost);
}

// Never overwrite provided values
{
  const res = solveCpm({ totalCost: 5_000, impressions: 100_000, cpm: 999 });
  assert.equal(res.values.cpm, 999);
  assert.equal(res.inconsistent, true);
}

// Defaults blank / second closed
{
  const d = createDefaultDraft();
  assert.equal(d.primary.totalCost, '');
  assert.equal(d.secondOpen, false);
}

// Draft solve path
{
  const v = validateAndSolveCampaign({
    totalCost: '5000',
    cpm: '',
    impressions: '100000',
    currency: 'PKR',
    manual: { totalCost: true, impressions: true },
  });
  assert.equal(v.values.cpm, 50);
}

console.log('cpm calculation.test.ts: ok');
