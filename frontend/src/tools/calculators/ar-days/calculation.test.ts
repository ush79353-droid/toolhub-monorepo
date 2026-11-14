import assert from 'node:assert/strict';
import { averageReceivable, calculateARDays, receivablesUsedForInputs } from './calculation';
import { createDefaultARDaysInput, type ARDaysInput } from './types';
import { validateARDays } from './validation';

function base(patch: Partial<ARDaysInput> = {}): ARDaysInput {
  return {
    ...createDefaultARDaysInput(),
    accountsReceivable: 50000,
    netCreditSales: 500000,
    periodDays: 365,
    ...patch,
  };
}

{
  // Screenshot reference: 50,000 / 500,000 × 365 = 36.5
  const result = calculateARDays(base());
  assert.equal(result.defined, true);
  assert.equal(result.arDays, 36.5);
  assert.equal(result.accountsReceivableUsed, 50000);
  assert.equal(result.netCreditSales, 500000);
  assert.equal(result.periodDays, 365);
  assert.equal(result.averageReceivable, null);
  assert.equal(result.balanceMethod, 'ending');
}

{
  assert.equal(averageReceivable(40000, 60000), 50000);
  const result = calculateARDays(
    base({
      balanceMethod: 'average',
      beginningReceivable: 40000,
      endingReceivable: 60000,
    })
  );
  assert.equal(result.accountsReceivableUsed, 50000);
  assert.equal(result.averageReceivable, 50000);
  assert.equal(result.arDays, 36.5);

  // Omni-style average example: (15k + 24k) / 2 with 150k sales → 47.45
  const seasonal = calculateARDays(
    base({
      balanceMethod: 'average',
      beginningReceivable: 15000,
      endingReceivable: 24000,
      netCreditSales: 150000,
    })
  );
  assert.ok(Math.abs((seasonal.arDays ?? 0) - 47.45) < 1e-9);

  const ending = calculateARDays(
    base({ balanceMethod: 'ending', accountsReceivable: 80000, beginningReceivable: 0, endingReceivable: 0 })
  );
  assert.equal(ending.accountsReceivableUsed, 80000);
  assert.notEqual(
    ending.arDays,
    calculateARDays(base({ balanceMethod: 'average', beginningReceivable: 0, endingReceivable: 0 })).arDays
  );
}

{
  // Switching methods must not silently mix ending and average
  const endingUsed = receivablesUsedForInputs(base({ accountsReceivable: 80000, balanceMethod: 'ending' }));
  assert.equal(endingUsed, 80000);
  const averageUsed = receivablesUsedForInputs(
    base({
      balanceMethod: 'average',
      accountsReceivable: 80000,
      beginningReceivable: 10000,
      endingReceivable: 30000,
    })
  );
  assert.equal(averageUsed, 20000);
  assert.notEqual(endingUsed, averageUsed);
}

{
  const zeroAr = calculateARDays(base({ accountsReceivable: 0 }));
  assert.equal(zeroAr.defined, true);
  assert.equal(zeroAr.arDays, 0);
}

{
  const zeroSales = validateARDays(base({ netCreditSales: 0 }));
  assert.equal(zeroSales.isValid, false);
  assert.match(zeroSales.errors.form ?? '', /zero/i);
  const both = validateARDays(base({ accountsReceivable: 0, netCreditSales: 0 }));
  assert.equal(both.isValid, false);
  assert.match(both.errors.form ?? '', /indeterminate/i);
}

{
  const negative = validateARDays(base({ periodDays: -10 }));
  assert.equal(negative.isValid, false);
  assert.ok(negative.errors.periodDays);
  const zeroPeriod = validateARDays(base({ periodDays: 0 }));
  assert.ok(zeroPeriod.errors.periodDays);
  const blank = validateARDays(base({ accountsReceivable: Number.NaN }));
  assert.ok(blank.errors.accountsReceivable);
  const negativeMoney = validateARDays(base({ netCreditSales: -5 }));
  assert.ok(negativeMoney.errors.netCreditSales);
}

{
  const emptyDefaults = createDefaultARDaysInput();
  assert.equal(Number.isFinite(emptyDefaults.accountsReceivable), false);
  assert.equal(Number.isFinite(emptyDefaults.netCreditSales), false);
  assert.equal(emptyDefaults.periodDays, 365);
  assert.equal(emptyDefaults.balanceMethod, 'ending');
  const emptyValidation = validateARDays(emptyDefaults);
  assert.equal(emptyValidation.isValid, false);
  const emptyCalc = calculateARDays(emptyDefaults);
  assert.equal(emptyCalc.defined, false);
  assert.equal(emptyCalc.arDays, null);
}

{
  const large = calculateARDays(base({ accountsReceivable: 1e12, netCreditSales: 2e12, periodDays: 365 }));
  assert.equal(large.defined, true);
  assert.ok(Math.abs((large.arDays ?? 0) - 182.5) < 1e-6);
  const awkward = calculateARDays(base({ accountsReceivable: 1, netCreditSales: 3, periodDays: 365 }));
  assert.equal(awkward.defined, true);
  assert.ok(Number.isFinite(awkward.arDays));
  assert.ok(Math.abs((awkward.arDays ?? 0) - 365 / 3) < 1e-9);
}

{
  const partial = validateARDays(
    base({ balanceMethod: 'average', beginningReceivable: 1000, endingReceivable: Number.NaN })
  );
  assert.equal(partial.isValid, false);
  assert.ok(partial.errors.endingReceivable);
  assert.equal(partial.errors.beginningReceivable, undefined);
}

{
  // Collapsed section preserves method and average inputs in state (engine-level)
  const withAverageInputs = base({
    balanceMethod: 'average',
    beginningReceivable: 40000,
    endingReceivable: 60000,
  });
  const first = calculateARDays(withAverageInputs);
  const second = calculateARDays({ ...withAverageInputs });
  assert.equal(first.arDays, second.arDays);
  assert.equal(first.balanceMethod, 'average');
  assert.equal(withAverageInputs.beginningReceivable, 40000);
  assert.equal(withAverageInputs.endingReceivable, 60000);

  const reset = createDefaultARDaysInput();
  assert.equal(reset.balanceMethod, 'ending');
  assert.equal(Number.isFinite(reset.beginningReceivable), false);
  assert.equal(validateARDays(reset).isValid, false);
}

{
  // Screenshot field parity: three primary inputs + one result; no reverse solve
  const inputKeys = Object.keys(createDefaultARDaysInput()).sort();
  assert.deepEqual(inputKeys, [
    'accountsReceivable',
    'balanceMethod',
    'beginningReceivable',
    'currency',
    'endingReceivable',
    'netCreditSales',
    'periodDays',
  ]);
  assert.equal('solveFor' in createDefaultARDaysInput(), false);
  assert.equal('arDays' in createDefaultARDaysInput(), false);
}

console.log('ar days calculation.test ok');
