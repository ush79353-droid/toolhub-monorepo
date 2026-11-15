import assert from 'node:assert/strict';
import { calculateSellThroughRate } from './calculation';
import { validateSellThroughRateInput } from './validation';

{
  const res = calculateSellThroughRate(150, 200);
  assert.ok(res);
  assert.equal(res.sellThroughRatePercent, 75);
  assert.equal(res.formattedRate, '75');
}

{
  const res = calculateSellThroughRate(0, 200);
  assert.ok(res);
  assert.equal(res.sellThroughRatePercent, 0);
}

{
  assert.equal(calculateSellThroughRate(10, 0), null);
  assert.equal(calculateSellThroughRate(201, 200), null);
  assert.equal(calculateSellThroughRate(-1, 10), null);
  assert.equal(calculateSellThroughRate(10, Number.NaN), null);
}

{
  const v = validateSellThroughRateInput({ unitsSold: '150', unitsReceived: '200' });
  assert.equal(v.isValid, true);
}

{
  const v = validateSellThroughRateInput({ unitsSold: '', unitsReceived: '10' });
  assert.equal(v.isValid, false);
  assert.equal(Object.keys(v.errors).length, 0);
}

console.log('sell-through-rate calculation.test ok');
