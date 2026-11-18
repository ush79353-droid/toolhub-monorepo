/**
 * Minimal runnable check for convertCurrency round-trips.
 * Run: npx tsx src/tools/shared/convert-currency.selfcheck.ts
 */
import assert from 'node:assert/strict';
import { convertCurrency, normalizeAmountsToCurrency, roundMoneyAmount } from './convert-currency';

const rates = {
  USD: 1,
  PKR: 277,
  EUR: 0.92,
  GBP: 0.79,
};

{
  const toUsd = convertCurrency({ amount: 10, from: 'PKR', to: 'USD', rates });
  assert.equal(toUsd.ok, true);
  if (toUsd.ok) {
    assert.ok(Math.abs(toUsd.amount - 10 / 277) < 1e-12);
    const back = convertCurrency({
      amount: toUsd.amount,
      from: 'USD',
      to: 'PKR',
      rates,
    });
    assert.equal(back.ok, true);
    if (back.ok) {
      assert.ok(Math.abs(back.amount - 10) < 1e-10);
    }
  }
}

{
  const same = convertCurrency({ amount: 5, from: 'EUR', to: 'EUR', rates });
  assert.equal(same.ok, true);
  if (same.ok) assert.equal(same.amount, 5);
}

{
  const cross = convertCurrency({ amount: 100, from: 'EUR', to: 'GBP', rates });
  assert.equal(cross.ok, true);
  if (cross.ok) {
    assert.ok(Math.abs(cross.amount - (100 * 0.79) / 0.92) < 1e-12);
  }
}

{
  const missing = convertCurrency({ amount: 1, from: 'USD', to: 'ZZZ', rates });
  assert.equal(missing.ok, false);
}

{
  const normalized = normalizeAmountsToCurrency(
    [
      { amount: 277, currency: 'PKR' },
      { amount: 1, currency: 'USD' },
    ],
    'USD',
    rates
  );
  assert.ok(normalized);
  assert.ok(Math.abs(normalized![0]! - 1) < 1e-12);
  assert.equal(normalized![1], 1);
}

{
  assert.equal(roundMoneyAmount(0.036101083032490975, 'USD'), 0.04);
}

console.log('convert-currency.selfcheck.ts: ok');
