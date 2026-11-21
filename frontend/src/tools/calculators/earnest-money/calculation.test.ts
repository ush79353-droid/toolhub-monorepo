import assert from 'node:assert/strict';
import {
  calculateEarnestMoney,
  calculateEarnestMoneyPercentage,
  calculatePropertyPriceFromEarnestMoney,
} from './calculation';
import { createDefaultInput } from './types';
import { validateEarnestMoneyInput } from './validation';

// Test 1: Standard Earnest Money
{
  assert.equal(calculateEarnestMoney(300_000, 3), 9_000);
}

// Test 2: High-Value Property
{
  assert.equal(calculateEarnestMoney(1_000_000, 5), 50_000);
}

// Test 3: Decimal Percentage
{
  assert.equal(calculateEarnestMoney(450_000, 2.5), 11_250);
}

// Test 4: Zero Percentage
{
  assert.equal(calculateEarnestMoney(500_000, 0), 0);
}

// Test 5: Zero Property Price
{
  assert.equal(calculateEarnestMoney(0, 3), 0);
}

// Test 6: Reverse Percentage
{
  assert.equal(calculateEarnestMoneyPercentage(12_000, 400_000), 3);
}

// Test 7: Reverse Property Price
{
  assert.equal(calculatePropertyPriceFromEarnestMoney(15_000, 3), 500_000);
}

// Test 8: Negative Property Price
{
  assert.equal(calculateEarnestMoney(-100_000, 3), null);
  const v = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '-100000',
    earnestMoneyPercentage: '3',
  });
  assert.ok(v.errors.propertyPrice);
  assert.equal(v.result, null);
}

// Test 9: Invalid Percentage
{
  const v = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '300000',
    earnestMoneyPercentage: '120',
  });
  assert.ok(v.errors.earnestMoneyPercentage);
  assert.equal(v.result, null);
}

// Test 10: Missing Property Price
{
  const v = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '',
    earnestMoneyPercentage: '3',
  });
  assert.equal(v.isValid, false);
  assert.equal(v.result, null);
}

// Test 11: Input clearing
{
  const full = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '300000',
    earnestMoneyPercentage: '3',
  });
  assert.equal(full.result?.earnestMoneyAmount, 9_000);

  const cleared = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '',
    earnestMoneyPercentage: '3',
  });
  assert.equal(cleared.result, null);
}

// Test 12: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.mode, 'deposit');
  assert.equal(d.currency, 'PKR');
  assert.equal(d.propertyPrice, '');
  assert.equal(validateEarnestMoneyInput(d).result, null);
}

// Test 13: Large numbers
{
  const v = validateEarnestMoneyInput({
    ...createDefaultInput(),
    propertyPrice: '5000000',
    earnestMoneyPercentage: '2',
  });
  assert.equal(v.result?.earnestMoneyAmount, 100_000);
  assert.ok(v.result!.formattedEarnestMoneyAmount.includes(','));
}

// Test 14 / 15: Mode switching
{
  const deposit = validateEarnestMoneyInput({
    ...createDefaultInput(),
    mode: 'deposit',
    propertyPrice: '300000',
    earnestMoneyPercentage: '3',
  });
  assert.equal(deposit.result?.earnestMoneyAmount, 9_000);

  const percentage = validateEarnestMoneyInput({
    ...createDefaultInput(),
    mode: 'percentage',
    propertyPrice: '400000',
    earnestMoneyAmount: '12000',
  });
  assert.equal(percentage.result?.earnestMoneyPercentage, 3);

  const property = validateEarnestMoneyInput({
    ...createDefaultInput(),
    mode: 'propertyPrice',
    earnestMoneyAmount: '15000',
    earnestMoneyPercentage: '3',
  });
  assert.equal(property.result?.propertyPrice, 500_000);

  assert.equal(calculateEarnestMoneyPercentage(1, 0), null);
  assert.equal(calculatePropertyPriceFromEarnestMoney(15_000, 0), null);
}

console.log('earnest-money/calculation.test.ts: all assertions passed');
