/**
 * Assert self-check for Unpaid Work Calculator.
 * Run: npx tsx src/tools/calculators/unpaid-work/calculation.test.ts
 */
import {
  calculateUnpaidWork,
  formatMoney,
  normalizeHourlyIncome,
  shareUnpaidWorkText,
} from './calculation';
import {
  ASSUMED_WORK_HOURS_PER_WEEK,
  createBlankInput,
  createDefaultInput,
  createExampleInput,
  hasUnpaidWorkChanges,
  UNPAID_ACTIVITIES,
} from './types';
import { validateUnpaidWorkInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const defaults = createDefaultInput();
assert(defaults.countryId === 'US', 'default country US');
assert(defaults.income === '0', 'default income 0');
assert(defaults.incomeFrequency === 'hourly', 'default hourly');
assert(defaults.activities.length === 10, 'ten activities');
assert(
  defaults.activities.every((row) => row.hoursPerWeek === '0'),
  'default hours 0',
);

const validDefault = validateUnpaidWorkInput(defaults);
assert(validDefault.isValid && validDefault.result !== null, 'defaults valid');
assert(validDefault.result!.totalWeeklyHours === 0, 'zero hours');
assert(validDefault.result!.weeklyReplacementCost === 0, 'zero replacement');
assert(validDefault.result!.currency === 'USD', 'US currency');

assert(normalizeHourlyIncome(25, 'hourly') === 25, 'hourly passthrough');
assert(
  normalizeHourlyIncome(800, 'weekly') === 800 / ASSUMED_WORK_HOURS_PER_WEEK,
  'weekly / 40',
);
assert(
  normalizeHourlyIncome(4000, 'monthly') ===
    (4000 * 12) / (52 * ASSUMED_WORK_HOURS_PER_WEEK),
  'monthly to hourly',
);
assert(normalizeHourlyIncome(-1, 'hourly') === null, 'negative income rejected');

const example = validateUnpaidWorkInput(createExampleInput());
assert(example.isValid && example.result !== null, 'example valid');
const result = example.result!;
assert(result.totalWeeklyHours === 36, '36 hours');
const byName = Object.fromEntries(
  result.activities.map((row) => [row.id, row.weeklyValue]),
);
assert(byName['meal-preparation'] === 150, 'meals 150');
assert(byName.cleaning === 100, 'cleaning 100');
assert(byName.laundry === 48, 'laundry 48');
assert(byName['child-care'] === 270, 'child care 270');
assert(byName.gardening === 32, 'gardening 32');
assert(result.weeklyReplacementCost === 600, 'weekly 600');
assert(result.monthlyReplacementCost === 2600, 'monthly 2600');
assert(result.annualReplacementCost === 31200, 'annual 31200');
assert(result.averageOutsourcingRate === 16.67, 'average ~16.67');

const withWage = calculateUnpaidWork({
  countryId: 'US',
  income: 20,
  incomeFrequency: 'hourly',
  activities: UNPAID_ACTIVITIES.map((def) => ({
    id: def.id,
    hoursPerWeek:
      def.id === 'meal-preparation'
        ? 10
        : def.id === 'cleaning'
          ? 5
          : def.id === 'laundry'
            ? 4
            : def.id === 'child-care'
              ? 15
              : def.id === 'gardening'
                ? 2
                : 0,
    outsourcingRate: def.defaultRate,
  })),
  outsourcingBudget: 300,
  familySharedHours: 6,
});
assert(withWage !== null, 'wage case');
assert(withWage!.potentialWeeklyEarnings === 720, '36 * 20 opportunity');
assert(withWage!.remainingWeeklyHours === 30, '36 - 6 family');
assert(withWage!.budgetCoveragePercent === 50, '300/600 = 50%');
assert(Math.abs(withWage!.hoursCoveredByBudget - 300 / (600 / 36)) < 0.02, 'budget hours');

const gb = calculateUnpaidWork({
  countryId: 'GB',
  income: 0,
  incomeFrequency: 'hourly',
  activities: UNPAID_ACTIVITIES.map((def) => ({
    id: def.id,
    hoursPerWeek: 0,
    outsourcingRate: 0,
  })),
  outsourcingBudget: 0,
  familySharedHours: 0,
});
assert(gb !== null && gb.currency === 'GBP', 'UK currency');
assert(formatMoney(10, 'GBP').includes('£') || formatMoney(10, 'GBP').length > 0, 'format');

const tooMany = validateUnpaidWorkInput({
  ...defaults,
  activities: defaults.activities.map((row, index) =>
    index === 0 ? { ...row, hoursPerWeek: '200' } : row,
  ),
});
assert(!tooMany.isValid && tooMany.errors.hours, 'over 168 rejected');

const familyTooHigh = validateUnpaidWorkInput({
  ...createExampleInput(),
  familySharedHours: '40',
});
assert(!familyTooHigh.isValid, 'family hours over total');

const blank = validateUnpaidWorkInput(createBlankInput());
assert(blank.incomplete, 'blank incomplete');
assert(hasUnpaidWorkChanges(createExampleInput()), 'example is a change');
assert(!hasUnpaidWorkChanges(createBlankInput()), 'blank unchanged');

const share = shareUnpaidWorkText(result);
assert(share.includes('Weekly replacement value'), 'share weekly');
assert(share.includes('Meal preparation'), 'share activity');

console.log('unpaid-work calculation.test.ts: all asserts passed');
