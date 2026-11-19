import assert from 'node:assert/strict';
import {
  addVat,
  calculateVatFromGross,
  calculateVatFromNet,
  formatVatMoney,
  removeVat,
  roundMoneyAmount,
} from './calculation';
import { createDefaultInput } from './types';
import { validateVatInput } from './validation';

{
  const added = addVat(100, 20);
  assert.ok(added);
  assert.equal(added!.vatAmount, 20);
  assert.equal(added!.grossPrice, 120);
}

{
  const removed = removeVat(120, 20);
  assert.ok(removed);
  assert.equal(removed!.netPrice, 100);
  assert.equal(removed!.vatAmount, 20);
}

// Incorrect method would be 120 * (1 - 0.20) = 96 — reverse VAT must stay 100
{
  const removed = removeVat(120, 20);
  assert.ok(removed);
  assert.notEqual(removed!.netPrice, 120 * 0.8);
  assert.equal(removed!.netPrice, 100);
}

{
  const zero = addVat(250, 0);
  assert.ok(zero);
  assert.equal(zero!.vatAmount, 0);
  assert.equal(zero!.grossPrice, 250);
  const back = removeVat(250, 0);
  assert.ok(back);
  assert.equal(back!.netPrice, 250);
}

assert.equal(addVat(-1, 20), null);
assert.equal(removeVat(100, -100), null);
assert.equal(addVat(100, Number.NaN), null);

{
  const result = calculateVatFromNet(100, 20, 'USD');
  assert.ok(result);
  assert.equal(result!.formattedNetPrice, '100.00');
  assert.equal(result!.formattedVatAmount, '20.00');
  assert.equal(result!.formattedGrossPrice, '120.00');
}

{
  const result = calculateVatFromGross(120, 20, 'USD');
  assert.ok(result);
  assert.equal(result!.netPrice, 100);
  assert.equal(result!.vatAmount, 20);
}

// Round-trip: net → gross → net
{
  const forward = calculateVatFromNet(99.99, 20, 'USD');
  assert.ok(forward);
  const back = calculateVatFromGross(forward!.grossPrice, 20, 'USD');
  assert.ok(back);
  assert.equal(back!.netPrice, forward!.netPrice);
}

{
  assert.equal(roundMoneyAmount(10.005, 'USD'), 10.01);
  assert.equal(formatVatMoney(1000, 'USD'), '1,000.00');
}

{
  const validated = validateVatInput(createDefaultInput());
  assert.equal(validated.isValid, true);
  assert.ok(validated.result);
  assert.equal(validated.result!.grossPrice, 120);
}

{
  const included = validateVatInput({
    ...createDefaultInput(),
    amount: '120',
    mode: 'included',
    driver: 'amount',
  });
  assert.equal(included.isValid, true);
  assert.equal(included.result!.netPrice, 100);
}

{
  const fromGross = validateVatInput({
    ...createDefaultInput(),
    grossPrice: '240',
    driver: 'gross',
    vatRate: '20',
  });
  assert.equal(fromGross.isValid, true);
  assert.equal(fromGross.result!.netPrice, 200);
  assert.equal(fromGross.result!.vatAmount, 40);
}

{
  const bad = validateVatInput({ ...createDefaultInput(), amount: '', driver: 'amount' });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.amount);
}

{
  const negRate = validateVatInput({ ...createDefaultInput(), vatRate: '-100' });
  assert.equal(negRate.isValid, false);
}

console.log('vat calculation.test.ts: ok');
