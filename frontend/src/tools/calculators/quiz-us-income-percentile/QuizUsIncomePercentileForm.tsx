'use client';

import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizQuestionId,
  QuizUsIncomePercentileInput,
  QuizUsIncomePercentileResult,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';

interface QuizUsIncomePercentileFormProps {
  input: QuizUsIncomePercentileInput;
  result: QuizUsIncomePercentileResult | null;
  onChange: (input: QuizUsIncomePercentileInput) => void;
  onSubmit: () => void;
}

export function QuizUsIncomePercentileForm({
  input,
  result,
  onChange,
  onSubmit,
}: QuizUsIncomePercentileFormProps) {
  const submitted = input.isSubmitted && result !== null;

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
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Quiz: US income percentiles
        </legend>
        <p className="text-xs text-muted-foreground">
          Answer the questions below, then check your score. Unanswered items
          count as incorrect.
        </p>

        {QUIZ_QUESTIONS.map((question, index) => {
          const selected = input.answers[question.id];
          const review = submitted
            ? result.reviews.find((row) => row.questionId === question.id)
            : null;

          return (
            <div
              key={question.id}
              className={
                index < QUIZ_QUESTIONS.length - 1
                  ? 'space-y-2.5 border-b border-border pb-5'
                  : 'space-y-2.5'
              }
            >
              <p
                id={`quiz-uip-${question.id}-label`}
                className="text-[13px] font-medium text-accent"
              >
                <span className="text-muted-foreground">
                  {question.number}/{QUIZ_MAX_SCORE}
                </span>{' '}
                {question.prompt}
              </p>

              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-labelledby={`quiz-uip-${question.id}-label`}
              >
                {question.options.map((option) => {
                  const optionId = `quiz-uip-${question.id}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={`quiz-uip-${question.id}`}
                        value={option.id}
                        checked={selected === option.id}
                        className="h-4 w-4 accent-primary"
                        onChange={() => setAnswer(question.id, option.id)}
                      />
                      <span>
                        <span className="font-medium text-muted-foreground">
                          {option.id}.
                        </span>{' '}
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div
                className="flex gap-2 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-sky-950/90 sm:text-sm"
                role="note"
              >
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-sky-700"
                  aria-hidden
                />
                <p>{question.hint}</p>
              </div>

              {review ? (
                <div
                  className={`rounded-lg border px-3 py-2.5 text-xs leading-relaxed sm:text-sm ${
                    review.isUnanswered
                      ? 'border-border bg-muted/30 text-accent'
                      : review.isCorrect
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                        : 'border-rose-200 bg-rose-50 text-rose-950'
                  }`}
                  aria-live="polite"
                >
                  <p className="font-semibold">
                    {review.isUnanswered
                      ? 'Unanswered'
                      : review.isCorrect
                        ? 'Correct'
                        : 'Incorrect'}
                    .
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Your answer:</span>{' '}
                    {review.selectedLabel ?? '—'}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Correct answer:</span>{' '}
                    {review.correctAnswer}. {review.correctLabel}
                  </p>
                  <p className="mt-1.5 opacity-90">{review.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        <div>
          <label className={labelClass} htmlFor="quiz-uip-score">
            Your overall score
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="quiz-uip-score"
              className="h-11 w-full bg-transparent text-sm tabular-nums font-semibold text-accent outline-none"
              readOnly
              value={submitted ? result.formattedScore : ''}
              aria-describedby="quiz-uip-score-help"
              aria-live="polite"
            />
          </div>
          <p
            id="quiz-uip-score-help"
            className="mt-1.5 text-xs text-muted-foreground"
            role="status"
          >
            {submitted
              ? `${result.formattedPercent} correct · ${result.resultMessage}`
              : 'Press “Check answers” to score the quiz. Unanswered questions count as 0.'}
          </p>
        </div>

        {submitted ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Review the green and red markers above each question, then use the
            explanations to strengthen any weak spots.
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 font-medium">
          Check answers
        </Button>
      </div>
    </form>
  );
}
