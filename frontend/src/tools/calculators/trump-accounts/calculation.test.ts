/**
 * Assert self-check for Trump Accounts Calculator.
 * Run: npx tsx src/tools/calculators/trump-accounts/calculation.test.ts
 */
import {
  calculateInvestmentYears,
  calculateTrumpAccounts,
  futureValueOfContributions,
  futureValueOfStartingBalance,
  inflationAdjustedBalance,
  roundMoney,
  shareTrumpAccountsText,
} from './calculation';
import {
  createBlankInput,
  createDefaultInput,
  getScenarioReturnPercent,
  hasTrumpAccountsChanges,
} from './types';
import { validateTrumpAccountsInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// Initial / defaults
const defaults = createDefaultInput();
assert(defaults.startingAge === '0', 'default starting age 0');
assert(defaults.targetAge === '18', 'default target age 18');
assert(defaults.startingBalance === '1000', 'default starting balance');
assert(defaults.annualContribution === '5000', 'default contribution');
assert(defaults.investmentScenario === 'conservative', 'default conservative');
assert(!defaults.includeInflation, 'inflation off by default');
assert(defaults.inflationRate === '2.5', 'default inflation rate');

assert(getScenarioReturnPercent('optimistic') === 10, 'optimistic 10%');
assert(getScenarioReturnPercent('conservative') === 6, 'conservative 6%');
assert(getScenarioReturnPercent('pessimistic') === 4, 'pessimistic 4%');

assert(calculateInvestmentYears(0, 18) === 18, 'N = 18');
assert(calculateInvestmentYears(5, 18) === 13, 'N = 13');
assert(calculateInvestmentYears(18, 18) === null, 'target must exceed start');
assert(calculateInvestmentYears(-1, 18) === null, 'negative start rejected');

// Required sample: age 0→18, P=1000, C=5000, r=6%, inflation 2.5%
const N = 18;
const P = 1000;
const C = 5000;
const r = 0.06;
const i = 0.025;
const growth = Math.pow(1 + r, N);
const expectedFvInitial = P * growth;
const expectedFvContrib = C * ((growth - 1) / r);
const expectedFinal = expectedFvInitial + expectedFvContrib;
const expectedTotal = P + C * N;
const expectedGrowth = expectedFinal - expectedTotal;
const expectedReal = expectedFinal / Math.pow(1 + i, N);

assert(
  approx(futureValueOfStartingBalance(P, r, N) ?? NaN, expectedFvInitial),
  'FV initial',
);
assert(
  approx(futureValueOfContributions(C, r, N) ?? NaN, expectedFvContrib),
  'FV contributions',
);
assert(
  approx(inflationAdjustedBalance(expectedFinal, i, N) ?? NaN, expectedReal),
  'real value',
);

const sample = calculateTrumpAccounts({
  startingAge: 0,
  targetAge: 18,
  startingBalance: 1000,
  annualContribution: 5000,
  investmentScenario: 'conservative',
  includeInflation: true,
  inflationRatePercent: 2.5,
  currency: 'USD',
});
assert(sample !== null, 'sample result');
assert(sample!.investmentYears === 18, 'sample years');
assert(
  approx(sample!.finalBalance, roundMoney(expectedFinal, 'USD')),
  `final ≈ ${expectedFinal}, got ${sample!.finalBalance}`,
);
assert(sample!.totalContributions === 91000, 'total contributions 91000');
assert(
  approx(sample!.investmentGrowth, roundMoney(expectedGrowth, 'USD')),
  'investment growth',
);
assert(
  sample!.inflationAdjustedBalance !== null &&
    approx(
      sample!.inflationAdjustedBalance,
      roundMoney(expectedReal, 'USD'),
    ),
  'inflation-adjusted',
);

// Zero interest (helpers; scenarios are fixed 10/6/4%)
assert(futureValueOfStartingBalance(1000, 0, 10) === 1000, '0% FV initial');
assert(futureValueOfContributions(5000, 0, 10) === 50000, '0% FV contrib');

const zeroContrib = calculateTrumpAccounts({
  startingAge: 0,
  targetAge: 18,
  startingBalance: 1000,
  annualContribution: 0,
  investmentScenario: 'conservative',
  includeInflation: false,
  inflationRatePercent: 0,
  currency: 'USD',
});
assert(zeroContrib !== null, 'zero contrib ok');
assert(
  approx(
    zeroContrib!.finalBalance,
    roundMoney(1000 * Math.pow(1.06, 18), 'USD'),
  ),
  'zero contrib = FV of principal only',
);
assert(zeroContrib!.totalContributions === 1000, 'zero contrib total');

const zeroStart = calculateTrumpAccounts({
  startingAge: 0,
  targetAge: 18,
  startingBalance: 0,
  annualContribution: 5000,
  investmentScenario: 'conservative',
  includeInflation: false,
  inflationRatePercent: 0,
  currency: 'USD',
});
assert(zeroStart !== null, 'zero start ok');
assert(zeroStart!.futureValueOfStartingBalance === 0, 'zero start FV');

// Scenarios
const opt = calculateTrumpAccounts({
  startingAge: 0,
  targetAge: 18,
  startingBalance: 1000,
  annualContribution: 5000,
  investmentScenario: 'optimistic',
  includeInflation: false,
  inflationRatePercent: 0,
  currency: 'USD',
});
const pes = calculateTrumpAccounts({
  startingAge: 0,
  targetAge: 18,
  startingBalance: 1000,
  annualContribution: 5000,
  investmentScenario: 'pessimistic',
  includeInflation: false,
  inflationRatePercent: 0,
  currency: 'USD',
});
assert(opt !== null && pes !== null, 'scenarios ok');
assert(opt!.finalBalance > sample!.finalBalance, 'optimistic > conservative');
assert(pes!.finalBalance < sample!.finalBalance, 'pessimistic < conservative');

// Chart shares
assert(
  approx(
    sample!.contributionsSharePercent + sample!.growthSharePercent,
    100,
    0.02,
  ),
  'pie shares sum ~100',
);

// Validation
const valid = validateTrumpAccountsInput(defaults);
assert(valid.isValid && valid.result !== null, 'defaults valid');

const ageBad = validateTrumpAccountsInput({
  ...defaults,
  startingAge: '18',
});
assert(!ageBad.isValid && ageBad.errors.startingAge, 'age 18 rejected');

const targetBad = validateTrumpAccountsInput({
  ...defaults,
  startingAge: '10',
  targetAge: '10',
});
assert(!targetBad.isValid && targetBad.errors.targetAge, 'target <= start');

const negBal = validateTrumpAccountsInput({
  ...defaults,
  startingBalance: '-1',
});
assert(!negBal.isValid && negBal.errors.startingBalance, 'neg balance');

const incomplete = validateTrumpAccountsInput(createBlankInput());
assert(incomplete.incomplete && !incomplete.isValid, 'blank incomplete');

assert(hasTrumpAccountsChanges(defaults), 'defaults count as changes vs blank');
assert(!hasTrumpAccountsChanges(createBlankInput()), 'blank has no changes');

const share = shareTrumpAccountsText(sample!);
assert(share.includes('Trump Accounts Calculator'), 'share title');
assert(share.includes('Final projected balance'), 'share final');
assert(share.includes('Inflation-adjusted'), 'share inflation line');

console.log('trump-accounts calculation.test.ts: all asserts passed');
