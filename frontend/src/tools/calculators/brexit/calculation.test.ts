/**
 * Assert-style self-check for Brexit cost math (no test runner required).
 * Run: npx tsx src/tools/calculators/brexit/calculation.test.ts
 */
import {
  calculateBrexitCost,
  franceRubbishEquivalent,
  gdpLossGbp,
  opportunityQuantities,
  weeklyFromUnit,
} from './calculation';
import {
  DEFAULT_CURRENT_WEEKLY_LOSS_GBP,
  MS_PER_WEEK,
  PRE_2020_WEEKLY_LOSS_GBP,
} from './constants';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, tol = 1): boolean {
  return Math.abs(a - b) <= tol;
}

// weeklyFromUnit
assert(weeklyFromUnit(100, 'wk') === 100, 'wk identity');
assert(nearly(weeklyFromUnit(700, 'day'), 4900), 'day→week');
assert(nearly(weeklyFromUnit(5200, 'yr'), 100), 'yr→week');

// Dual-rate GDP loss: exactly 1 pre week + 1 post week
const cutoff = Date.parse('2020-01-01T00:00:00.000Z');
const since = cutoff - MS_PER_WEEK;
const till = cutoff + MS_PER_WEEK;
const loss = gdpLossGbp(since, till, DEFAULT_CURRENT_WEEKLY_LOSS_GBP);
assert(
  nearly(loss.pre2020, PRE_2020_WEEKLY_LOSS_GBP, 1),
  `pre week expected ${PRE_2020_WEEKLY_LOSS_GBP} got ${loss.pre2020}`
);
assert(
  nearly(loss.post2020, DEFAULT_CURRENT_WEEKLY_LOSS_GBP, 1),
  `post week expected ${DEFAULT_CURRENT_WEEKLY_LOSS_GBP} got ${loss.post2020}`
);

// Zero span
const z = gdpLossGbp(till, till, DEFAULT_CURRENT_WEEKLY_LOSS_GBP);
assert(z.total === 0, 'zero span');

// Opportunities: £90m → 1 hospital
const ops = opportunityQuantities(90_000_000);
const hospitals = ops.find((o) => o.id === 'hospitals');
assert(hospitals?.quantity === 1, 'one hospital');

// Worked example: gov + dual loss (no live tick)
const calc = calculateBrexitCost({
  sinceMs: since,
  tillMs: till,
  currentWeeklyLossGbp: DEFAULT_CURRENT_WEEKLY_LOSS_GBP,
  governmentSpendingGbp: 1_000_000,
});
assert(
  nearly(
    calc.costSoFarGbp,
    1_000_000 + PRE_2020_WEEKLY_LOSS_GBP + DEFAULT_CURRENT_WEEKLY_LOSS_GBP,
    1
  ),
  `worked example cost ${calc.costSoFarGbp}`
);

// France rubbish equivalence positive for large tonnes
const fr = franceRubbishEquivalent(1_000_000_000);
assert(fr != null && fr > 0, 'france equiv');

console.log('brexit calculation.test.ts: ok');
