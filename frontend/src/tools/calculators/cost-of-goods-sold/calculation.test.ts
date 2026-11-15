import assert from 'node:assert/strict';
import { calculateCogs, buildCostOfGoodsSoldResult } from './calculation';
import { validateCostOfGoodsSold } from './validation';
import { createDefaultInput } from './types';

{
  assert.equal(calculateCogs(50_000, 30_000, 20_000), 60_000);
}

{
  const res = buildCostOfGoodsSoldResult(50_000, 30_000, 20_000, 'PKR');
  assert.equal(res.cogs, 60_000);
}

{
  const input = createDefaultInput();
  input.beginningInventory = 0;
  input.purchases = 0;
  input.endingInventory = 0;
  const v = validateCostOfGoodsSold(input);
  assert.equal(v.isValid, true);
  assert.equal(v.result?.cogs, 0);
}

{
  const input = createDefaultInput();
  input.beginningInventory = 10;
  input.purchases = 5;
  input.endingInventory = 20;
  const v = validateCostOfGoodsSold(input);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.endingInventory);
}

{
  const input = createDefaultInput();
  input.beginningInventory = -1;
  input.purchases = 1;
  input.endingInventory = 0;
  const v = validateCostOfGoodsSold(input);
  assert.equal(v.isValid, false);
  assert.ok(v.errors.beginningInventory);
}

console.log('cost-of-goods-sold calculation.test ok');
