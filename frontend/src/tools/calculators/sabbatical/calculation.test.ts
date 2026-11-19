/**
 * Assert self-check for Sabbatical Calculator.
 * Run: npx tsx src/tools/calculators/sabbatical/calculation.test.ts
 */
import {
  calculateAccumulatedSavings,
  calculateAffordableMonths,
  calculateAvailableFund,
  calculateEmergencyBuffer,
  calculateMonthlySavings,
  calculateRequiredFund,
  calculateSabbaticalResults,
  durationToMonths,
  formatDurationMonths,
  formatMoney,
  roundMoney,
  shareSabbaticalText,
  suggestedMonthlySavingsString,
} from './calculation';
import { createDefaultInput } from './types';
import { validateSabbaticalInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

assert(calculateMonthlySavings(5000, 50) === 2500, '50% of 5000 = 2500');
assert(calculateMonthlySavings(5000, 0) === 0, '0% savings');
assert(calculateMonthlySavings(-1, 50) === null, 'negative income rejected');
assert(calculateMonthlySavings(5000, 101) === null, 'pct > 100 rejected');

assert(calculateAccumulatedSavings(2500, 1) === 30000, '1y accumulate');
assert(calculateAccumulatedSavings(2500, 0) === null, 'years must be > 0');

assert(calculateAvailableFund(0, 30000) === 30000, 'available = current + accum');
assert(calculateAvailableFund(5000, 30000) === 35000, 'with current savings');

assert(durationToMonths(1, 'years') === 12, '1 year → 12 months');
assert(durationToMonths(6, 'months') === 6, '6 months');
assert(
  Math.abs((durationToMonths(4, 'weeks') ?? 0) - (48 / 52)) < 1e-9,
  '4 weeks → 48/52 months',
);
assert(durationToMonths(0, 'years') === null, 'zero duration rejected');

assert(calculateRequiredFund(3000, 12) === 36000, 'required fund');
assert(calculateEmergencyBuffer(36000, 10) === 3600, '10% buffer');
assert(calculateEmergencyBuffer(36000, -1) === null, 'negative buffer rejected');

assert(
  Math.abs((calculateAffordableMonths(30000, 3000, 10) ?? 0) - 30000 / 3300) <
    1e-9,
  'affordable months with buffer',
);
assert(
  calculateAffordableMonths(30000, 0, 10) === null,
  'zero expenses → no affordable months',
);

const defaults = createDefaultInput();
const validation = validateSabbaticalInput(defaults);
assert(validation.isValid && validation.result !== null, 'defaults valid');
const result = validation.result!;
assert(result.monthlySavings === 2500, 'default monthly savings');
assert(result.accumulatedSavings === 30000, 'default accumulated');
assert(result.totalAvailableFund === 30000, 'default available');
assert(result.requiredFund === 36000, 'default required');
assert(result.emergencyBuffer === 3600, 'default buffer');
assert(result.totalRequired === 39600, 'default total required');
assert(result.savingsSurplus === -9600, 'default shortfall');
assert(!result.isAffordable, 'defaults not affordable');
assert(
  result.statusMessage.includes('additional savings'),
  'shortfall status message',
);

const surplusPlan = calculateSabbaticalResults({
  savingsPercentage: 50,
  yearsToSave: 2,
  desiredDurationValue: 1,
  durationUnit: 'years',
  monthlyIncome: 5000,
  monthlySavings: 2500,
  currentSavings: 0,
  monthlyExpenses: 3000,
  bufferPercentage: 10,
  currency: 'USD',
});
assert(surplusPlan !== null && surplusPlan.isAffordable, '2y plan affordable');
assert(surplusPlan!.totalAvailableFund === 60000, '2y available 60k');
assert(surplusPlan!.savingsSurplus === 20400, 'surplus 20400');
assert(
  surplusPlan!.statusMessage.includes('on track'),
  'on-track status message',
);

const empty = validateSabbaticalInput({
  ...createDefaultInput(),
  monthlyIncome: '',
});
assert(empty.incomplete, 'empty income incomplete');

const badPct = validateSabbaticalInput({
  ...createDefaultInput(),
  savingsPercentage: '150',
});
assert(!badPct.isValid && Boolean(badPct.errors.savingsPercentage), 'pct > 100');

assert(suggestedMonthlySavingsString('5000', '50') === '2500', 'suggested savings');
assert(roundMoney(1.005, 'USD') === 1.01 || roundMoney(1.005, 'USD') === 1, 'round money');
assert(formatMoney(2500, 'USD').includes('2'), 'format money');
assert(formatDurationMonths(12).includes('year'), '12 months → year');
assert(shareSabbaticalText(result).includes('Sabbatical Calculator'), 'share text');

const zeroIncome = calculateSabbaticalResults({
  savingsPercentage: 50,
  yearsToSave: 1,
  desiredDurationValue: 1,
  durationUnit: 'months',
  monthlyIncome: 0,
  monthlySavings: 0,
  currentSavings: 10000,
  monthlyExpenses: 2000,
  bufferPercentage: 0,
  currency: 'USD',
});
assert(zeroIncome !== null, 'zero income allowed');
assert(zeroIncome!.totalAvailableFund === 10000, 'only current savings');
assert(zeroIncome!.monthlySavings === 0, 'zero monthly savings');

console.log('sabbatical calculation.test.ts: all asserts passed');
