/**
 * PERC engine — assert-based check.
 * Run: npx tsx --test frontend/src/tools/calculators/perc/calculation.test.ts
 */
import {
  ageMeetsPercCriterion,
  heartRateMeetsPercCriterion,
  o2SaturationMeetsPercCriterion,
  calculatePerc,
  countPositiveCriteria,
  resolveInterpretation,
} from './calculation';
import {
  createEmptyCriteria,
  createEmptyInput,
  createPositiveExampleInput,
  createScreenshotExampleInput,
} from './types';
import { validatePercInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Threshold equality
assert(!ageMeetsPercCriterion(49), 'age 49');
assert(ageMeetsPercCriterion(50), 'age 50');
assert(ageMeetsPercCriterion(51), 'age 51');

assert(!heartRateMeetsPercCriterion(99), 'hr 99');
assert(heartRateMeetsPercCriterion(100), 'hr 100');

assert(!o2SaturationMeetsPercCriterion(95), 'sat 95');
assert(o2SaturationMeetsPercCriterion(94.9), 'sat 94.9');

assert(countPositiveCriteria(createEmptyCriteria()) === 0, 'empty count 0');
assert(
  countPositiveCriteria({
    ...createEmptyCriteria(),
    ageGe50: true,
    hemoptysis: true,
  }) === 2,
  'count 2',
);

// Unknown / incomplete — must not rule out
{
  const r = calculatePerc(createEmptyInput());
  assert(r.positiveCount === 0, 'default count 0');
  assert(r.interpretationKind === 'ineligible_pretest', 'need pretest');
}

{
  const input = {
    ...createEmptyInput(),
    lowPretestProbabilityConfirmed: true,
    allCriteriaAssessed: false,
  };
  const r = calculatePerc(input);
  assert(r.interpretationKind === 'incomplete_assessment', 'incomplete');
}

// Positive blocks rule-out
{
  const r = calculatePerc(createPositiveExampleInput());
  assert(r.positiveCount === 2, 'example positives');
  assert(r.interpretationKind === 'positive_criterion', 'positive blocks');
}

// Screenshot example: rule-out
{
  const r = calculatePerc(createScreenshotExampleInput());
  assert(r.positiveCount === 0, 'screenshot 0');
  assert(r.interpretationKind === 'rule_out', 'rule out');
  assert(
    r.interpretation.includes('below 2%'),
    'screenshot interpretation',
  );
}

// Eligible + assessed + any positive
{
  const kind = resolveInterpretation({
    lowPretestProbabilityConfirmed: true,
    allCriteriaAssessed: true,
    criteria: { ...createEmptyCriteria(), exogenousEstrogen: true },
  }).kind;
  assert(kind === 'positive_criterion', 'estrogen positive');
}

assert(validatePercInput(createScreenshotExampleInput()).result.formattedPositiveCount === '0', 'fmt 0');

console.log('perc calculation.test.ts: ok');