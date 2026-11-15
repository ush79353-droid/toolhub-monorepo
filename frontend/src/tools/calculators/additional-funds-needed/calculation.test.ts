import assert from 'node:assert/strict';
import { afnInterpretation, calculateAfn, roundMoney } from './calculation';
import {
  DEFAULT_AFN_CURRENCY,
  DEFAULT_AFN_INPUT,
  type AfnInput,
} from './types';
import { parseOptionalNumber, validateAfn } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function base(patch: Partial<AfnInput> = {}): AfnInput {
  return { ...DEFAULT_AFN_INPUT, ...patch };
}

console.log('Running Additional Funds Needed Calculator unit tests...');

test('screenshot field parity: three money inputs and one AFN output', () => {
  const keys = Object.keys(DEFAULT_AFN_INPUT).sort();
  assert.deepEqual(keys, [
    'changeInAssets',
    'changeInLiabilities',
    'changeInRetainedEarnings',
    'currency',
  ].sort());
  const result = calculateAfn(
    base({ changeInAssets: 100_000, changeInLiabilities: 30_000, changeInRetainedEarnings: 20_000 }),
  );
  assert.ok(result);
  assert.equal('additionalFundsNeeded' in result, true);
  assert.equal(result.currency, DEFAULT_AFN_CURRENCY);
});

test('standard AFN: 100,000 − 30,000 − 20,000 = 50,000', () => {
  const input = base({
    changeInAssets: 100_000,
    changeInLiabilities: 30_000,
    changeInRetainedEarnings: 20_000,
  });
  const result = calculateAfn(input);
  assert.ok(result);
  assert.equal(result.additionalFundsNeeded, 50_000);
  assert.equal(afnInterpretation(result.additionalFundsNeeded), 'needed');
  assert.equal(validateAfn(input).isValid, true);
});

test('zero AFN when spontaneous financing covers asset growth', () => {
  const result = calculateAfn(
    base({ changeInAssets: 50_000, changeInLiabilities: 30_000, changeInRetainedEarnings: 20_000 }),
  );
  assert.ok(result);
  assert.equal(result.additionalFundsNeeded, 0);
  assert.equal(afnInterpretation(result.additionalFundsNeeded), 'balanced');
});

test('negative AFN is a financing surplus and is not clamped', () => {
  const result = calculateAfn(
    base({ changeInAssets: 40_000, changeInLiabilities: 30_000, changeInRetainedEarnings: 20_000 }),
  );
  assert.ok(result);
  assert.equal(result.additionalFundsNeeded, -10_000);
  assert.equal(afnInterpretation(result.additionalFundsNeeded), 'surplus');
});

test('negative changes in assets or liabilities keep correct signs', () => {
  const downAssets = calculateAfn(
    base({ changeInAssets: -20_000, changeInLiabilities: 5_000, changeInRetainedEarnings: 5_000 }),
  );
  assert.ok(downAssets);
  assert.equal(downAssets.additionalFundsNeeded, -30_000);

  const downLiab = calculateAfn(
    base({ changeInAssets: 50_000, changeInLiabilities: -10_000, changeInRetainedEarnings: 5_000 }),
  );
  assert.ok(downLiab);
  assert.equal(downLiab.additionalFundsNeeded, 55_000);
});

test('zero inputs are valid and yield zero AFN', () => {
  const result = calculateAfn(
    base({ changeInAssets: 0, changeInLiabilities: 0, changeInRetainedEarnings: 0 }),
  );
  assert.ok(result);
  assert.equal(result.additionalFundsNeeded, 0);
  assert.equal(validateAfn(base({ changeInAssets: 0, changeInLiabilities: 0, changeInRetainedEarnings: 0 })).isValid, true);
});

test('empty inputs leave the result blank without field errors until submit', () => {
  const empty = base({});
  const soft = validateAfn(empty);
  assert.equal(soft.isValid, false);
  assert.equal(soft.incomplete, true);
  assert.equal(soft.errors.changeInAssets, undefined);
  assert.equal(calculateAfn(empty), null);

  const hard = validateAfn(empty, { reportBlanks: true });
  assert.equal(hard.incomplete, false);
  assert.match(hard.errors.changeInAssets ?? '', /Enter change in assets/);
  assert.match(hard.errors.changeInLiabilities ?? '', /Enter change in liabilities/);
  assert.match(hard.errors.changeInRetainedEarnings ?? '', /Enter change in retained earnings/);
});

test('invalid numeric values are rejected', () => {
  assert.equal(Number.isNaN(parseOptionalNumber('abc')), true);
  const invalid = base({
    changeInAssets: Number.NaN,
    changeInLiabilities: 1,
    changeInRetainedEarnings: 1,
  });
  assert.equal(validateAfn(invalid).isValid, false);
  assert.match(validateAfn(invalid).errors.changeInAssets ?? '', /Enter a number/);
  assert.equal(calculateAfn(invalid), null);
  assert.equal(
    calculateAfn(
      base({
        changeInAssets: Number.POSITIVE_INFINITY,
        changeInLiabilities: 0,
        changeInRetainedEarnings: 0,
      }),
    ),
    null,
  );
});

test('decimal precision rounds the AFN once to cents', () => {
  const result = calculateAfn(
    base({
      changeInAssets: 100.105,
      changeInLiabilities: 30.004,
      changeInRetainedEarnings: 20.001,
    }),
  );
  assert.ok(result);
  assert.equal(result.additionalFundsNeeded, roundMoney(100.105 - 30.004 - 20.001));
  assert.equal(result.additionalFundsNeeded, 50.1);
  assert.equal(roundMoney(12.344), 12.34);
  assert.equal(roundMoney(12.346), 12.35);
});

test('currency is carried through without converting amounts', () => {
  const result = calculateAfn(
    base({
      changeInAssets: 10,
      changeInLiabilities: 3,
      changeInRetainedEarnings: 2,
      currency: 'EUR',
    }),
  );
  assert.ok(result);
  assert.equal(result.currency, 'EUR');
  assert.equal(result.additionalFundsNeeded, 5);
  assert.equal(result.changeInAssets, 10);
});

test('reset defaults are blank monetary fields in USD', () => {
  assert.equal(DEFAULT_AFN_INPUT.changeInAssets, null);
  assert.equal(DEFAULT_AFN_INPUT.changeInLiabilities, null);
  assert.equal(DEFAULT_AFN_INPUT.changeInRetainedEarnings, null);
  assert.equal(DEFAULT_AFN_INPUT.currency, 'USD');
  assert.equal(calculateAfn(DEFAULT_AFN_INPUT), null);
});

test('parseOptionalNumber treats blank and half-typed signs as empty', () => {
  assert.equal(parseOptionalNumber(''), null);
  assert.equal(parseOptionalNumber('  '), null);
  assert.equal(parseOptionalNumber('-'), null);
  assert.equal(parseOptionalNumber('-.') , null);
  assert.equal(parseOptionalNumber('12.5'), 12.5);
  assert.equal(parseOptionalNumber('-8'), -8);
});

console.log('All Additional Funds Needed Calculator unit tests passed.');
