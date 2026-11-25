'use client';

import type { ReactNode } from 'react';
import type {
  DoublingTimeUnit,
  PsaDoublingTimeFieldErrors,
  PsaDoublingTimeInput,
  PsaDoublingTimeResult,
} from './types';
import { DOUBLING_TIME_UNIT_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const suffixClass = 'shrink-0 pr-3 text-sm text-muted-foreground';

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      <p className="mb-3 text-sm font-semibold text-accent">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface Props {
  input: PsaDoublingTimeInput;
  errors: PsaDoublingTimeFieldErrors;
  result: PsaDoublingTimeResult | null;
  onChange: (input: PsaDoublingTimeInput) => void;
  onLoadExample: () => void;
}

export function PsaDoublingTimeForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PsaDoublingTimeInput>) =>
    onChange({ ...input, ...patch });

  const fieldShell = (error?: string, muted?: boolean) =>
    `relative flex h-11 min-w-0 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
      muted ? 'border-border bg-muted/30' : 'border-border bg-white'
    } ${error ? 'border-rose-400' : ''}`;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational PSA doubling time from two dated PSA levels (ng/mL). Not a
        diagnosis or treatment recommendation.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (2 → 4 ng/mL over 90 days → DT 90 days)
        </button>
      </p>

      {errors.form ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.form}
        </p>
      ) : null}

      <SectionCard title="Older PSA test">
        <div>
          <label className={labelClass} htmlFor="psadt-older-date">
            Date
          </label>
          <div className={fieldShell(errors.olderDate)}>
            <input
              id="psadt-older-date"
              type="date"
              className={inputClass}
              value={input.olderDate}
              aria-invalid={Boolean(errors.olderDate)}
              onChange={(e) => set({ olderDate: e.target.value })}
            />
          </div>
          {errors.olderDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.olderDate}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="psadt-older-psa">
            PSA level
          </label>
          <div className={fieldShell(errors.olderPsa)}>
            <input
              id="psadt-older-psa"
              className={inputClass}
              inputMode="decimal"
              value={input.olderPsa}
              aria-invalid={Boolean(errors.olderPsa)}
              onChange={(e) => set({ olderPsa: e.target.value })}
            />
            <span className={suffixClass}>ng/mL</span>
          </div>
          {errors.olderPsa ? (
            <p className="mt-1 text-xs text-rose-600">{errors.olderPsa}</p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Newer PSA test">
        <div>
          <label className={labelClass} htmlFor="psadt-newer-date">
            Date
          </label>
          <div className={fieldShell(errors.newerDate)}>
            <input
              id="psadt-newer-date"
              type="date"
              className={inputClass}
              value={input.newerDate}
              aria-invalid={Boolean(errors.newerDate)}
              onChange={(e) => set({ newerDate: e.target.value })}
            />
          </div>
          {errors.newerDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newerDate}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="psadt-newer-psa">
            PSA level
          </label>
          <div className={fieldShell(errors.newerPsa)}>
            <input
              id="psadt-newer-psa"
              className={inputClass}
              inputMode="decimal"
              value={input.newerPsa}
              aria-invalid={Boolean(errors.newerPsa)}
              onChange={(e) => set({ newerPsa: e.target.value })}
            />
            <span className={suffixClass}>ng/mL</span>
          </div>
          {errors.newerPsa ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newerPsa}</p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Result">
        <div>
          <label className={labelClass} htmlFor="psadt-dt">
            Doubling time
          </label>
          <div className={fieldShell(undefined, true)}>
            <input
              id="psadt-dt"
              className={`${inputClass} cursor-default`}
              readOnly
              value={result?.formattedDoublingTime ?? ''}
              aria-live="polite"
            />
            <select
              className={selectClass}
              aria-label="Doubling time unit"
              value={input.doublingTimeUnit}
              onChange={(e) =>
                set({ doublingTimeUnit: e.target.value as DoublingTimeUnit })
              }
            >
              {(
                Object.keys(DOUBLING_TIME_UNIT_LABELS) as DoublingTimeUnit[]
              ).map((u) => (
                <option key={u} value={u}>
                  {DOUBLING_TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showSlopeAndVelocity}
            onChange={(e) => set({ showSlopeAndVelocity: e.target.checked })}
          />
          <span>Show slope and velocity</span>
        </label>

        {input.showSlopeAndVelocity ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="psadt-velocity">
                PSA velocity
              </label>
              <div className={fieldShell(undefined, true)}>
                <input
                  id="psadt-velocity"
                  className={`${inputClass} cursor-default`}
                  readOnly
                  value={result?.formattedPsaVelocity ?? ''}
                />
                <span className={suffixClass}>ng/mL/yr</span>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="psadt-slope">
                Log slope
              </label>
              <div className={fieldShell(undefined, true)}>
                <input
                  id="psadt-slope"
                  className={`${inputClass} cursor-default`}
                  readOnly
                  value={result?.formattedLogSlope ?? ''}
                />
                <span className={suffixClass}>/yr</span>
              </div>
            </div>
          </div>
        ) : null}

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </SectionCard>
    </form>
  );
}