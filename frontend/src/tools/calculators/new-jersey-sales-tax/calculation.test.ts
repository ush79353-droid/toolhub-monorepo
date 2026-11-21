import assert from 'node:assert/strict';
import {
  NJ_STANDARD_SALES_TAX_RATE_PERCENT,
  calculateNewJerseySalesTax,
  formatNjRatePercent,
  formatNjUsd,
  isValidNewJerseyZip,
  roundMoney,
} from './calculation';
import { createExampleInput } from './types';
import { validateNewJerseySalesTaxInput } from './validation';

assert.equal(NJ_STANDARD_SALES_TAX_RATE_PERCENT, 6.625);
assert.equal(formatNjRatePercent(6.625), '6.625');

// Official ZIP bounds (strings preserve leading zeros)
{
  assert.equal(isValidNewJerseyZip('07001'), true);
  assert.equal(isValidNewJerseyZip('08989'), true);
  assert.equal(isValidNewJerseyZip('07102'), true);
  assert.equal(isValidNewJerseyZip('06999'), false);
  assert.equal(isValidNewJerseyZip('08990'), false);
  assert.equal(isValidNewJerseyZip('7001'), false);
  assert.equal(isValidNewJerseyZip('0700a'), false);
  assert.equal(isValidNewJerseyZip(''), false);
}

// Guide example: $100 × 6.625% → $6.63 tax · $106.63 total
{
  const result = calculateNewJerseySalesTax(100, '07102');
  assert.ok(result);
  assert.equal(result!.taxRatePercent, 6.625);
  assert.equal(result!.salesTax, 6.63);
  assert.equal(result!.totalAmount, 106.63);
  assert.equal(result!.formattedSalesTax, '6.63');
  assert.equal(result!.formattedTotalAmount, '106.63');
  assert.equal(result!.zipCode, '07102');
  assert.match(result!.rateLabel, /standard/i);
  assert.doesNotMatch(result!.rateLabel, /3\.3125/);
}

// Zero purchase → zero tax
{
  const result = calculateNewJerseySalesTax(0, '07001');
  assert.ok(result);
  assert.equal(result!.salesTax, 0);
  assert.equal(result!.totalAmount, 0);
}

// Negatives / bad ZIP rejected
{
  assert.equal(calculateNewJerseySalesTax(-1, '07102'), null);
  assert.equal(calculateNewJerseySalesTax(100, '10001'), null);
  assert.equal(calculateNewJerseySalesTax(Number.NaN, '07102'), null);
  assert.equal(calculateNewJerseySalesTax(Number.POSITIVE_INFINITY, '07102'), null);
}

// Cent rounding
{
  assert.equal(roundMoney(6.625), 6.63);
  assert.equal(formatNjUsd(6.625), '6.63');
}

// Validation path with example input
{
  const validation = validateNewJerseySalesTaxInput(createExampleInput());
  assert.equal(validation.isValid, true);
  assert.equal(validation.result?.formattedTotalAmount, '106.63');
}

// Soft empty
{
  const validation = validateNewJerseySalesTaxInput({
    purchaseAmount: '',
    zipCode: '',
  });
  assert.equal(validation.isValid, false);
  assert.equal(validation.result, null);
  assert.deepEqual(validation.errors, {});
}

// Partial invalid ZIP
{
  const validation = validateNewJerseySalesTaxInput({
    purchaseAmount: '50',
    zipCode: '90210',
  });
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.zipCode);
}

console.log('new-jersey-sales-tax calculation.test.ts: ok');
