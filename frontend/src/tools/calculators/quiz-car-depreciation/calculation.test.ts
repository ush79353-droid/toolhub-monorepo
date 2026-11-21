/**
 * Assert self-check for Quiz: Car Depreciation Calculator scoring.
 * Run: npx tsx src/tools/calculators/quiz-car-depreciation/calculation.test.ts
 */
import {
  calculateQuizResult,
  isQuestionCorrect,
  isQuizComplete,
  scoreQuizAnswers,
  shouldRevealQuestion,
} from './calculation';
import { QUIZ_MAX_SCORE } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const perfect: QuizAnswers = {
  q1: 'C',
  q2: 'B',
  q3: 'B',
  q4: 'C',
  q5: 'A',
};

assert(QUIZ_MAX_SCORE === 5, 'max score must be 5');
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 5, 'perfect score is 5');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 C = 9%');
assert(isQuestionCorrect(perfect, 'q2'), 'Q2 B = 5 years');
assert(isQuestionCorrect(perfect, 'q3'), 'Q3 B = False');
assert(isQuestionCorrect(perfect, 'q4'), 'Q4 C = Depreciation');
assert(isQuestionCorrect(perfect, 'q5'), 'Q5 A = $12,000 (40%)');

const wrongQ1: QuizAnswers = { ...perfect, q1: 'A' };
assert(scoreQuizAnswers(wrongQ1) === 4, 'wrong Q1 scores 4');
assert(!isQuestionCorrect(wrongQ1, 'q1'), 'Q1 A incorrect');

const incomplete = createDefaultInput();
const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');
assert(
  incompleteResult.formattedScore === '/5',
  'incomplete formatted score /5'
);

const perfectInput = {
  answers: perfect,
  showExplanationsAsIGo: true,
};
const perfectResult = calculateQuizResult(perfectInput);
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 5, 'perfect result score 5');
assert(perfectResult.formattedScore === '5/5', 'formatted 5/5');

assert(
  shouldRevealQuestion(perfectInput, 'q1'),
  'progressive reveal when answered + checked'
);
assert(
  !shouldRevealQuestion(
    { answers: perfect, showExplanationsAsIGo: false },
    'q1'
  ),
  'no reveal without checkbox'
);
assert(
  !shouldRevealQuestion(
    {
      answers: { ...perfect, q3: null },
      showExplanationsAsIGo: true,
    },
    'q3'
  ),
  'no progressive reveal for unanswered question'
);

// Double-scoring guard: scoring is a pure recount each time
assert(
  scoreQuizAnswers(perfect) === scoreQuizAnswers(perfect),
  'repeated score is stable'
);

console.log('quiz-car-depreciation calculation.test.ts: all asserts passed');
