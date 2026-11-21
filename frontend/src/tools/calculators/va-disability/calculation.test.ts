/**
 * Assert self-check for VA Disability Calculator.
 * Run: npx tsx src/tools/calculators/va-disability/calculation.test.ts
 */
import {
  bilateralGroupQualifies,
  calculateVaDisability,
  combineRatings,
  combineTwo,
  roundCombinedRating,
  shareVaDisabilityText,
} from './calculation';
import { monthlyCompensation, VA_COMPENSATION_YEAR } from './rates';
import {
  createDefaultInput,
  hasVaDisabilityChanges,
  type DisabilityCondition,
} from './types';
import { validateVaDisabilityInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function cond(
  id: string,
  rating: DisabilityCondition['rating'],
  limb: DisabilityCondition['limb'] = 'none',
): DisabilityCondition {
  return { id, rating, limb };
}

const defaults = createDefaultInput();
assert(defaults.conditions.length === 3, 'three conditions');
assert(defaults.dependents.maritalStatus === 'single', 'single default');
const initial = validateVaDisabilityInput(defaults);
assert(initial.isValid && initial.result?.combinedRating === 0, 'zeros combine to 0');
assert(initial.result?.monthlyCompensation === 0, 'no pay at 0');

assert(combineTwo(50, 30) === 65, '50 then 30 = 65');
assert(combineRatings([20, 50, 30]) === 72, '50/30/20 = 72');
assert(roundCombinedRating(72) === 70, '72 rounds to 70');
assert(roundCombinedRating(75) === 80, '75 rounds up');
assert(roundCombinedRating(74) === 70, '74 rounds down');
assert(roundCombinedRating(100) === 100, 'cap 100');
assert(combineRatings([100, 50]) === 100, '100 stays 100');

const example = calculateVaDisability({
  conditions: [cond('a', 50), cond('b', 30), cond('c', 20)],
  dependents: defaults.dependents,
});
assert(example?.combinedBeforeRounding === 72, 'exact 72');
assert(example?.combinedRating === 70, 'rounded 70');
assert(example?.monthlyCompensation === 1808.45, '70% alone 2026 rate');
assert(example?.compensationYear === VA_COMPENSATION_YEAR, 'year');
assert(!example?.bilateralApplied, 'no bilateral');

const married = calculateVaDisability({
  conditions: [cond('a', 70)],
  dependents: { ...defaults.dependents, maritalStatus: 'married' },
});
assert(married?.monthlyCompensation === 1961.45, '70% with spouse');

const oneChild = calculateVaDisability({
  conditions: [cond('a', 70)],
  dependents: { ...defaults.dependents, maritalStatus: 'married', childrenUnder18: 1 },
});
assert(oneChild?.monthlyCompensation === 2074.45, '70% spouse and one child');

const twoChildren = calculateVaDisability({
  conditions: [cond('a', 70)],
  dependents: { ...defaults.dependents, maritalStatus: 'married', childrenUnder18: 2 },
});
assert(twoChildren?.monthlyCompensation === 2150.45, '70% spouse plus extra child');

const parent = calculateVaDisability({
  conditions: [cond('a', 70)],
  dependents: { ...defaults.dependents, dependentParents: 1 },
});
assert(parent?.monthlyCompensation === 1931.45, '70% one parent');

const school = calculateVaDisability({
  conditions: [cond('a', 30)],
  dependents: { ...defaults.dependents, childrenOver18InSchool: 1 },
});
assert(school?.monthlyCompensation === 657.47, '30% alone plus one school child');

assert(
  monthlyCompensation({
    combinedRating: 10,
    married: true,
    childrenUnder18: 2,
    childrenOver18InSchool: 1,
    dependentParents: 2,
  }) === 180.42,
  '10% ignores dependents',
);

assert(
  !bilateralGroupQualifies([cond('a', 40, 'left-arm'), cond('b', 20, 'left-arm')]),
  'same limb is not bilateral',
);
const bilateral = calculateVaDisability({
  conditions: [cond('a', 40, 'left-leg'), cond('b', 30, 'right-leg')],
  dependents: defaults.dependents,
});
assert(Boolean(bilateral?.bilateralApplied), 'both legs qualify');
assert(Math.abs((bilateral?.bilateralCombined ?? 0) - 63.8) < 0.001, '40/30 plus 10%');
assert(bilateral?.combinedRating === 60, '63.8 rounds to 60');

const single = calculateVaDisability({
  conditions: [cond('a', 50)],
  dependents: defaults.dependents,
});
assert(single?.combinedBeforeRounding === 50 && single.combinedRating === 50, 'one rating');

assert(hasVaDisabilityChanges(defaults) === false, 'clean default');
const share = shareVaDisabilityText(example!, defaults.dependents);
assert(share.includes('70%') && share.includes('2026'), 'share text');

console.log('va-disability calculation.test.ts: all asserts passed');
