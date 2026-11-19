/**
 * Assert self-check for Quiz: US Income Percentile Calculator scoring.
 * Run: npx tsx src/tools/calculators/quiz-us-income-percentile/calculation.test.ts
 */
import {
  buildAnswerReviews,
  calculateQuizPercentage,
  calculateQuizResult,
  calculateQuizScore,
  generateQuizResult,
  getQuizFeedback,
  isQuestionCorrect,
  shareQuizText,
} from './calculation';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import {
  createDefaultInput,
  createEmptyAnswers,
  type QuizAnswers,
} from './types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(QUIZ_QUESTIONS.length === 8, 'eight questions required');
assert(QUIZ_MAX_SCORE === 8, 'max score must be 8');

const perfect: QuizAnswers = {
  q1: 'C',
  q2: 'B',
  q3: 'A',
  q4: 'A',
  q5: 'A',
  q6: 'B',
  q7: 'D',
  q8: 'C',
};

assert(calculateQuizScore(perfect) === 8, 'perfect score is 8');
assert(calculateQuizPercentage(8) === 100, 'perfect percentage is 100');
assert(
  generateQuizResult(perfect).formattedScore === '8 / 8',
  'perfect formatted score',
);
assert(
  generateQuizResult(perfect).formattedPercent === '100%',
  'perfect formatted percent',
);

const allWrong: QuizAnswers = {
  q1: 'A',
  q2: 'A',
  q3: 'B',
  q4: 'B',
  q5: 'B',
  q6: 'A',
  q7: 'A',
  q8: 'A',
};
assert(calculateQuizScore(allWrong) === 0, 'all wrong scores 0');
assert(
  generateQuizResult(allWrong).formattedScore === '0 / 8',
  'all wrong formatted',
);

const partial: QuizAnswers = {
  ...perfect,
  q1: 'A',
  q8: 'A',
};
assert(calculateQuizScore(partial) === 6, 'two wrong → score 6');
assert(calculateQuizPercentage(6) === 75, '6/8 → 75%');

const unanswered = createEmptyAnswers();
assert(calculateQuizScore(unanswered) === 0, 'empty answers score 0');
const unansweredResult = generateQuizResult(unanswered);
assert(unansweredResult.unansweredCount === 8, '8 unanswered');
assert(
  unansweredResult.reviews.every((row) => row.isUnanswered),
  'reviews mark unanswered',
);

assert(isQuestionCorrect(perfect, 'q6'), 'Q6 B is correct');
assert(!isQuestionCorrect({ ...perfect, q6: 'C' }, 'q6'), 'Q6 C is incorrect');

assert(getQuizFeedback(0).startsWith('Keep learning'), '0–2 band low');
assert(getQuizFeedback(2).startsWith('Keep learning'), '0–2 band high');
assert(getQuizFeedback(3).startsWith('Good start'), '3–4 band');
assert(getQuizFeedback(4).startsWith('Good start'), '3–4 band high');
assert(getQuizFeedback(5).startsWith('Great job'), '5–6 band');
assert(getQuizFeedback(6).startsWith('Great job'), '5–6 band high');
assert(getQuizFeedback(7).startsWith('Excellent'), '7–8 band');
assert(getQuizFeedback(8).startsWith('Excellent'), '7–8 band high');

const reviews = buildAnswerReviews({
  ...perfect,
  q2: 'A',
  q3: null,
});
assert(reviews[1]?.isCorrect === false, 'Q2 wrong review');
assert(reviews[2]?.isUnanswered === true, 'Q3 unanswered review');
assert(reviews[0]?.isCorrect === true, 'Q1 correct review');
assert(
  reviews[0]?.explanation.includes('compares'),
  'review includes explanation',
);

const defaults = createDefaultInput();
assert(calculateQuizResult(defaults) === null, 'no result before submit');
const submitted = calculateQuizResult({ answers: perfect, isSubmitted: true });
assert(submitted !== null && submitted.score === 8, 'submitted perfect');

const share = shareQuizText('Quiz: US Income Percentile Calculator', submitted!);
assert(share.includes('8 / 8'), 'share includes score');
assert(share.includes('100%'), 'share includes percent');
assert(share.includes('Excellent'), 'share includes feedback');

// Single-selection persistence: mutating one key leaves others intact
const persisted: QuizAnswers = { ...perfect, q4: 'C' };
assert(persisted.q1 === 'C', 'q1 persists');
assert(persisted.q4 === 'C', 'q4 updated');
assert(calculateQuizScore(persisted) === 7, 'one wrong after change → 7');

console.log('quiz-us-income-percentile calculation.test.ts: all asserts passed');
