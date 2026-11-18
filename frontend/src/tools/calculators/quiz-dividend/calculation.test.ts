/**
 * Assert self-check for Quiz: Dividend Calculator scoring.
 * Run: npx tsx src/tools/calculators/quiz-dividend/calculation.test.ts
 */
import {
  calculateQuizResult,
  isNumericAnswerCorrect,
  isQuestionCorrect,
  isQuizComplete,
  parseNumericAnswer,
  scoreQuizAnswers,
  shouldRevealAnswers,
} from './calculation';
import { Q6_CORRECT_BALANCE, QUIZ_MAX_SCORE } from './questions';
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
  q4: '1',
  q5: 'B',
  q6: '2593.74',
};

assert(QUIZ_MAX_SCORE === 6, 'max score must be 6');
assert(parseNumericAnswer('1%') === 1, 'parse percent with suffix');
assert(parseNumericAnswer('$2,593.74') === 2593.74, 'parse money with $ and comma');
assert(isNumericAnswerCorrect('1', 1, 0.05), 'Q4 exact 1%');
assert(isNumericAnswerCorrect('1.0', 1, 0.05), 'Q4 1.0 accepted');
assert(!isNumericAnswerCorrect('6', 1, 0.05), 'Q4 6% rejected');
assert(
  isNumericAnswerCorrect('2593.74', Q6_CORRECT_BALANCE, 1),
  'Q6 ≈ 2593.74 accepted'
);
assert(
  Math.abs(Q6_CORRECT_BALANCE - 2593.74) < 0.01,
  'reference balance rounds to 2593.74'
);
assert(isQuizComplete(perfect), 'perfect answers are complete');
assert(scoreQuizAnswers(perfect) === 6, 'perfect score is 6');
assert(isQuestionCorrect(perfect, 'q1'), 'Q1 B correct');
assert(isQuestionCorrect(perfect, 'q4'), 'Q4 correct');
assert(isQuestionCorrect(perfect, 'q6'), 'Q6 correct');

const wrongQ4: QuizAnswers = { ...perfect, q4: '6' };
assert(scoreQuizAnswers(wrongQ4) === 5, 'wrong Q4 scores 5');

const incomplete = createDefaultInput();
const incompleteResult = calculateQuizResult(incomplete);
assert(!incompleteResult.complete, 'empty quiz incomplete');
assert(incompleteResult.score === null, 'incomplete score null');

const perfectInput = { answers: perfect, showExplanations: true };
const perfectResult = calculateQuizResult(perfectInput);
assert(perfectResult.complete, 'perfect complete');
assert(perfectResult.score === 6, 'perfect result score 6');
assert(perfectResult.formattedPercent === '100%', '100% accuracy');
assert(shouldRevealAnswers(perfectInput), 'reveal when complete + checked');
assert(
  !shouldRevealAnswers({ answers: perfect, showExplanations: false }),
  'no reveal without checkbox'
);

console.log('quiz-dividend calculation.test.ts: all asserts passed');
