import assert from 'node:assert/strict';
import {
  calculateCompanyPayoutRatio,
  calculatePerSharePayoutRatio,
  formatPayoutPercent,
} from './calculation';
import { validateDividendPayoutRatioInput } from './validation';
import { createDefaultInput } from './types';

// Company: 40,000 / 100,000 → 40%
{
  const out = calculateCompanyPayoutRatio({
    totalDividends: 40_000,
    netIncome: 100_000,
  });
  assert.equal(out, 40);
}

// Per share: 2 / 5 → 40%
{
  const out = calculatePerSharePayoutRatio({
    declaredDps: 2,
    dilutedEps: 5,
  });
  assert.equal(out, 40);
}

// Above 100%
{
  const out = calculateCompanyPayoutRatio({
    totalDividends: 150_000,
    netIncome: 100_000,
  });
  assert.equal(out, 150);
}

// Negative NI → negative ratio (diagnostic, not conventional)
{
  const out = calculateCompanyPayoutRatio({
    totalDividends: 10_000,
    netIncome: -50_000,
  });
  assert.equal(out, -20);
}

// Zero NI / zero EPS → undefined (null), not 0
{
  assert.equal(
    calculateCompanyPayoutRatio({ totalDividends: 10_000, netIncome: 0 }),
    null
  );
  assert.equal(
    calculatePerSharePayoutRatio({ declaredDps: 1, dilutedEps: 0 }),
    null
  );
}

// Non-finite rejected
{
  assert.equal(
    calculateCompanyPayoutRatio({ totalDividends: Number.NaN, netIncome: 1 }),
    null
  );
  assert.equal(
    calculatePerSharePayoutRatio({
      declaredDps: Number.POSITIVE_INFINITY,
      dilutedEps: 1,
    }),
    null
  );
}

assert.equal(formatPayoutPercent(40), '40.00');
assert.equal(formatPayoutPercent(40.123456789), '40.12345679');

{
  const empty = validateDividendPayoutRatioInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);

  const companyOnly = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    totalDividends: '40000',
    netIncome: '100000',
  });
  assert.equal(companyOnly.isValid, true);
  assert.ok(companyOnly.result);
  assert.equal(companyOnly.result.payoutRatioPercent, 40);
  assert.equal(companyOnly.result.formattedPayoutRatioPercent, '40.00');
  assert.equal(companyOnly.result.payoutPerSharePercent, null);

  const perShareOnly = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    declaredDps: '2',
    dilutedEps: '5',
  });
  assert.equal(perShareOnly.isValid, true);
  assert.ok(perShareOnly.result);
  assert.equal(perShareOnly.result.payoutPerSharePercent, 40);
  assert.equal(perShareOnly.result.payoutRatioPercent, null);

  const both = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    totalDividends: '40000',
    netIncome: '100000',
    declaredDps: '2',
    dilutedEps: '5',
  });
  assert.equal(both.isValid, true);
  assert.ok(both.result);
  assert.equal(both.result.payoutRatioPercent, 40);
  assert.equal(both.result.payoutPerSharePercent, 40);
  assert.equal(both.result.isAbove100, false);
  assert.equal(both.result.isNegative, false);

  const zeroNi = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    totalDividends: '1000',
    netIncome: '0',
  });
  assert.equal(zeroNi.isValid, false);
  assert.ok(zeroNi.errors.netIncome);

  const zeroEps = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    declaredDps: '1',
    dilutedEps: '0',
  });
  assert.equal(zeroEps.isValid, false);
  assert.ok(zeroEps.errors.dilutedEps);

  const above = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    totalDividends: '150000',
    netIncome: '100000',
  });
  assert.equal(above.isValid, true);
  assert.ok(above.result?.isAbove100);

  const neg = validateDividendPayoutRatioInput({
    ...createDefaultInput(),
    totalDividends: '10000',
    netIncome: '-50000',
  });
  assert.equal(neg.isValid, true);
  assert.ok(neg.result?.isNegative);
  assert.equal(neg.result?.payoutRatioPercent, -20);
}

console.log('dividend-payout-ratio calculation.test.ts: all assertions passed');
