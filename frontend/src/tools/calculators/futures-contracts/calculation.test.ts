import assert from 'node:assert/strict';
import {
  calculatePointValue,
  calculatePointsDifference,
  calculatePositionProfitLoss,
} from './calculation';
import { createExampleInput } from './types';
import { validateFuturesContractsInput } from './validation';

assert.equal(calculatePointValue({ tickValue: 1.25, ticksPerPoint: 4 }), 5);
assert.equal(calculatePointsDifference({ buyingPrice: 4500, sellingPrice: 4510 }), 10);

const pl = calculatePositionProfitLoss({
  numberOfPoints: 10,
  pointValue: 5,
  numberOfContracts: 2,
});
assert.ok(pl);
assert.equal(pl!.longProfitLoss, 100);
assert.equal(pl!.shortProfitLoss, -100);

// Zero contracts → zero P/L
const zero = calculatePositionProfitLoss({
  numberOfPoints: 10,
  pointValue: 5,
  numberOfContracts: 0,
});
assert.ok(zero);
assert.equal(zero!.longProfitLoss, 0);

assert.equal(
  calculatePointValue({ tickValue: -1, ticksPerPoint: 4 }),
  null
);

const validated = validateFuturesContractsInput(createExampleInput(), null);
assert.equal(validated.isValid, true);
assert.ok(validated.result);
assert.equal(validated.result!.numberOfPoints, 10);
assert.equal(validated.result!.pointValueCanonical, 5);
assert.equal(validated.result!.profitLossCanonical, 100);

const shortInput = { ...createExampleInput(), tradingDirection: 'short' as const };
const short = validateFuturesContractsInput(shortInput, null);
assert.equal(short.isValid, true);
assert.equal(short.result!.profitLossCanonical, -100);

console.log('futures-contracts calculation.test.ts: ok');
