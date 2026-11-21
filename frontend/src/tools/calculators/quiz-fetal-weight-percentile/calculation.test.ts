import assert from 'node:assert/strict';
import { calculateQuizResult, scoreQuizAnswers } from './calculation';
import { QUIZ_MAX_SCORE } from './questions';
import { createDefaultInput, type QuizAnswers } from './types';

const allCorrect: QuizAnswers = {
  q1: 'B',
  q2: 'B',
  q3: 'B',
  q4: 'C',
  q5: 'A',
};

const allWrong: QuizAnswers = {
  q1: 'A',
  q2: 'A',
  q3: 'A',
  q4: 'A',
  q5: 'B',
};

{
  const incomplete = calculateQuizResult(createDefaultInput());
  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.score, null);
  assert.equal(incomplete.formattedScore, `/${QUIZ_MAX_SCORE}`);
}

{
  const perfect = calculateQuizResult({
    answers: allCorrect,
    showExplanations: false,
  });
  assert.equal(perfect.complete, true);
  assert.equal(perfect.score, 5);
  assert.equal(perfect.formattedScore, '5/5');
  assert.equal(scoreQuizAnswers(allCorrect), 5);
}

{
  const zero = calculateQuizResult({
    answers: allWrong,
    showExplanations: true,
  });
  assert.equal(zero.complete, true);
  assert.equal(zero.score, 0);
  assert.equal(zero.formattedScore, '0/5');
}

{
  const partial = calculateQuizResult({
    answers: { ...allCorrect, q5: null },
    showExplanations: false,
  });
  assert.equal(partial.complete, false);
  assert.equal(partial.score, null);
}

console.log('quiz-fetal-weight-percentile calculation.test.ts: ok');
