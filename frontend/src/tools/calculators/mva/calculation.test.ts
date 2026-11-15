import assert from 'node:assert/strict';
import {
  buildMvaResult,
  calculateCurrentMarketValue,
  calculateMva,
} from './calculation';
import { createDefaultInput } from './types';
import { validateMva } from './validation';

{
  assert.equal(calculateCurrentMarketValue(150, 10_000), 1_500_000);
  assert.equal(calculateMva(1_500_000, 1_000_000), 500_000);
}

{
  const res = buildMvaResult(150, 10_000, 1_000_000, 'PKR');
  assert.equal(res.currentMarketValue, 1_500_000);
  assert.equal(res.mva, 500_000);
  assert.equal(res.currentMarketValueDisplay, '1,500,000.00');
  assert.equal(res.mvaDisplay, '500,000.00');
}

{
  const partial = buildMvaResult(150, 10_000, Number.NaN, 'PKR');
  assert.equal(partial.currentMarketValue, 1_500_000);
  assert.equal(partial.mva, null);
  assert.equal(partial.mvaDisplay, '');
}

{
  assert.equal(calculateCurrentMarketValue(-1, 10), null);
  assert.equal(calculateCurrentMarketValue(10, -1), null);
  assert.equal(calculateMva(100, -1), null);
  assert.equal(calculateMva(100, 200), -100);
  assert.equal(calculateCurrentMarketValue(0, 0), 0);
  assert.equal(calculateMva(0, 0), 0);
}

{
  const v = validateMva({
    ...createDefaultInput(),
    currentSharePrice: 150,
    sharesOutstanding: 10_000,
    capitalInvested: 1_000_000,
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result?.mva, 500_000);
}

{
  const fractional = validateMva({
    ...createDefaultInput(),
    currentSharePrice: 150,
    sharesOutstanding: 10.5,
    capitalInvested: 1_000_000,
  });
  assert.equal(fractional.isValid, false);
  assert.ok(fractional.errors.sharesOutstanding);
}

{
  const negMva = validateMva({
    ...createDefaultInput(),
    currentSharePrice: 50,
    sharesOutstanding: 10_000,
    capitalInvested: 1_000_000,
  });
  assert.equal(negMva.isValid, true);
  assert.equal(negMva.result?.mva, -500_000);
}

console.log('mva calculation.test ok');
