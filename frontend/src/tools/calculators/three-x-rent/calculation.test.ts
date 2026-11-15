import assert from 'node:assert/strict';
import { calculateThreeXRent, equalSharePercents, roundMoney, splitMoney } from './calculation';
import { DEFAULT_THREE_X_RENT_INPUT, type ThreeXRentInput } from './types';
import { parseOptionalNumber, validateThreeXRent } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function withInput(patch: Partial<ThreeXRentInput>): ThreeXRentInput {
  return { ...DEFAULT_THREE_X_RENT_INPUT, ...patch };
}

function sum(values: readonly number[]): number {
  return roundMoney(values.reduce((acc, value) => acc + value, 0));
}

console.log('Running 3x Rent Calculator unit tests...');

test('standard 3× rent: 1,500 rent requires 4,500 monthly and 54,000 annual', () => {
  const result = calculateThreeXRent(withInput({ monthlyRent: 1500, multiplier: 3 }));
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 4500);
  assert.equal(result.requiredAnnualIncome, 54000);
  assert.equal(result.rentToIncomePercent, 33.33);
  assert.equal(result.tenantLines.length, 0);
  assert.equal(result.split, 'single');
});

test('annual income is twelve times the rounded monthly requirement', () => {
  const result = calculateThreeXRent(withInput({ monthlyRent: 2000, multiplier: 3 }));
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 6000);
  assert.equal(result.requiredAnnualIncome, 72000);
  const smaller = calculateThreeXRent(withInput({ monthlyRent: 800, multiplier: 3 }));
  assert.ok(smaller);
  assert.equal(smaller.requiredMonthlyIncome, 2400);
  assert.equal(smaller.requiredAnnualIncome, 28800);
});

test('two tenants split the requirement equally', () => {
  const result = calculateThreeXRent(
    withInput({ monthlyRent: 1500, multiplier: 3, multipleTenants: true, tenantCount: 2, split: 'equal' }),
  );
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 4500);
  assert.equal(result.tenantLines.length, 2);
  assert.equal(result.tenantLines[0]?.monthly, 2250);
  assert.equal(result.tenantLines[1]?.monthly, 2250);
  assert.equal(result.tenantLines[0]?.annual, 27000);
  assert.equal(result.tenantLines[1]?.annual, 27000);
  assert.equal(sum(result.tenantLines.map((line) => line.monthly)), 4500);
  assert.equal(sum(result.tenantLines.map((line) => line.annual)), 54000);
});

test('three tenants absorb the leftover cent', () => {
  const result = calculateThreeXRent(
    withInput({ monthlyRent: 100, multiplier: 3, multipleTenants: true, tenantCount: 3, split: 'equal' }),
  );
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 300);
  assert.equal(sum(result.tenantLines.map((line) => line.monthly)), 300);
  assert.equal(sum(result.tenantLines.map((line) => line.annual)), 3600);
  assert.ok(result.tenantLines.every((line) => line.monthly === 100));
});

test('custom shares divide the household requirement unequally', () => {
  const result = calculateThreeXRent(
    withInput({
      monthlyRent: 1500,
      multiplier: 3,
      multipleTenants: true,
      tenantCount: 2,
      split: 'custom',
      sharePercents: [60, 40],
    }),
  );
  assert.ok(result);
  assert.equal(result.tenantLines[0]?.monthly, 2700);
  assert.equal(result.tenantLines[1]?.monthly, 1800);
  assert.equal(result.tenantLines[0]?.annual, 32400);
  assert.equal(result.tenantLines[1]?.annual, 21600);
  assert.equal(result.split, 'custom');
});

test('individual incomes are combined before the affordable-rent limit', () => {
  const result = calculateThreeXRent(
    withInput({
      mode: 'affordable-rent',
      multipleTenants: true,
      tenantCount: 2,
      tenantIncomes: [2000, 2500],
      multiplier: 3,
    }),
  );
  assert.ok(result);
  assert.equal(result.grossMonthlyIncome, 4500);
  assert.equal(result.grossAnnualIncome, 54000);
  assert.equal(result.maximumMonthlyRent, 1500);
  assert.equal(result.maximumAnnualRent, 18000);
  assert.equal(result.rentToIncomePercent, 33.33);
  assert.equal(result.tenantLines[0]?.monthly, 2000);
  assert.equal(result.tenantLines[1]?.monthly, 2500);
});

test('a single gross income reverses the 3× rule', () => {
  const result = calculateThreeXRent(
    withInput({ mode: 'affordable-rent', grossMonthlyIncome: 4500, multiplier: 3, multipleTenants: false }),
  );
  assert.ok(result);
  assert.equal(result.maximumMonthlyRent, 1500);
  assert.equal(result.maximumAnnualRent, 18000);
  assert.equal(result.tenantLines.length, 0);
});

test('a custom multiplier changes the income requirement and the rent ratio', () => {
  const result = calculateThreeXRent(withInput({ monthlyRent: 1500, multiplier: 4 }));
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 6000);
  assert.equal(result.requiredAnnualIncome, 72000);
  assert.equal(result.rentToIncomePercent, 25);
  const twoAndHalf = calculateThreeXRent(withInput({ monthlyRent: 1000, multiplier: 2.5 }));
  assert.ok(twoAndHalf);
  assert.equal(twoAndHalf.requiredMonthlyIncome, 2500);
  assert.equal(twoAndHalf.rentToIncomePercent, 40);
});

test('zero rent and zero income stay finite', () => {
  const required = calculateThreeXRent(withInput({ monthlyRent: 0, multiplier: 3 }));
  assert.ok(required);
  assert.equal(required.requiredMonthlyIncome, 0);
  assert.equal(required.requiredAnnualIncome, 0);
  const affordable = calculateThreeXRent(
    withInput({ mode: 'affordable-rent', grossMonthlyIncome: 0, multiplier: 3 }),
  );
  assert.ok(affordable);
  assert.equal(affordable.maximumMonthlyRent, 0);
  assert.equal(affordable.maximumAnnualRent, 0);
});

test('negative, blank, zero multiplier, and non-integers are rejected', () => {
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: -1 })), null);
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: null })), null);
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: 1500, multiplier: 0 })), null);
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: 1500, multiplier: -3 })), null);
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: Number.NaN })), null);
  assert.equal(calculateThreeXRent(withInput({ monthlyRent: Number.POSITIVE_INFINITY })), null);
  assert.equal(
    calculateThreeXRent(withInput({ monthlyRent: 1500, multipleTenants: true, tenantCount: 1 })),
    null,
  );
  assert.equal(
    calculateThreeXRent(withInput({ monthlyRent: 1500, multipleTenants: true, tenantCount: 2.5 })),
    null,
  );

  const negative = validateThreeXRent(withInput({ monthlyRent: -10 }));
  assert.equal(negative.isValid, false);
  assert.match(negative.errors.monthlyRent ?? '', /negative/);

  const blank = validateThreeXRent(withInput({ monthlyRent: null }));
  assert.equal(blank.isValid, false);
  assert.equal(blank.errors.monthlyRent, undefined);

  const zeroMultiplier = validateThreeXRent(withInput({ monthlyRent: 1500, multiplier: 0 }));
  assert.match(zeroMultiplier.errors.multiplier ?? '', /greater than 0/);

  const shares = validateThreeXRent(
    withInput({
      monthlyRent: 1500,
      multipleTenants: true,
      tenantCount: 2,
      split: 'custom',
      sharePercents: [70, 20],
    }),
  );
  assert.equal(shares.isValid, false);
  assert.match(shares.errors.sharePercents ?? '', /100%/);
});

test('decimal rent is rounded to the nearest hundredth after multiplying', () => {
  const result = calculateThreeXRent(withInput({ monthlyRent: 1500.55, multiplier: 3 }));
  assert.ok(result);
  assert.equal(result.requiredMonthlyIncome, 4501.65);
  assert.equal(result.requiredAnnualIncome, 54019.8);
  const rounded = calculateThreeXRent(withInput({ monthlyRent: 10.004, multiplier: 3 }));
  assert.ok(rounded);
  assert.equal(rounded.requiredMonthlyIncome, 30.01);
});

test('blank draft values and a cleared multiplier do not become numbers', () => {
  assert.equal(parseOptionalNumber(''), null);
  assert.equal(parseOptionalNumber('   '), null);
  assert.equal(parseOptionalNumber('.'), null);
  assert.equal(parseOptionalNumber('1500'), 1500);
  assert.equal(parseOptionalNumber('1500.55'), 1500.55);
  assert.equal(Number.isNaN(parseOptionalNumber('abc')), true);
  assert.equal(Number.isNaN(parseOptionalNumber('Infinity')), true);
  const reset = { ...DEFAULT_THREE_X_RENT_INPUT };
  assert.equal(reset.monthlyRent, null);
  assert.equal(reset.multiplier, 3);
  assert.equal(reset.currency, 'PKR');
  assert.equal(reset.multipleTenants, false);
  assert.equal(reset.mode, 'required-income');
  assert.equal(calculateThreeXRent(reset), null);
});

test('equal percent helpers and cent splits sum to the original total', () => {
  assert.deepEqual(equalSharePercents(2), [50, 50]);
  const thirds = splitMoney(100, [1, 1, 1]);
  assert.equal(sum(thirds), 100);
  assert.equal(thirds.length, 3);
  const pennies = splitMoney(0.05, Array.from({ length: 10 }, () => 1));
  assert.equal(sum(pennies), 0.05);
  assert.ok(pennies.every((value) => value >= 0));
});

console.log('3x Rent Calculator unit tests finished.');
