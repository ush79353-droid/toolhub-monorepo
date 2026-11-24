/**
 * Assert self-check for Quiz Harris–Benedict scoring + shared BEE/HB helpers.
 * Run: npx tsx src/tools/calculators/quiz-harris-benedict/calculation.test.ts
 */
import { ACTIVITY_FACTORS } from '../bee-calculator/calculation';
import {
  calculateQuizResult,
  isQuestionCorrect,
  isQuizComplete,
  scoreQuizAnswers,
  SEDENTARY_ACTIVITY_FACTOR,
  sexSpecificBeeDiffer,
} from './calculation';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';
import { validateQuizHarrisBenedictInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/** Verified key: A A B B B D C */
const perfect: QuizAnswers = {
  q1: 'A',
  q2: 'A',
  q3: 'B',
  q4: 'B',
  q5: 'B',
  q6: 'D',
  q7: 'C',
};

assert(QUIZ_MAX_SCORE === 7, 'max score must be 7');
assert(QUIZ_QUESTIONS.length === 7, 'seven questions');
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 7, 'perfect score is 7');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 True = resting energy');
assert(isQuestionCorrect(perfect, 'q2'), 'Q2 weight/height/age/sex');
assert(isQuestionCorrect(perfect, 'q3'), 'Q3 TDEE');
assert(isQuestionCorrect(perfect, 'q4'), 'Q4 False = sex-specific');
assert(isQuestionCorrect(perfect, 'q5'), 'Q5 sedentary 1.2');
assert(isQuestionCorrect(perfect, 'q6'), 'Q6 energy baseline');
assert(isQuestionCorrect(perfect, 'q7'), 'Q7 lean-mass gain');

const zero: QuizAnswers = {
  q1: 'B',
  q2: 'B',
  q3: 'A',
  q4: 'A',
  q5: 'A',
  q6: 'A',
  q7: 'A',
};
assert(isQuizComplete(zero), 'all-wrong is complete');
assert(scoreQuizAnswers(zero) === 0, '0/7 when all wrong');

const wrongQ5: QuizAnswers = { ...perfect, q5: 'A' };
assert(scoreQuizAnswers(wrongQ5) === 6, 'wrong Q5 scores 6');
assert(!isQuestionCorrect(wrongQ5, 'q5'), 'Q5 moderately active incorrect');

const incomplete = createDefaultInput();
const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');
assert(
  incompleteResult.formattedScore === '/7',
  'incomplete formatted score /7',
);

const perfectResult = calculateQuizResult({ answers: perfect });
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 7, 'perfect result score 7');
assert(perfectResult.formattedScore === '7/7', 'formatted 7/7');

const zeroResult = calculateQuizResult({ answers: zero });
assert(zeroResult.complete && zeroResult.score === 0, '0/7 complete');
assert(zeroResult.formattedScore === '0/7', 'formatted 0/7');

const v = validateQuizHarrisBenedictInput({ answers: perfect });
assert(v.isValid && v.result.score === 7, 'validation unlocks on complete');
assert(
  !validateQuizHarrisBenedictInput(incomplete).isValid,
  'validation false when incomplete',
);

// Reuse BEE helpers — do not invent a second 1.2 or sex formula.
assert(SEDENTARY_ACTIVITY_FACTOR === 1.2, 'sedentary factor is 1.2');
assert(
  ACTIVITY_FACTORS.light_sedentary === SEDENTARY_ACTIVITY_FACTOR,
  'Q5 factor aliases BEE light_sedentary',
);
assert(
  sexSpecificBeeDiffer(30, 175, 70),
  'male vs female revised HB BEE differ (Q4)',
);

console.log('quiz-harris-benedict calculation.test.ts: all assertions passed');
