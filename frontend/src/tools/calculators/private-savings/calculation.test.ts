import assert from 'node:assert/strict';
import {
  calculatePrivateSavings,
  formatPrivateSavingsMoney,
} from './calculation';
import { validatePrivateSavingsInput } from './validation';
import { createDefaultInput } from './types';

// Basic identity: Sp = Y − T − C
{
  const sp = calculatePrivateSavings({
    totalIncome: 100_000,
    taxes: 15_000,
    consumption: 70_000,
  });
  assert.equal(sp, 15_000);
}

// Zero savings allowed
{
  const sp = calculatePrivateSavings({
    totalIncome: 50_000,
    taxes: 10_000,
    consumption: 40_000,
  });
  assert.equal(sp, 0);
}

// Negative savings (dissaving) allowed
{
  const sp = calculatePrivateSavings({
    totalIncome: 100_000,
    taxes: 15_000,
    consumption: 95_000,
  });
  assert.equal(sp, -10_000);
}

// Reject non-finite inputs
{
  assert.equal(
    calculatePrivateSavings({
      totalIncome: Number.NaN,
      taxes: 1,
      consumption: 1,
    }),
    null
  );
  assert.equal(
    calculatePrivateSavings({
      totalIncome: 1,
      taxes: Number.POSITIVE_INFINITY,
      consumption: 1,
    }),
    null
  );
}

// Display formatting
{
  assert.equal(formatPrivateSavingsMoney(15000, 'PKR'), '15,000.00');
  assert.equal(formatPrivateSavingsMoney(-10000, 'PKR'), '-10,000.00');
}

// Validation: empty defaults → incomplete
{
  const empty = validatePrivateSavingsInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

// Validation: same-currency happy path + dissaving flag
{
  const ok = validatePrivateSavingsInput({
    ...createDefaultInput(),
    totalIncome: '100000',
    taxes: '15000',
    consumption: '70000',
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.privateSavings, 15_000);
  assert.equal(ok.result.isDissaving, false);
  assert.equal(ok.result.formattedPrivateSavings, '15,000.00');

  const dissaving = validatePrivateSavingsInput({
    ...createDefaultInput(),
    totalIncome: '100000',
    taxes: '15000',
    consumption: '95000',
  });
  assert.equal(dissaving.isValid, true);
  assert.ok(dissaving.result);
  assert.equal(dissaving.result.privateSavings, -10_000);
  assert.equal(dissaving.result.isDissaving, true);
}

// Validation: mixed currencies without rates → blocked (never 1:1)
{
  const mixed = validatePrivateSavingsInput(
    {
      ...createDefaultInput(),
      totalIncome: '100',
      totalIncomeCurrency: 'USD',
      taxes: '10',
      taxesCurrency: 'PKR',
      consumption: '20',
      consumptionCurrency: 'PKR',
      privateSavingsCurrency: 'PKR',
    },
    null
  );
  assert.equal(mixed.isValid, false);
  assert.equal(mixed.result, null);
  assert.ok(mixed.errors.form);
}

// Validation: mixed currencies with rates → normalize then Sp
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
  const mixed = validatePrivateSavingsInput(
    {
      ...createDefaultInput(),
      totalIncome: '100',
      totalIncomeCurrency: 'USD',
      taxes: '2800',
      taxesCurrency: 'PKR',
      consumption: '14000',
      consumptionCurrency: 'PKR',
      privateSavingsCurrency: 'PKR',
    },
    rates
  );
  assert.equal(mixed.isValid, true);
  assert.ok(mixed.result);
  // Y = 100 USD → 28,000 PKR; T = 2,800; C = 14,000 → Sp = 11,200
  assert.equal(mixed.result.privateSavings, 11_200);
  assert.equal(mixed.result.currency, 'PKR');
}

// Additional-parameters checkbox does not change the formula
{
  const base = validatePrivateSavingsInput({
    ...createDefaultInput(),
    totalIncome: '10',
    taxes: '2',
    consumption: '3',
    includeAdditionalParameters: false,
  });
  const withFlag = validatePrivateSavingsInput({
    ...createDefaultInput(),
    totalIncome: '10',
    taxes: '2',
    consumption: '3',
    includeAdditionalParameters: true,
  });
  assert.equal(base.result?.privateSavings, withFlag.result?.privateSavings);
  assert.equal(base.result?.privateSavings, 5);
}

console.log('private-savings calculation.test.ts: ok');
