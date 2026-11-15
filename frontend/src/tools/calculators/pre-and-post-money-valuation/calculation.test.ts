import assert from 'node:assert/strict';
import { solvePrePostMoney } from './calculation';
import { createDefaultDraft } from './types';
import { validateAndSolve } from './validation';

// Reference: inv 2M, equity 20% → post 10M, pre 8M
{
  const r = solvePrePostMoney({ investment: 2_000_000, equity: 20 });
  assert.equal(r.values.postMoney, 10_000_000);
  assert.equal(r.values.preMoney, 8_000_000);
}

// Reverse: pre + post → inv + equity
{
  const r = solvePrePostMoney({ preMoney: 8_000_000, postMoney: 10_000_000 });
  assert.equal(r.values.investment, 2_000_000);
  assert.equal(r.values.equity, 20);
}

// Never overwrite manual
{
  const r = solvePrePostMoney({
    investment: 2_000_000,
    equity: 20,
    postMoney: 9_000_000,
  });
  assert.equal(r.values.postMoney, 9_000_000);
  assert.equal(r.inconsistent, true);
}

// Equity bounds
{
  assert.ok(solvePrePostMoney({ equity: -1 }).errors.equity);
  assert.ok(solvePrePostMoney({ equity: 101 }).errors.equity);
  assert.ok(solvePrePostMoney({ investment: -1 }).errors.investment);
}

// Blank incomplete
{
  const blank = validateAndSolve(createDefaultDraft());
  assert.deepEqual(blank.values, {});
}

console.log('pre-and-post-money-valuation calculation.test.ts: ok');
