'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HcgLevelsFieldErrors,
  HcgLevelsInput,
  HcgLevelsResult,
  TimeUnit,
} from './types';
import { TIME_UNIT_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const suffixClass = 'shrink-0 pr-3 text-sm text-muted-foreground';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: HcgLevelsInput;
  errors: HcgLevelsFieldErrors;
  result: HcgLevelsResult | null;
  onChange: (input: HcgLevelsInput) => void;
  onLoadExample: () => void;
}

export function HcgLevelsForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<HcgLevelsInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational serial β-hCG change metrics (difference, percent change,
        doubling time when rising, standardized 1- and 2-day increases). Not a
        viability or ectopic diagnosis.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (100 → 200 over 2 days)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="hcg-first">
          <span>First β-hCG level</span>
        </label>
        <FieldShell error={errors.firstLevel}>
          <input
            id="hcg-first"
            className={inputClass}
            inputMode="decimal"
            value={input.firstLevel}
            aria-invalid={Boolean(errors.firstLevel)}
            onChange={(e) => set({ firstLevel: e.target.value })}
          />
          <span className={suffixClass}>mIU/ml</span>
        </FieldShell>
        {errors.firstLevel ? (
          <p className="mt-1 text-xs text-rose-600">{errors.firstLevel}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="hcg-second">
          <span>Second β-hCG level</span>
        </label>
        <FieldShell error={errors.secondLevel}>
          <input
            id="hcg-second"
            className={inputClass}
            inputMode="decimal"
            value={input.secondLevel}
            aria-invalid={Boolean(errors.secondLevel)}
            onChange={(e) => set({ secondLevel: e.target.value })}
          />
          <span className={suffixClass}>mIU/ml</span>
        </FieldShell>
        {errors.secondLevel ? (
          <p className="mt-1 text-xs text-rose-600">{errors.secondLevel}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="hcg-elapsed">
          <span>Time between measurements</span>
        </label>
        <FieldShell error={errors.elapsedValue}>
          <input
            id="hcg-elapsed"
            className={inputClass}
            inputMode="decimal"
            value={input.elapsedValue}
            aria-invalid={Boolean(errors.elapsedValue)}
            onChange={(e) => set({ elapsedValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Elapsed time unit"
            value={input.elapsedUnit}
            onChange={(e) =>
              set({ elapsedUnit: e.target.value as TimeUnit })
            }
          >
            {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.elapsedValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.elapsedValue}</p>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="hcg-diff">
            <span>Difference</span>
            <InfoTooltip
              label="Difference"
              text="Second level minus first level (mIU/ml)."
            />
          </label>
          <FieldShell muted>
            <input
              id="hcg-diff"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedDifference ?? ''}
              aria-live="polite"
            />
            <span className={suffixClass}>mIU/ml</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="hcg-pct">
            <span>Percentage change</span>
          </label>
          <FieldShell muted>
            <input
              id="hcg-pct"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedPercentageChange ?? ''}
            />
            <span className={suffixClass}>%</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="hcg-dt">
            <span>Doubling time</span>
          </label>
          <FieldShell muted>
            <input
              id="hcg-dt"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedDoublingTime ?? ''}
            />
            <select
              className={selectClass}
              aria-label="Doubling time unit"
              value={input.doublingTimeUnit}
              onChange={(e) =>
                set({ doublingTimeUnit: e.target.value as TimeUnit })
              }
            >
              {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="hcg-1d">
              <span>One-day increase</span>
            </label>
            <FieldShell muted>
              <input
                id="hcg-1d"
                className={`${inputClass} cursor-default`}
                readOnly
                value={result?.formattedOneDayIncrease ?? ''}
              />
              <span className={suffixClass}>%</span>
            </FieldShell>
          </div>
          <div>
            <label className={labelClass} htmlFor="hcg-2d">
              <span>Two-day increase</span>
            </label>
            <FieldShell muted>
              <input
                id="hcg-2d"
                className={`${inputClass} cursor-default`}
                readOnly
                value={result?.formattedTwoDayIncrease ?? ''}
              />
              <span className={suffixClass}>%</span>
            </FieldShell>
          </div>
        </div>

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </div>
    </form>
  );
}
