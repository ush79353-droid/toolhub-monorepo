import assert from 'node:assert/strict';
import {
  calculateRealEstateCommission,
  formatRealEstateCommissionMoney,
} from './calculation';
import { validateRealEstateCommissionInput } from './validation';
import { createDefaultInput } from './types';

// Basic: Commission = Price × Rate / 100; Owner = Price − Commission
{
  const out = calculateRealEstateCommission({
    housePrice: 10_000_000,
    commissionPercent: 2,
  });
  assert.ok(out);
  assert.equal(out.commissionAmount, 200_000);
  assert.equal(out.ownerReceives, 9_800_000);
}

// Zero commission allowed
{
  const out = calculateRealEstateCommission({
    housePrice: 500_000,
    commissionPercent: 0,
  });
  assert.ok(out);
  assert.equal(out.commissionAmount, 0);
  assert.equal(out.ownerReceives, 500_000);
}

// 100% commission → owner receives 0
{
  const out = calculateRealEstateCommission({
    housePrice: 1_000,
    commissionPercent: 100,
  });
  assert.ok(out);
  assert.equal(out.commissionAmount, 1_000);
  assert.equal(out.ownerReceives, 0);
}

// Reject negative price / out-of-range rate / non-finite
{
  assert.equal(
    calculateRealEstateCommission({ housePrice: -1, commissionPercent: 2 }),
    null
  );
  assert.equal(
    calculateRealEstateCommission({ housePrice: 100, commissionPercent: -1 }),
    null
  );
  assert.equal(
    calculateRealEstateCommission({ housePrice: 100, commissionPercent: 101 }),
    null
  );
  assert.equal(
    calculateRealEstateCommission({
      housePrice: Number.NaN,
      commissionPercent: 2,
    }),
    null
  );
  assert.equal(
    calculateRealEstateCommission({
      housePrice: 100,
      commissionPercent: Number.POSITIVE_INFINITY,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatRealEstateCommissionMoney(200000, 'PKR'), '200,000.00');
  assert.equal(formatRealEstateCommissionMoney(0, 'PKR'), '0.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validateRealEstateCommissionInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path
{
  const ok = validateRealEstateCommissionInput({
    ...createDefaultInput(),
    housePrice: '10000000',
    commissionPercent: '2',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.commissionAmountCanonical, 200_000);
  assert.equal(ok.result.ownerReceivesCanonical, 9_800_000);
  assert.equal(ok.result.formattedCommissionAmount, '200,000.00');
  assert.equal(ok.result.formattedOwnerReceives, '9,800,000.00');
}

// Validation: reject house price < 0 and rate outside 0–100
{
  const neg = validateRealEstateCommissionInput({
    ...createDefaultInput(),
    housePrice: '-1',
    commissionPercent: '2',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.housePrice);

  const over = validateRealEstateCommissionInput({
    ...createDefaultInput(),
    housePrice: '100',
    commissionPercent: '150',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.commissionPercent);
}

// Validation: mixed result currencies without rates → blocked (never 1:1)
{
  const mixed = validateRealEstateCommissionInput(
    {
      ...createDefaultInput(),
      housePrice: '1000',
      housePriceCurrency: 'USD',
      commissionPercent: '5',
      commissionAmountCurrency: 'PKR',
      ownerReceivesCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → convert results only
{
  const rates = {
    available: true,
    baseCurrency: 'USD',
    rates: { USD: 1, PKR: 280 },
    fetchedAt: new Date().toISOString(),
    isStale: false,
    staleThresholdHours: 48,
    supportedCurrencies: ['USD', 'PKR'],
  };
  const mixed = validateRealEstateCommissionInput(
    {
      ...createDefaultInput(),
      housePrice: '1000',
      housePriceCurrency: 'USD',
      commissionPercent: '5',
      commissionAmountCurrency: 'PKR',
      ownerReceivesCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Commission = 50 USD → 14,000 PKR; Owner = 950 USD → 266,000 PKR
  assert.equal(mixed.result.commissionAmountCanonical, 50);
  assert.equal(mixed.result.ownerReceivesCanonical, 950);
  assert.equal(mixed.result.commissionAmount, 14_000);
  assert.equal(mixed.result.ownerReceives, 266_000);
  assert.equal(mixed.result.commissionAmountCurrency, 'PKR');
  assert.equal(mixed.result.ownerReceivesCurrency, 'PKR');
}

console.log('real-estate-commission calculation.test.ts: ok');
