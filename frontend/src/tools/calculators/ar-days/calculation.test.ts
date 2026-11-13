import assert from 'node:assert/strict';
import { averageReceivable, calculateARDays } from './calculation';
import { createDefaultARDaysInput, type ARDaysInput } from './types';
import { validateARDays } from './validation';

function base(patch: Partial<ARDaysInput> = {}): ARDaysInput {
  return { ...createDefaultARDaysInput(), ...patch };
}

{
  const result = calculateARDays(base());
  assert.equal(result.defined, true);
  assert.equal(result.arDays, 182.5);
  assert.equal(result.accountsReceivableUsed, 50000);
  assert.equal(result.netCreditSales, 100000);
  assert.equal(result.periodDays, 365);
  assert.equal(result.averageReceivable, null);
  assert.equal(result.receivablesTurnover, 2);
  assert.equal(result.formula?.arDays, 182.5);
}

{
  assert.equal(averageReceivable(40000, 60000), 50000);
  const result = calculateARDays(base({ balanceMethod: 'average' }));
  assert.equal(result.accountsReceivableUsed, 50000);
  assert.equal(result.averageReceivable, 50000);
  assert.equal(result.arDays, 182.5);
  const ending = calculateARDays(
    base({ balanceMethod: 'ending', accountsReceivable: 80000, beginningReceivable: 0, endingReceivable: 0 })
  );
  assert.equal(ending.accountsReceivableUsed, 80000);
  assert.notEqual(ending.arDays, calculateARDays(base({ balanceMethod: 'average', beginningReceivable: 0, endingReceivable: 0 })).arDays);
}

{
  const receivables = calculateARDays(
    base({ solveFor: 'receivables', arDays: 182.5, netCreditSales: 100000, periodDays: 365 })
  );
  assert.equal(receivables.accountsReceivableUsed, 50000);
  const sales = calculateARDays(
    base({ solveFor: 'creditSales', accountsReceivable: 50000, arDays: 182.5, periodDays: 365 })
  );
  assert.equal(sales.netCreditSales, 100000);
  const days = calculateARDays(
    base({ solveFor: 'periodDays', accountsReceivable: 50000, netCreditSales: 100000, arDays: 182.5 })
  );
  assert.equal(days.periodDays, 365);
}

{
  const zeroAr = calculateARDays(base({ accountsReceivable: 0 }));
  assert.equal(zeroAr.defined, true);
  assert.equal(zeroAr.arDays, 0);
  assert.equal(zeroAr.receivablesTurnover, null);
}

{
  const zeroSales = validateARDays(base({ netCreditSales: 0 }));
  assert.equal(zeroSales.isValid, false);
  assert.match(zeroSales.errors.form ?? '', /undefined|zero/i);
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
  const inverse = validateARDays(base({ solveFor: 'creditSales', arDays: 0, accountsReceivable: 50000, periodDays: 365 }));
  assert.equal(inverse.isValid, false);
  assert.match(inverse.errors.form ?? '', /undefined/i);
  const indeterminate = validateARDays(
    base({ solveFor: 'periodDays', accountsReceivable: 0, arDays: 0, netCreditSales: 0 })
  );
  assert.equal(indeterminate.isValid, false);
  assert.match(indeterminate.errors.form ?? '', /indeterminate/i);
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
  const first = calculateARDays(base());
  const second = calculateARDays(createDefaultARDaysInput());
  assert.equal(first.arDays, second.arDays);
  assert.equal(first.netCreditSales, second.netCreditSales);
  const reset = validateARDays(createDefaultARDaysInput());
  assert.equal(reset.isValid, true);
}

console.log('ar days calculation.test ok');
