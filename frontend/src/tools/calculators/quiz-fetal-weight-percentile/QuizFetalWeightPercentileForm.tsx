'use client';

import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import { isQuestionCorrect } from './calculation';
import type {
  QuizAnswerId,
  QuizFetalWeightPercentileInput,
  QuizFetalWeightPercentileResult,
  QuizQuestionId,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';

interface QuizFetalWeightPercentileFormProps {
  input: QuizFetalWeightPercentileInput;
  result: QuizFetalWeightPercentileResult;
  onChange: (input: QuizFetalWeightPercentileInput) => void;
}

export function QuizFetalWeightPercentileForm({
  input,
  result,
  onChange,
}: QuizFetalWeightPercentileFormProps) {
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
          Fetal weight percentile quiz
        </legend>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Answer all five questions. Your score appears only when every question
          has a selection. Educational only — not clinical advice.
        </p>

        {QUIZ_QUESTIONS.map((question) => {
          const selected = input.answers[question.id];
          const showExplain =
            input.showExplanations && result.complete && selected !== null;

          return (
            <div key={question.id} className="space-y-2.5">
              <p
                id={`quiz-fwp-${question.id}-label`}
                className="text-[13px] font-medium text-accent"
              >
                <span className="text-muted-foreground">
                  {question.number}/{QUIZ_MAX_SCORE}.
                </span>{' '}
                {question.prompt}
              </p>

              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-labelledby={`quiz-fwp-${question.id}-label`}
              >
                {question.options.map((option) => {
                  const optionId = `quiz-fwp-${question.id}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={`quiz-fwp-${question.id}`}
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

              {showExplain ? (
                <p className="rounded-lg border border-sky-200/80 bg-sky-50/80 px-3 py-2 text-xs leading-relaxed text-accent sm:text-sm">
                  <strong className="font-semibold">
                    {isQuestionCorrect(input.answers, question.id)
                      ? 'Correct. '
                      : `Correct answer: ${question.correctAnswer}. `}
                  </strong>
                  {question.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Check your results
        </legend>

        <div>
          <label className={labelClass} htmlFor="quiz-fwp-score">
            Your score:
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="quiz-fwp-score"
              className="h-11 w-full bg-transparent text-sm tabular-nums font-semibold text-accent outline-none"
              readOnly
              value={result.complete ? String(result.score) : ''}
              aria-describedby="quiz-fwp-score-help"
              aria-live="polite"
            />
            <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
              /{QUIZ_MAX_SCORE}
            </span>
          </div>
          {!result.complete ? (
            <p
              id="quiz-fwp-score-help"
              className="mt-1.5 text-xs text-muted-foreground"
            >
              Please answer all questions to see your score!
            </p>
          ) : (
            <p
              id="quiz-fwp-score-help"
              className="mt-1.5 text-xs text-muted-foreground"
            >
              Score {result.formattedScore}. Toggle explanations to review each
              answer.
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.showExplanations}
            onChange={(event) =>
              onChange({
                ...input,
                showExplanations: event.target.checked,
              })
            }
          />
          <span>Show explanations and correct answers</span>
        </label>
      </fieldset>
    </form>
  );
}
