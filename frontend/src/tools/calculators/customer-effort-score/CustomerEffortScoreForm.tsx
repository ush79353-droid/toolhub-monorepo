'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  CESFieldErrors,
  CESInput,
  CESResult,
  CESScale,
} from './types';
import { scoreLabels } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface CustomerEffortScoreFormProps {
  input: CESInput;
  errors: CESFieldErrors;
  result: CESResult | null;
  onChange: (input: CESInput) => void;
  onScaleChange: (scale: CESScale) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function CustomerEffortScoreForm({
  input,
  errors,
  result,
  onChange,
  onScaleChange,
  onLoadExample,
  onClear,
  onReset,
}: CustomerEffortScoreFormProps) {
  const labels = scoreLabels(input.scale);
  const maxBar = result
    ? Math.max(1, ...result.distribution.map((row) => row.count))
    : 1;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-accent">
        Select a scale and enter the number of responses for each score.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Scoring direction: <strong>1 = very easy</strong>,{' '}
        <strong>{input.scale} = very difficult</strong>. Lower CES means less customer effort.
      </p>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Select your scale</legend>
        <div className="inline-flex rounded-lg border border-border bg-white p-1" role="radiogroup">
          {([5, 7] as const).map((scale) => {
            const selected = input.scale === scale;
            return (
              <button
                key={scale}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`h-10 min-w-[4.5rem] rounded-md px-3 text-sm font-medium transition-colors ${
                  selected
                    ? 'bg-accent text-white'
                    : 'text-accent hover:bg-muted/60'
                }`}
                onClick={() => onScaleChange(scale)}
              >
                1–{scale}
              </button>
            );
          })}
        </div>
      </fieldset>

      <form
        className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        {labels.map(({ score, label }) => {
          const errorKey = `score${score}` as keyof CESFieldErrors;
          const error = errors[errorKey];
          return (
            <div key={score}>
              <label className={labelClass} htmlFor={`ces-${score}`}>
                <span>
                  {score} — {label}
                </span>
              </label>
              <FieldShell error={error}>
                <input
                  id={`ces-${score}`}
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

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Your CES</h3>
        <div className="rounded-lg border border-border bg-white px-3 py-3">
          {result ? (
            <>
              <p className="text-2xl font-semibold tabular-nums text-accent">
                {result.formattedCes}{' '}
                <span className="text-base font-medium text-muted-foreground">
                  / {result.scale}
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {result.interpretation}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {errors.form ??
                'Enter at least one customer response to calculate CES.'}
            </p>
          )}
        </div>

        {result ? (
          <ul className="space-y-1.5 text-sm text-foreground/90">
            <li>Total responses: {result.totalResponses}</li>
            <li>Weighted sum: {result.weightedSum}</li>
            <li>Scale: 1–{result.scale}</li>
            <li>Low-effort responses: {result.formattedLowEffortPercentage}%</li>
            <li>Neutral responses: {result.formattedNeutralPercentage}%</li>
            <li>High-effort responses: {result.formattedHighEffortPercentage}%</li>
          </ul>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={input.analysisOpen}
          onClick={() => onChange({ ...input, analysisOpen: !input.analysisOpen })}
        >
          <span>Detailed survey analysis</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              input.analysisOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {input.analysisOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            {result ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Median score: {result.median} · Mode
                  {result.modes.length > 1 ? 's' : ''}: {result.modes.join(', ') || '—'}
                </p>
                <div className="space-y-2" aria-label="Score distribution">
                  {result.distribution.map((row) => (
                    <div key={row.score} className="flex items-center gap-2 text-xs">
                      <span className="w-6 tabular-nums text-muted-foreground">{row.score}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded bg-muted">
                        <div
                          className="h-full rounded bg-accent/80"
                          style={{ width: `${(row.count / maxBar) * 100}%` }}
                        />
                      </div>
                      <span className="w-10 text-right tabular-nums text-accent">{row.count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Low effort = scores{' '}
                  {input.scale === 5 ? '1–2' : '1–3'}; neutral ={' '}
                  {input.scale === 5 ? '3' : '4'}; high effort ={' '}
                  {input.scale === 5 ? '4–5' : '5–7'}. Groupings are analytical, not universal
                  benchmarks.
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Analysis appears after a valid CES calculation.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {errors.form && result === null ? null : errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Load example (2.64 / 5)
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
