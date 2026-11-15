import assert from 'node:assert/strict';
import { calculateOpportunityCost } from './calculation';
import { createDefaultInput } from './types';
import { validateOpportunityCostInput } from './validation';

{
  const res = calculateOpportunityCost(100_000, 10, 1, 0, 20, 5, 'PKR');
  assert.ok(res);
  assert.equal(res.totalSavingsAfterTax, 108_000);
  assert.equal(res.realSavings, 102_857.14);
  assert.equal(res.opportunityCost, 2_857.14);
  assert.equal(res.netReturn, 0.08);
}

{
  const zero = calculateOpportunityCost(100_000, 0, 1, 0, 0, 0, 'PKR');
  assert.ok(zero);
  assert.equal(zero.totalSavingsAfterTax, 100_000);
  assert.equal(zero.realSavings, 100_000);
  assert.equal(zero.opportunityCost, 0);
}

{
  assert.equal(calculateOpportunityCost(-1, 10, 1, 0, 20, 5, 'PKR'), null);
  assert.equal(calculateOpportunityCost(100_000, 10, 1, 0, 101, 5, 'PKR'), null);
  assert.equal(calculateOpportunityCost(100_000, 10, 1, 0, 20, -100, 'PKR'), null);
  assert.equal(calculateOpportunityCost(100_000, -200, 1, 0, 0, 0, 'PKR'), null);
}

{
  const v = validateOpportunityCostInput({
    ...createDefaultInput(),
    moneyToSpend: '100000',
    annualReturn: '10',
    years: '1',
    months: '',
    incomeTax: '20',
    inflation: '5',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.opportunityCost, 2_857.14);
}

{
  const incomplete = validateOpportunityCostInput(createDefaultInput());
  assert.equal(incomplete.isValid, false);
  assert.equal(incomplete.result, null);
}

console.log('opportunity-cost calculation.test ok');
