import assert from 'node:assert/strict';
import {
  calculateProfitabilityIndex,
  formatPi,
  interpretPi,
} from './calculation';
import { createDefaultInput } from './types';
import { validateProfitabilityIndex } from './validation';

{
  assert.equal(calculateProfitabilityIndex(100_000, 120_000), 1.2);
  assert.equal(formatPi(1.2), '1.2');
  assert.match(interpretPi(1.2), /attractive/);
  assert.match(interpretPi(1), /break-even/i);
  assert.match(interpretPi(0.8), /unattractive/);
}

{
  assert.equal(calculateProfitabilityIndex(0, 100), null);
  assert.equal(calculateProfitabilityIndex(100, -1), null);
}

{
  const blank = validateProfitabilityIndex(createDefaultInput());
  assert.equal(blank.incomplete, true);

  const ok = validateProfitabilityIndex({
    initialInvestment: '100000',
    pvFutureCashFlow: '120000',
    pvUnknown: false,
    currency: 'PKR',
  });
  assert.equal(ok.isValid, true);
  assert.equal(ok.result?.pi, 1.2);
}

console.log('profitability-index calculation.test.ts: ok');
