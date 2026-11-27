/**
 * Assert self-check for Quiz Protein Creatinine Ratio scoring.
 * Run: npx tsx src/tools/calculators/quiz-protein-creatinine-ratio/calculation.test.ts
 */
import {
  calculateQuizResult,
  isQuestionCorrect,
  isQuizComplete,
  scoreQuizAnswers,
} from './calculation';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';
import { validateQuizProteinCreatinineRatioInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/** Verified key from screenshot + prompt: B B A C B */
const perfect: QuizAnswers = {
  q1: 'B',
  q2: 'B',
  q3: 'A',
  q4: 'C',
  q5: 'B',
};

assert(QUIZ_MAX_SCORE === 5, 'max score must be 5');
assert(QUIZ_QUESTIONS.length === 5, 'five questions');
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 5, 'perfect score is 5');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 Kidney health');
assert(isQuestionCorrect(perfect, 'q2'), 'Q2 balance / normalize concentration');
assert(isQuestionCorrect(perfect, 'q3'), 'Q3 protein leakage');
assert(isQuestionCorrect(perfect, 'q4'), 'Q4 kidneys');
assert(isQuestionCorrect(perfect, 'q5'), 'Q5 urine sample');

const zero: QuizAnswers = {
  q1: 'A',
  q2: 'A',
  q3: 'B',
  q4: 'A',
  q5: 'A',
};
assert(isQuizComplete(zero), 'all-wrong is complete');
assert(scoreQuizAnswers(zero) === 0, '0/5 when all wrong');

const partialWrong: QuizAnswers = { ...perfect, q3: 'B', q5: 'C' };
assert(scoreQuizAnswers(partialWrong) === 3, 'two wrong → 3/5');
assert(!isQuestionCorrect(partialWrong, 'q3'), 'Q3 wrong');
assert(!isQuestionCorrect(partialWrong, 'q5'), 'Q5 wrong');

const changeAnswer: QuizAnswers = { ...perfect, q1: 'A' };
assert(scoreQuizAnswers(changeAnswer) === 4, 'changing Q1 to wrong → 4');
assert(scoreQuizAnswers({ ...changeAnswer, q1: 'B' }) === 5, 'fixing Q1 restores 5');

const incomplete = createDefaultInput();
const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');
assert(
  incompleteResult.formattedScore === '/5',
  'incomplete formatted score /5',
);

const oneAnswered: QuizAnswers = {
  q1: 'B',
  q2: null,
  q3: null,
  q4: null,
  q5: null,
};
assert(!isQuizComplete(oneAnswered), 'partial answers incomplete');
assert(calculateQuizResult({ answers: oneAnswered }).score === null, 'no score until complete');

const perfectResult = calculateQuizResult({ answers: perfect });
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 5, 'perfect result score 5');
assert(perfectResult.formattedScore === '5/5', 'formatted 5/5');

const zeroResult = calculateQuizResult({ answers: zero });
assert(zeroResult.complete && zeroResult.score === 0, '0/5 complete');
assert(zeroResult.formattedScore === '0/5', 'formatted 0/5');

const validatedIncomplete = validateQuizProteinCreatinineRatioInput(incomplete);
assert(!validatedIncomplete.isValid, 'incomplete not valid for scored state');
assert(
  validateQuizProteinCreatinineRatioInput({ answers: perfect }).isValid,
  'perfect validates',
);

// Correct-key labels match screenshot concepts
assert(
  QUIZ_QUESTIONS[0].options.find((o) => o.id === 'B')?.label === 'Kidney health',
  'Q1 correct label',
);
assert(
  QUIZ_QUESTIONS[1].options.find((o) => o.id === 'B')?.label ===
    'Balance protein measurement for accuracy',
  'Q2 correct label',
);
assert(
  QUIZ_QUESTIONS[2].options.find((o) => o.id === 'A')?.label ===
    'Kidneys may be leaking protein',
  'Q3 correct label',
);
assert(
  QUIZ_QUESTIONS[3].options.find((o) => o.id === 'C')?.label === 'Kidneys',
  'Q4 correct label',
);
assert(
  QUIZ_QUESTIONS[4].options.find((o) => o.id === 'B')?.label === 'Urine sample',
  'Q5 correct label',
);

console.log('quiz-protein-creatinine-ratio calculation.test.ts: ok');
