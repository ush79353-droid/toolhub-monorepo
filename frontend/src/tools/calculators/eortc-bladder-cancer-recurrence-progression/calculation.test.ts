/**
 * Runnable self-check for EORTC Sylvester 2006 tables.
 * Run: npx tsx src/tools/calculators/eortc-bladder-cancer-recurrence-progression/calculation.test.ts
 */

import {
  calculateEortcBladder,
  progressionProbabilities,
  recurrenceProbabilities,
} from './calculation';
import {
  createEmptyInput,
  createExampleInput,
  createMaxProfileInput,
  createMinProfileInput,
  isCompleteInput,
} from './types';
import { validateEortcBladderInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Incomplete → no score
const empty = validateEortcBladderInput(createEmptyInput());
assert(!empty.isValid && empty.result === null, 'empty must not score');
assert(!isCompleteInput(createEmptyInput()), 'empty incomplete');

// Minimum profile
const min = calculateEortcBladder(createMinProfileInput());
assert(min.recurrencePoints === 0, `min rec points ${min.recurrencePoints}`);
assert(min.progressionPoints === 0, `min prog points ${min.progressionPoints}`);
assert(min.recurrenceProb1YearPct === 15, 'min rec 1y');
assert(min.recurrenceProb5YearPct === 31, 'min rec 5y');
assert(min.progressionProb1YearPct === 0.2, 'min prog 1y');
assert(min.progressionProb5YearPct === 0.8, 'min prog 5y');

// Maximum profile
const max = calculateEortcBladder(createMaxProfileInput());
assert(max.recurrencePoints === 17, `max rec ${max.recurrencePoints}`);
assert(max.progressionPoints === 23, `max prog ${max.progressionPoints}`);
assert(max.recurrenceProb1YearPct === 61, 'max rec 1y');
assert(max.recurrenceProb5YearPct === 78, 'max rec 5y');
assert(max.progressionProb1YearPct === 17, 'max prog 1y');
assert(max.progressionProb5YearPct === 45, 'max prog 5y');

// Table 7 example + ≥3 cm / 8+ boundaries
const example = calculateEortcBladder(createExampleInput());
assert(example.recurrencePoints === 5, `example rec ${example.recurrencePoints}`);
assert(example.progressionPoints === 5, `example prog ${example.progressionPoints}`);
assert(example.recurrenceProb1YearPct === 38, 'example rec 1y');
assert(example.progressionProb1YearPct === 1, 'example prog 1y');

const boundaryGe3 = calculateEortcBladder({
  ...createMinProfileInput(),
  tumorDiameter: 'ge3cm',
});
assert(boundaryGe3.recurrencePoints === 3, '≥3 cm recurrence +3');
assert(boundaryGe3.progressionPoints === 3, '≥3 cm progression +3');

const boundaryEight = calculateEortcBladder({
  ...createMinProfileInput(),
  tumorCount: 'eightPlus',
});
assert(boundaryEight.recurrencePoints === 6, '8+ recurrence +6');
assert(boundaryEight.progressionPoints === 3, '8+ progression +3');

assert(recurrenceProbabilities(4).at1Year === 24, 'bin 1-4');
assert(recurrenceProbabilities(10).at1Year === 61, 'bin 10-17');
assert(progressionProbabilities(2).at1Year === 1, 'prog bin 2-6');
assert(progressionProbabilities(14).at5Years === 45, 'prog bin 14-23');

console.log('eortc-bladder-cancer-recurrence-progression calculation.test.ts: ok');
