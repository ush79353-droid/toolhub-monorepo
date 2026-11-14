import assert from 'node:assert/strict';
import { calculateBreakEven } from './calculation';
import { validateBreakEvenInput } from './validation';
import { createDefaultInput } from './types';

// Reference: 100 / 60 / 2000 → margin 40%, markup 66.67%, 50 units, revenue 5,000
{
  const result = calculateBreakEven(100, 60, 2000, 'PKR');
  assert.equal(result.contributionPerUnit, 40);
  assert.equal(result.marginPercent, 40);
  assert.equal(Number(result.markupPercent!.toFixed(2)), 66.67);
  assert.equal(result.unitsToSell, 50);
  assert.equal(result.breakEvenRevenue, 5000);
  assert.equal(result.breakEvenDefined, true);
  assert.equal(result.formattedMargin, '40');
  assert.equal(result.formattedMarkup, '66.67');
  assert.equal(result.formattedUnits, '50');
}

// Ceil when exact units are fractional
{
  const result = calculateBreakEven(100, 60, 2001, 'PKR');
  assert.equal(result.unitsToSell, 51);
  assert.equal(result.breakEvenRevenue, 5100);
}

// Contribution ≤ 0 → no break-even quantity
{
  const zero = calculateBreakEven(60, 60, 2000, 'PKR');
  assert.equal(zero.breakEvenDefined, false);
  assert.equal(zero.unitsToSell, null);
  assert.ok(zero.explanation);

  const negative = calculateBreakEven(50, 60, 2000, 'PKR');
  assert.equal(negative.breakEvenDefined, false);
  assert.equal(negative.unitsToSell, null);
}

// Cost zero → markup undefined; margin and break-even still work when revenue > 0
{
  const result = calculateBreakEven(100, 0, 500, 'PKR');
  assert.equal(result.markupPercent, null);
  assert.equal(result.marginPercent, 100);
  assert.equal(result.unitsToSell, 5);
  assert.equal(result.breakEvenRevenue, 500);
}

// Revenue zero → margin undefined
{
  const result = calculateBreakEven(0, 0, 100, 'PKR');
  assert.equal(result.marginPercent, null);
  assert.equal(result.markupPercent, null);
  assert.equal(result.breakEvenDefined, false);
}

// Defaults blank
{
  const defaults = createDefaultInput();
  assert.equal(defaults.revenuePerUnit, '');
  assert.equal(defaults.costPerUnit, '');
  assert.equal(defaults.fixedCosts, '');
}

// Incomplete draft
{
  const v = validateBreakEvenInput(createDefaultInput());
  assert.equal(v.isValid, false);
  assert.deepEqual(v.errors, {});
}

// Negative cost rejected
{
  const v = validateBreakEvenInput({
    revenuePerUnit: '100',
    costPerUnit: '-1',
    fixedCosts: '10',
    currency: 'PKR',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.costPerUnit);
}

// Valid draft
{
  const v = validateBreakEvenInput({
    revenuePerUnit: '100',
    costPerUnit: '60',
    fixedCosts: '2000',
    currency: 'PKR',
  });
  assert.equal(v.isValid, true);
  assert.deepEqual(v.parsed, {
    revenuePerUnit: 100,
    costPerUnit: 60,
    fixedCosts: 2000,
    currency: 'PKR',
  });
}

console.log('break-even calculation.test.ts: ok');
