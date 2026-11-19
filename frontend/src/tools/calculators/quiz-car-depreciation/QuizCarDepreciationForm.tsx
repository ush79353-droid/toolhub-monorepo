'use client';

import type {
  QuizAnswerId,
  QuizCarDepreciationInput,
  QuizCarDepreciationResult,
  QuizQuestionId,
} from './types';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';

interface QuizCarDepreciationFormProps {
  input: QuizCarDepreciationInput;
  result: QuizCarDepreciationResult;
  onChange: (input: QuizCarDepreciationInput) => void;
  /** When true, show per-question feedback for answered items. */
  revealQuestion: (questionId: QuizQuestionId) => boolean;
  isQuestionCorrect: (questionId: QuizQuestionId) => boolean;
}

export function QuizCarDepreciationForm({
  input,
  result,
  onChange,
  revealQuestion,
  isQuestionCorrect,
}: QuizCarDepreciationFormProps) {
  const setAnswer = (questionId: QuizQuestionId, answer: QuizAnswerId) => {
    onChange({
      ...input,
      answers: {
        ...input.answers,
        [questionId]: answer,
      },
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Quiz: The Downward Drive 🏎️
        </legend>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary"
            checked={input.showExplanationsAsIGo}
            onChange={(event) =>
              onChange({
                ...input,
                showExplanationsAsIGo: event.target.checked,
              })
            }
          />
          <span>Show answers and explanations as I go</span>
        </label>

        {QUIZ_QUESTIONS.map((question) => {
          const selected = input.answers[question.id];
          const correctOption = question.options.find(
            (option) => option.id === question.correctAnswer
          );
          const reveal = revealQuestion(question.id);

          return (
            <div key={question.id} className="space-y-2.5">
              <p
                id={`quiz-cd-${question.id}-label`}
                className="text-[13px] font-medium text-accent"
              >
                <span className="mr-1" aria-hidden="true">
                  🚗
                </span>
                <span className="text-muted-foreground">
                  {question.number}/{QUIZ_MAX_SCORE}
                </span>{' '}
                {question.prompt}
              </p>

              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-labelledby={`quiz-cd-${question.id}-label`}
              >
                {question.options.map((option) => {
                  const optionId = `quiz-cd-${question.id}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={`quiz-cd-${question.id}`}
                        value={option.id}
                        checked={selected === option.id}
                        className="h-4 w-4 accent-primary"
                        onChange={() => setAnswer(question.id, option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>

              {reveal ? (
                <div
                  className="rounded-lg border border-border bg-white px-3 py-2.5 text-xs leading-relaxed text-accent sm:text-sm"
                  aria-live="polite"
                >
                  <p>
                    <span className="font-semibold">
                      {isQuestionCorrect(question.id) ? 'Correct' : 'Incorrect'}
                      .
                    </span>{' '}
                    <span className="font-semibold">Correct answer:</span>{' '}
                    {correctOption?.label ?? question.correctAnswer}
                  </p>
                  <p className="mt-1.5 text-muted-foreground">
                    {question.explanation}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Your score
        </legend>

        <div>
          <label className={labelClass} htmlFor="quiz-cd-score">
            Score
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="quiz-cd-score"
              className="h-11 w-full bg-transparent text-sm tabular-nums font-semibold text-accent outline-none"
              readOnly
              value={result.complete ? String(result.score) : ''}
              aria-describedby="quiz-cd-score-help"
              aria-live="polite"
            />
            <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
              /{QUIZ_MAX_SCORE}
            </span>
          </div>
          <p
            id="quiz-cd-score-help"
            className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground"
            role="status"
          >
            <span aria-hidden="true">🚗</span>
            <span>
              {result.complete
                ? `You scored ${result.formattedScore}.`
                : 'Please answer all questions to see your score!'}
            </span>
          </p>
        </div>
      </fieldset>
    </form>
  );
}
