/**
 * Assert self-check for Quiz: Annual Income Calculator scoring.
 * Run: npx tsx src/tools/calculators/quiz-annual-income/calculation.test.ts
 */
import {
  calculateQuizResult,
  isQuestionCorrect,
  isQuizComplete,
  scoreQuizAnswers,
  shouldShowQuestion,
} from './calculation';
import { QUIZ_MAX_SCORE } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const perfect: QuizAnswers = {
  q1: 'B',
  q2: 'C',
  q3: 'A',
  q4: 'B',
  q5: 'B',
  q6: 'A',
  q7: 'A',
};

assert(QUIZ_MAX_SCORE === 7, 'max score must be 7');
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 7, 'perfect score is 7');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 B = one year');
assert(isQuestionCorrect(perfect, 'q2'), 'Q2 C = hours×weeks formula');
assert(isQuestionCorrect(perfect, 'q3'), 'Q3 A = gross before tax');
assert(isQuestionCorrect(perfect, 'q4'), 'Q4 B = net after tax');
assert(isQuestionCorrect(perfect, 'q5'), 'Q5 B = $31,200');
assert(isQuestionCorrect(perfect, 'q6'), 'Q6 A = $25,000');
assert(isQuestionCorrect(perfect, 'q7'), 'Q7 A = decreases');

const wrongQ1: QuizAnswers = { ...perfect, q1: 'A' };
assert(scoreQuizAnswers(wrongQ1) === 6, 'wrong Q1 scores 6');
assert(!isQuestionCorrect(wrongQ1, 'q1'), 'Q1 A incorrect');

const incomplete = createDefaultInput();
const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');
assert(
  incompleteResult.formattedScore === '/7',
  'incomplete formatted score /7'
);

const perfectResult = calculateQuizResult({ answers: perfect });
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 7, 'perfect result score 7');
assert(perfectResult.formattedScore === '7/7', 'formatted 7/7');

assert(
  shouldShowQuestion(incomplete.answers, 'q1'),
  'Q1 always visible'
);
assert(
  !shouldShowQuestion(incomplete.answers, 'q2'),
  'Q2 hidden until Q1 answered'
);
assert(
  shouldShowQuestion({ ...incomplete.answers, q1: 'B' }, 'q2'),
  'Q2 visible after Q1'
);
assert(
  !shouldShowQuestion({ ...incomplete.answers, q1: 'B' }, 'q3'),
  'Q3 hidden until Q2 answered'
);

// Correctness is by option id, not position — Q5 correct is B ($31,200), not first option.
assert(
  !isQuestionCorrect({ ...perfect, q5: 'A' }, 'q5'),
  'Q5 A ($30,000) is wrong'
);

console.log('quiz-annual-income calculation.test.ts: all assertions passed');
