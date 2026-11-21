'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatCount } from './calculation';
import type { NPSFieldErrors, NPSInput, NPSResult } from './types';
import { SURVEY_SCORES, scoreLabel } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function categoryTone(category: 'promoter' | 'passive' | 'detractor'): string {
  if (category === 'promoter') return 'bg-emerald-500';
  if (category === 'passive') return 'bg-amber-400';
  return 'bg-rose-500';
}

interface NpsFormProps {
  input: NPSInput;
  errors: NPSFieldErrors;
  result: NPSResult | null;
  onChange: (input: NPSInput) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function NpsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onClear,
  onReset,
}: NpsFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Enter how many respondents selected each score from 0 to 10. Promoters are 9–10, passives
        7–8, and detractors 0–6. NPS = % Promoters − % Detractors.
      </p>

      <form
        className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">
          Number of responses for each survey score
        </h3>

        {SURVEY_SCORES.map((score) => {
          const errorKey = `score${score}` as keyof NPSFieldErrors;
          const error = errors[errorKey];
          const category = scoreLabel(score);
          return (
            <div key={score}>
              <label className={labelClass} htmlFor={`nps-${score}`}>
                <span>
                  Score {score}
                  <span className="ml-1.5 font-normal text-muted-foreground">({category})</span>
                </span>
                {score === 10 ? (
                  <InfoTooltip
                    label="Survey scores"
                    text="Standard NPS classification: 9–10 Promoters, 7–8 Passives, 0–6 Detractors. Enter whole-number response counts only."
                  />
                ) : null}
              </label>
              <FieldShell error={error}>
                <input
                  id={`nps-${score}`}
                  className={inputClass}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={input.counts[String(score)] ?? ''}
                  aria-invalid={Boolean(error)}
                  placeholder="0"
                  onChange={(e) =>
                    onChange({
                      ...input,
                      counts: { ...input.counts, [String(score)]: e.target.value },
                    })
                  }
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">responses</span>
              </FieldShell>
              {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
            </div>
          );
        })}
      </form>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Responses analysis</h3>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">
            Good responses (Promoters)
          </p>
          <FieldShell className="bg-muted/30">
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result ? formatCount(result.promoters) : ''}
              aria-readonly="true"
              aria-label="Promoter count"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">responses</span>
          </FieldShell>
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">
            Neutral responses (Passives)
          </p>
          <FieldShell className="bg-muted/30">
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result ? formatCount(result.passives) : ''}
              aria-readonly="true"
              aria-label="Passive count"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">responses</span>
          </FieldShell>
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">
            Bad responses (Detractors)
          </p>
          <FieldShell className="bg-muted/30">
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result ? formatCount(result.detractors) : ''}
              aria-readonly="true"
              aria-label="Detractor count"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">responses</span>
          </FieldShell>
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">Total responses</p>
          <FieldShell className="bg-muted/30">
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result ? formatCount(result.totalResponses) : ''}
              aria-readonly="true"
              aria-label="Total responses"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">responses</span>
          </FieldShell>
        </div>
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Net promoter score (NPS)</h3>

        <div className="rounded-lg border border-border bg-white px-3 py-3">
          {result ? (
            <>
              <p className="text-xs text-muted-foreground">Net Promoter Score</p>
              <p
                className="text-3xl font-semibold tabular-nums text-accent"
                aria-live="polite"
              >
                {result.formattedNps}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {result.interpretation}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {errors.form ??
                'Enter survey response counts to calculate Net Promoter Score.'}
            </p>
          )}
        </div>

        {result ? (
          <>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>
                Promoters: {formatCount(result.promoters)} (
                {result.formattedPromoterPercentage}%)
              </li>
              <li>
                Passives: {formatCount(result.passives)} ({result.formattedPassivePercentage}
                %)
              </li>
              <li>
                Detractors: {formatCount(result.detractors)} (
                {result.formattedDetractorPercentage}%)
              </li>
              <li>Total responses: {formatCount(result.totalResponses)}</li>
              <li>
                Average survey score: {result.formattedAverageScore}{' '}
                <span className="text-muted-foreground">(not NPS)</span>
              </li>
            </ul>

            <div aria-label="Response category distribution">
              <p className="mb-1.5 text-[13px] font-medium text-accent">Response mix</p>
              <div className="flex h-4 overflow-hidden rounded-full border border-border">
                {(
                  [
                    ['promoter', result.promoterPercentage],
                    ['passive', result.passivePercentage],
                    ['detractor', result.detractorPercentage],
                  ] as const
                ).map(([category, pct]) =>
                  pct > 0 ? (
                    <div
                      key={category}
                      className={categoryTone(category)}
                      style={{ width: `${pct}%` }}
                      title={`${category}: ${pct.toFixed(1)}%`}
                    />
                  ) : null,
                )}
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden />
                  Promoters {result.formattedPromoterPercentage}%
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" aria-hidden />
                  Passives {result.formattedPassivePercentage}%
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500" aria-hidden />
                  Detractors {result.formattedDetractorPercentage}%
                </li>
              </ul>
            </div>
          </>
        ) : null}
      </div>

      {errors.form && result === null ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
 Example: NPS +25
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
