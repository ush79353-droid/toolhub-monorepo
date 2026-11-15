import assert from 'node:assert/strict';
import { calculateCostOfEquityDividend } from './calculation';
import { createDefaultInput } from './types';
import { validateCostOfEquityInput } from './validation';

{
  const example = calculateCostOfEquityDividend({
    dividendPerShare: 5,
    sharePrice: 100,
    growthRatePercent: 4,
  });
  assert.ok(example);
  assert.equal(example.costOfEquityPercent, 9);
  assert.equal(example.formattedCostOfEquity, '9');
}

{
  const zeroGrowth = calculateCostOfEquityDividend({
    dividendPerShare: 5,
    sharePrice: 100,
    growthRatePercent: 0,
  });
  assert.ok(zeroGrowth);
  assert.equal(zeroGrowth.costOfEquityPercent, 5);
}

{
  assert.equal(
    calculateCostOfEquityDividend({
      dividendPerShare: 5,
      sharePrice: 0,
      growthRatePercent: 4,
    }),
    null
  );
  assert.equal(
    calculateCostOfEquityDividend({
      dividendPerShare: -1,
      sharePrice: 100,
      growthRatePercent: 4,
    }),
    null
  );
}

{
  const valid = validateCostOfEquityInput({
    ...createDefaultInput(),
    dividendPerShare: '5',
    sharePrice: '100',
    growthRatePercent: '4',
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.result?.costOfEquityPercent, 9);
}

{
  const noMode = validateCostOfEquityInput({
    ...createDefaultInput(),
    mode: 'no-dividend',
    dividendPerShare: '5',
    sharePrice: '100',
    growthRatePercent: '4',
  });
  assert.equal(noMode.isValid, false);
  assert.equal(noMode.result, null);
}

{
  const blank = validateCostOfEquityInput(createDefaultInput());
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);
}

console.log('cost-of-equity calculation.test.ts: ok');
