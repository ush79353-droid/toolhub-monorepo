import assert from 'node:assert/strict';
import { buildMovingAverageResult, calculateSma } from './calculation';
import { createDefaultInput } from './types';
import { ensureTrailingPrices, validateMovingAverage } from './validation';

{
  assert.equal(calculateSma([100, 120, 140], 3), 120);
  assert.equal(calculateSma([100, 120, 140, 160], 3), 140);
  assert.equal(calculateSma([0, 0, 0], 3), 0);
}

{
  assert.equal(calculateSma([100, 120], 3), null);
  assert.equal(calculateSma([100, 120, 140], 1), null);
  assert.equal(calculateSma([100, -1, 140], 3), null);
  assert.equal(calculateSma([100, 120, 140], 2.5), null);
}

{
  const res = buildMovingAverageResult([100, 120, 140], 3, 'PKR');
  assert.ok(res);
  assert.equal(res.sma, 120);
  assert.equal(res.smaDisplay, '120.00');
}

{
  const v = validateMovingAverage({
    ...createDefaultInput(),
    length: 3,
    prices: ['100', '120', '140'],
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.sma, 120);
  assert.equal(v.incomplete, false);
}

{
  const incomplete = validateMovingAverage(createDefaultInput());
  assert.equal(incomplete.isValid, false);
  assert.equal(incomplete.incomplete, true);
}

{
  const short = validateMovingAverage({
    ...createDefaultInput(),
    length: 3,
    prices: ['100', '120', ''],
  });
  assert.equal(short.isValid, false);
  assert.equal(short.incomplete, true);
}

{
  const neg = validateMovingAverage({
    ...createDefaultInput(),
    length: 3,
    prices: ['100', '-5', '140'],
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.price2);
}

{
  const withFourth = ensureTrailingPrices({
    ...createDefaultInput(),
    prices: ['100', '120', '140'],
  });
  assert.equal(withFourth.prices.length, 4);
  assert.equal(withFourth.prices[3], '');
}

console.log('moving-average calculation.test ok');
