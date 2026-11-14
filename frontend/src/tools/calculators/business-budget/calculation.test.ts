import { calculateBusinessBudget, toMonthly } from './calculation';
import { createDefaultInput, type BusinessBudgetInput } from './types';
import { validateBusinessBudget } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(toMonthly(12, 'year') === 1, 'year → month');
assert(Math.abs(toMonthly(52, 'week') - (52 * 52) / 12) < 1e-9, 'week → month');
assert(Math.abs(toMonthly(1, 'day') - 365 / 12) < 1e-9, 'day → month');
assert(toMonthly(100, 'month') === 100, 'month passthrough');

const zeros = createDefaultInput();
const zeroResult = calculateBusinessBudget(zeros);
assert(zeroResult, 'zeros produce a result');
assert(zeroResult.totalIncome === 0, 'zero income');
assert(zeroResult.totalExpenses === 0, 'zero expenses');
assert(zeroResult.budgetBalance === 0, 'zero balance');
assert(zeroResult.initialInvestment === 0, 'zero investment');

const sample: BusinessBudgetInput = {
  ...createDefaultInput(),
  income1: { amount: 10_000, period: 'month' },
  income2: { amount: 12_000, period: 'year' }, // 1,000 / mo
  interestIncome: { amount: 600, period: 'year' }, // 50 / mo
  dividends: { amount: 100, period: 'month' },
  furniture: 5_000,
  startingInventory: 3_000,
  managerSalary: { amount: 2_000, period: 'month' },
  rent: { amount: 1_500, period: 'month' },
  utilities: { amount: 1_200, period: 'year' }, // 100 / mo
};

const result = calculateBusinessBudget(sample);
assert(result, 'sample produces a result');
assert(Math.abs(result.totalOperatingIncome - 11_000) < 1e-9, 'operating income');
assert(Math.abs(result.totalNonOperatingIncome - 150) < 1e-9, 'non-operating income');
assert(Math.abs(result.totalIncome - 11_150) < 1e-9, 'total income');
assert(Math.abs(result.totalOneTimeCosts - 8_000) < 1e-9, 'one-time');
assert(Math.abs(result.initialInvestment - 8_000) < 1e-9, 'initial investment mirrors one-time');
assert(Math.abs(result.totalSalaries - 2_000) < 1e-9, 'salaries');
assert(Math.abs(result.totalMonthlyExpenses - 1_600) < 1e-9, 'monthly expenses');
assert(Math.abs(result.totalExpenses - 3_600) < 1e-9, 'expenses exclude one-time');
assert(Math.abs(result.budgetBalance - 7_550) < 1e-9, 'budget balance');

const bad = validateBusinessBudget({
  ...createDefaultInput(),
  income1: { amount: -1, period: 'month' },
});
assert(!bad.isValid && bad.errors.income1, 'rejects negative');

const ok = validateBusinessBudget(sample);
assert(ok.isValid && ok.result, 'valid sample');

console.log('business-budget calculation.test.ts: ok');
