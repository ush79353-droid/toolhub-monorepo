import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerReview,
  QuizAnswers,
  QuizQuestionId,
  QuizUsIncomePercentileInput,
  QuizUsIncomePercentileResult,
} from './types';

export function calculateQuizScore(answers: QuizAnswers): number {
  let score = 0;
  for (const question of QUIZ_QUESTIONS) {
    if (answers[question.id] === question.correctAnswer) {
      score += 1;
    }
  }
  return score;
}

export function calculateQuizPercentage(
  score: number,
  totalQuestions: number = QUIZ_MAX_SCORE,
): number {
  if (!(totalQuestions > 0)) return 0;
  return (score / totalQuestions) * 100;
}

export function getQuizFeedback(score: number): string {
  if (score <= 2) {
    return 'Keep learning! Review the definitions and examples to improve your understanding.';
  }
  if (score <= 4) {
    return 'Good start! You understand some income percentile concepts, but there is more to learn.';
  }
  if (score <= 6) {
    return 'Great job! You have a solid understanding of income percentiles.';
  }
  return 'Excellent! You have a strong understanding of US income percentiles.';
}

export function isQuestionCorrect(
  answers: QuizAnswers,
  questionId: QuizQuestionId,
): boolean {
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  if (!question) return false;
  return answers[questionId] === question.correctAnswer;
}

export function buildAnswerReviews(answers: QuizAnswers): QuizAnswerReview[] {
  return QUIZ_QUESTIONS.map((question) => {
    const selected = answers[question.id];
    const selectedLabel =
      selected === null
        ? null
        : (question.options.find((option) => option.id === selected)?.label ??
          selected);
    const correctLabel =
      question.options.find((option) => option.id === question.correctAnswer)
        ?.label ?? question.correctAnswer;
    return {
      questionId: question.id,
      number: question.number,
      prompt: question.prompt,
      selectedAnswer: selected,
      selectedLabel,
      correctAnswer: question.correctAnswer,
      correctLabel,
      isCorrect: selected === question.correctAnswer,
      isUnanswered: selected === null,
      explanation: question.explanation,
    };
  });
}

export function generateQuizResult(
  answers: QuizAnswers,
): QuizUsIncomePercentileResult {
  const score = calculateQuizScore(answers);
  const percentage = calculateQuizPercentage(score);
  const reviews = buildAnswerReviews(answers);
  const unansweredCount = reviews.filter((row) => row.isUnanswered).length;
  const answeredCount = QUIZ_MAX_SCORE - unansweredCount;
  const percentLabel = Number.isInteger(percentage)
    ? `${percentage}%`
    : `${percentage.toFixed(1)}%`;

  return {
    score,
    maxScore: QUIZ_MAX_SCORE,
    percentage,
    formattedScore: `${score} / ${QUIZ_MAX_SCORE}`,
    formattedPercent: percentLabel,
    resultMessage: getQuizFeedback(score),
    answeredCount,
    unansweredCount,
    reviews,
  };
}

export function calculateQuizResult(
  input: QuizUsIncomePercentileInput,
): QuizUsIncomePercentileResult | null {
  if (!input.isSubmitted) return null;
  return generateQuizResult(input.answers);
}

export function shareQuizText(
  title: string,
  result: QuizUsIncomePercentileResult,
): string {
  return [
    `${title} | Omega Calculators`,
    `Score: ${result.formattedScore} (${result.formattedPercent})`,
    `Answered: ${result.answeredCount}/${result.maxScore}`,
    result.resultMessage,
  ].join('\n');
}
