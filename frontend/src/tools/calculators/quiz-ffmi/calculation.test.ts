/**
 * Assert self-check for Quiz FFMI scoring + sequential unlock.
 * Run: npx tsx src/tools/calculators/quiz-ffmi/calculation.test.ts
 */
import {
  calculateQuizResult,
  fatFreeMassKg,
  ffmiKgPerM2,
  isQuestionCorrect,
  isQuestionUnlocked,
  isQuizComplete,
  normalizedFfmi,
  scoreQuizAnswers,
  unlockedThrough,
} from './calculation';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';
import { validateQuizFfmiInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/** Verified key: B B B B B C C C */
const perfect: QuizAnswers = {
  q1: 'B',
  q2: 'B',
  q3: 'B',
  q4: 'B',
  q5: 'B',
  q6: 'C',
  q7: 'C',
  q8: 'C',
};

assert(QUIZ_MAX_SCORE === 8, 'max score must be 8');
assert(QUIZ_QUESTIONS.length === 8, 'eight questions');
assert(QUIZ_QUESTIONS[0]?.provenance === 'screenshot', 'Q1 from screenshot');
assert(
  QUIZ_QUESTIONS.slice(1).every((q) => q.provenance === 'original_new'),
  'Q2–Q8 marked original_new',
);
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 8, 'perfect score is 8');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 Fat-Free Mass Index');
assert(isQuestionCorrect(perfect, 'q7'), 'Q7 male excellent 22–23');
assert(isQuestionCorrect(perfect, 'q8'), 'Q8 female superior 19–21.5');

const zero: QuizAnswers = {
  q1: 'A',
  q2: 'A',
  q3: 'A',
  q4: 'A',
  q5: 'A',
  q6: 'A',
  q7: 'A',
  q8: 'A',
};
assert(isQuizComplete(zero), 'all-wrong is complete');
assert(scoreQuizAnswers(zero) === 0, '0/8 when all wrong');

const wrongQ1: QuizAnswers = { ...perfect, q1: 'A' };
assert(scoreQuizAnswers(wrongQ1) === 7, 'wrong Q1 scores 7');

const incomplete = createDefaultInput();
assert(!isQuizComplete(incomplete.answers), 'empty incomplete');
assert(unlockedThrough(incomplete.answers) === 1, 'only Q1 unlocked initially');
assert(isQuestionUnlocked(incomplete.answers, 1), 'Q1 unlocked');
assert(!isQuestionUnlocked(incomplete.answers, 2), 'Q2 locked initially');

const afterQ1: QuizAnswers = { ...incomplete.answers, q1: 'B' };
assert(unlockedThrough(afterQ1) === 2, 'Q2 unlocks after Q1');
assert(isQuestionUnlocked(afterQ1, 2), 'Q2 unlocked after Q1');
assert(!isQuestionUnlocked(afterQ1, 3), 'Q3 still locked');

const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');
assert(
  incompleteResult.formattedScore === '/8',
  'incomplete formatted score /8',
);

const perfectResult = calculateQuizResult({ answers: perfect });
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 8, 'perfect result score 8');
assert(perfectResult.formattedScore === '8/8', 'formatted 8/8');
assert(perfectResult.unlockedThrough === 8, 'all unlocked when complete');

const zeroResult = calculateQuizResult({ answers: zero });
assert(zeroResult.complete && zeroResult.score === 0, '0/8 complete');
assert(zeroResult.formattedScore === '0/8', 'formatted 0/8');

const v = validateQuizFfmiInput({ answers: perfect });
assert(v.isValid && v.result.score === 8, 'validation unlocks on complete');
assert(
  !validateQuizFfmiInput(incomplete).isValid,
  'validation false when incomplete',
);

// Companion formula fixture from FFMI prompt: 80 kg, 25%, height 2 m → FFM 60, FFMI 15
const ffm = fatFreeMassKg(80, 25);
assert(ffm === 60, 'FFM 80×(1−0.25)=60');
const ffmi = ffmiKgPerM2(ffm, 2);
assert(ffmi === 15, 'FFMI 60/4=15');
const nFfmi = normalizedFfmi(ffmi, 2);
assert(
  Math.abs(nFfmi - (15 + 6.1 * (1.8 - 2))) < 1e-9,
  'normalized FFMI uses 6.1×(1.8−h)',
);

// Repeated selection: changing answer still complete
const retake: QuizAnswers = { ...perfect, q3: 'A' };
assert(scoreQuizAnswers(retake) === 7, 'retake wrong Q3 scores 7');
assert(isQuizComplete(retake), 'retake remains complete');

console.log('quiz-ffmi calculation.test.ts: all assertions passed');
