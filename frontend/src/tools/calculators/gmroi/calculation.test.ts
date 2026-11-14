import assert from 'node:assert/strict';
import {
  buildGmroiResult,
  calculateAverageInventory,
  calculateGmroi,
} from './calculation';
import { createDefaultDraft } from './types';
import { validateGmroiDraft, withAutoAverage } from './validation';

// Reference: (50000+30000)/2 = 40000; 60000/40000 = 1.5 → 150%
{
  assert.equal(calculateAverageInventory(50_000, 30_000), 40_000);
  assert.equal(calculateGmroi(60_000, 40_000), 1.5);
  const result = buildGmroiResult({
    startingInventory: 50_000,
    finalInventory: 30_000,
    averageInventory: 40_000,
    grossProfit: 60_000,
    currency: 'PKR',
  });
  assert.ok(result);
  assert.equal(result!.gmroi, 1.5);
  assert.equal(result!.gmroiPercent, 150);
}

// Negative profit allowed
{
  assert.equal(calculateGmroi(-10_000, 40_000), -0.25);
}

// Average <= 0 rejected
{
  assert.ok(Number.isNaN(calculateGmroi(10_000, 0)));
  assert.ok(Number.isNaN(calculateGmroi(10_000, -1)));
}

// Auto average fills when not manual
{
  const auto = withAutoAverage({
    ...createDefaultDraft(),
    startingInventory: '50000',
    finalInventory: '30000',
  });
  assert.equal(auto.averageInventory, '40000');
}

// Manual average preserved
{
  const manual = withAutoAverage({
    ...createDefaultDraft(),
    startingInventory: '50000',
    finalInventory: '30000',
    averageInventory: '45000',
    averageManual: true,
  });
  assert.equal(manual.averageInventory, '45000');
}

// Draft validation
{
  const v = validateGmroiDraft({
    startingInventory: '50000',
    finalInventory: '30000',
    averageInventory: '',
    grossProfit: '60000',
    currency: 'PKR',
    averageManual: false,
  });
  assert.equal(v.isValid, true);
  assert.equal(v.result!.gmroi, 1.5);
}

console.log('gmroi calculation.test.ts: ok');
