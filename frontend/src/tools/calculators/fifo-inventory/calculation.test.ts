import assert from 'node:assert/strict';
import { calculateFifoCogs, calculateFifoInventory } from './calculation';
import { createDefaultInput } from './types';
import { validateFifoInventory } from './validation';

// Reference: 100@50 + 100@60, sell 150 @ 80 → rev 12000, COGS 8000, profit 4000, margin 33.33
{
  assert.equal(calculateFifoCogs(150, 100, 50, 100, 60), 8_000);
  const result = calculateFifoInventory({
    batch1Price: 50,
    batch1Qty: 100,
    batch2Price: 60,
    batch2Qty: 100,
    unitsSold: 150,
    sellingPrice: 80,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.revenue, 12_000);
  assert.equal(result!.fifoCogs, 8_000);
  assert.equal(result!.grossProfit, 4_000);
  assert.ok(result!.grossMarginPercent !== null);
  assert.ok(Math.abs(result!.grossMarginPercent! - 33.3333) < 0.01);
}

// Oversell rejected
{
  assert.ok(Number.isNaN(calculateFifoCogs(250, 100, 50, 100, 60)));
  assert.equal(
    calculateFifoInventory({
      ...createDefaultInput(),
      batch1Price: 50,
      batch1Qty: 100,
      batch2Price: 60,
      batch2Qty: 100,
      unitsSold: 250,
      sellingPrice: 80,
    }),
    null
  );
}

// Zero revenue → margin null
{
  const result = calculateFifoInventory({
    batch1Price: 10,
    batch1Qty: 5,
    batch2Price: 10,
    batch2Qty: 5,
    unitsSold: 0,
    sellingPrice: 0,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.revenue, 0);
  assert.equal(result!.grossMarginPercent, null);
}

// Defaults blank
{
  const d = createDefaultInput();
  assert.ok(Number.isNaN(d.batch1Price));
  assert.ok(Number.isNaN(d.unitsSold));
}

// Validation path
{
  const v = validateFifoInventory({
    batch1Price: 50,
    batch1Qty: 100,
    batch2Price: 60,
    batch2Qty: 100,
    unitsSold: 150,
    sellingPrice: 80,
    currency: 'PKR',
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.fifoCogs, 8_000);
}

console.log('fifo-inventory calculation.test.ts: ok');
