'use client';

import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizProteinCreatinineRatioInput,
  QuizProteinCreatinineRatioResult,
  QuizQuestionId,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';

interface QuizProteinCreatinineRatioFormProps {
  input: QuizProteinCreatinineRatioInput;
  result: QuizProteinCreatinineRatioResult;
  onChange: (input: QuizProteinCreatinineRatioInput) => void;
}

export function QuizProteinCreatinineRatioForm({
  input,
  result,
  onChange,
}: QuizProteinCreatinineRatioFormProps) {
  const setAnswer = (questionId: QuizQuestionId, answer: QuizAnswerId) => {
    onChange({
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
          Quiz: Protein Creatinine Ratio
        </legend>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Answer all five questions. Your score appears only when every question
          has a selection. Educational only — not medical advice.
        </p>

        {QUIZ_QUESTIONS.map((question) => {
          const selected = input.answers[question.id];

          return (
            <div key={question.id} className="space-y-2.5">
              <p
                id={`quiz-pcr-${question.id}-label`}
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
                aria-labelledby={`quiz-pcr-${question.id}-label`}
              >
                {question.options.map((option) => {
                  const optionId = `quiz-pcr-${question.id}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={`quiz-pcr-${question.id}`}
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
            </div>
          );
        })}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        {!result.complete ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-950 sm:text-sm"
            role="status"
          >
            Make sure you answer all the questions to see your score!
          </p>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="quiz-pcr-score">
            Your score
          </label>
          <div className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3">
            <input
              id="quiz-pcr-score"
              className="h-11 w-full bg-transparent text-sm font-semibold tabular-nums text-accent outline-none"
              readOnly
              value={result.complete ? String(result.score) : ''}
              aria-describedby="quiz-pcr-score-help"
              aria-live="polite"
            />
            <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
              /{QUIZ_MAX_SCORE}
            </span>
          </div>
          <p
            id="quiz-pcr-score-help"
            className="mt-1.5 text-xs text-muted-foreground"
            role="status"
          >
            {result.complete
              ? `You scored ${result.formattedScore}.`
              : 'Answer every question to unlock your score out of 5.'}
          </p>
        </div>
      </fieldset>
    </form>
  );
}
