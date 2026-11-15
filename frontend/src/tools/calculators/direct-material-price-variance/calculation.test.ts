import assert from 'node:assert/strict';
import {
  buildDirectMaterialPriceVarianceResult,
  calculatePriceVariance,
  varianceStatus,
} from './calculation';
import { validateDirectMaterialPriceVariance } from './validation';
import { createDefaultInput } from './types';

{
  assert.equal(calculatePriceVariance(100, 120, 500), 10_000);
  assert.equal(varianceStatus(10_000), 'unfavorable');
}

{
  assert.equal(calculatePriceVariance(120, 100, 500), -10_000);
  assert.equal(varianceStatus(-10_000), 'favorable');
}

{
  assert.equal(varianceStatus(0), 'none');
}

{
  const res = buildDirectMaterialPriceVarianceResult(100, 120, 500, 'PKR');
  assert.ok(res);
  assert.equal(res.variance, 10_000);
  assert.equal(res.status, 'unfavorable');
}

{
  const input = createDefaultInput();
  input.standardRate = 100;
  input.actualRate = 120;
  input.quantity = 500;
  const v = validateDirectMaterialPriceVariance(input);
  assert.equal(v.isValid, true);
  assert.equal(v.result?.variance, 10_000);
}

{
  const input = createDefaultInput();
  input.standardRate = -1;
  input.actualRate = 10;
  input.quantity = 1;
  const v = validateDirectMaterialPriceVariance(input);
  assert.equal(v.isValid, false);
}

{
  assert.equal(buildDirectMaterialPriceVarianceResult(1, 1, Number.NaN, 'PKR'), null);
}

console.log('direct-material-price-variance calculation.test ok');
