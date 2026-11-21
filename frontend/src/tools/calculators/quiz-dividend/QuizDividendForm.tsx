'use client';

import Link from 'next/link';
import { isQuestionCorrect, shouldRevealAnswers } from './calculation';
import {
  DIVIDEND_YIELD_CALCULATOR_HREF,
  QUIZ_MAX_SCORE,
  QUIZ_QUESTIONS,
} from './questions';
import type {
  QuizAnswerId,
  QuizDividendInput,
  QuizDividendResult,
  QuizQuestionId,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const fieldClass =
  'flex h-11 items-center rounded-lg border border-border bg-white px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary';

interface QuizDividendFormProps {
  input: QuizDividendInput;
  result: QuizDividendResult;
  onChange: (input: QuizDividendInput) => void;
}

export function QuizDividendForm({
  input,
  result,
  onChange,
}: QuizDividendFormProps) {
  const reveal = shouldRevealAnswers(input);

  const setChoice = (questionId: QuizQuestionId, answer: QuizAnswerId) => {
    onChange({
      ...input,
      answers: {
        ...input.answers,
        [questionId]: answer,
      },
    });
  };

  const setNumeric = (questionId: 'q4' | 'q6', value: string) => {
    onChange({
      ...input,
      answers: {
        ...input.answers,
        [questionId]: value,
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
          Dividend quiz: Test your investing basics
        </legend>
        <p className="text-xs text-muted-foreground">
          Answer every question to unlock your results and feedback.
        </p>

        {QUIZ_QUESTIONS.map((question) => {
          if (question.kind === 'choice') {
            const selected = input.answers[question.id] as QuizAnswerId | null;
            const correctOption = question.options.find(
              (option) => option.id === question.correctAnswer
            );

            return (
              <div key={question.id} className="space-y-2.5">
                <p
                  id={`quiz-div-${question.id}-label`}
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
                  aria-labelledby={`quiz-div-${question.id}-label`}
                >
                  {question.options.map((option) => {
                    const optionId = `quiz-div-${question.id}-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        htmlFor={optionId}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                      >
                        <input
                          id={optionId}
                          type="radio"
                          name={`quiz-div-${question.id}`}
                          value={option.id}
                          checked={selected === option.id}
                          className="h-4 w-4 accent-primary"
                          onChange={() => setChoice(question.id, option.id)}
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
                        {isQuestionCorrect(input.answers, question.id)
                          ? 'Correct'
                          : 'Incorrect'}
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
          }

          const raw =
            question.id === 'q4' ? input.answers.q4 : input.answers.q6;
          const inputId = `quiz-div-${question.id}-input`;

          return (
            <div key={question.id} className="space-y-2.5">
              <p
                id={`quiz-div-${question.id}-label`}
                className="text-[13px] font-medium text-accent"
              >
                <span className="text-muted-foreground">
                  {question.number}/{QUIZ_MAX_SCORE}
                </span>{' '}
                {question.prompt}
              </p>

              <div className={fieldClass}>
                {question.kind === 'money' ? (
                  <span className="mr-1.5 shrink-0 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                ) : null}
                <input
                  id={inputId}
                  type="text"
                  inputMode="decimal"
                  className="h-11 w-full bg-transparent text-sm tabular-nums text-accent outline-none"
                  value={raw}
                  aria-labelledby={`quiz-div-${question.id}-label`}
                  placeholder={question.kind === 'percent' ? '0' : '0.00'}
                  onChange={(event) =>
                    setNumeric(question.id, event.target.value)
                  }
                />
                {question.kind === 'percent' ? (
                  <span className="ml-1.5 shrink-0 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                ) : null}
              </div>

              {question.id === 'q4' ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Want to check a yield on real numbers? Try our{' '}
                  <Link
                    href={DIVIDEND_YIELD_CALCULATOR_HREF}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    dividend yield calculator
                  </Link>
                  .
                </p>
              ) : null}

              {reveal ? (
                <div
                  className="rounded-lg border border-border bg-white px-3 py-2.5 text-xs leading-relaxed text-accent sm:text-sm"
                  aria-live="polite"
                >
                  <p>
                    <span className="font-semibold">
                      {isQuestionCorrect(input.answers, question.id)
                        ? 'Correct'
                        : 'Incorrect'}
                      .
                    </span>{' '}
                    <span className="font-semibold">Correct answer:</span>{' '}
                    {question.correctLabel}
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
          <label className={labelClass} htmlFor="quiz-div-score">
            Score
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="quiz-div-score"
              className="h-11 w-full bg-transparent text-sm tabular-nums font-semibold text-accent outline-none"
              readOnly
              value={result.complete ? String(result.score) : ''}
              aria-describedby="quiz-div-score-help"
              aria-live="polite"
            />
            <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
              /{QUIZ_MAX_SCORE}
            </span>
          </div>
          <p
            id="quiz-div-score-help"
            className="mt-1.5 text-xs text-muted-foreground"
            role="status"
          >
            {result.complete
              ? `You scored ${result.formattedScore} (${result.formattedPercent} accuracy).`
              : 'Please answer all questions to see your score!'}
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary"
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
        {input.showExplanations && !result.complete ? (
          <p className="text-xs text-muted-foreground">
            Explanations appear after every question has an answer.
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
