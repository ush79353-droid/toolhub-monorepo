'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GaDisplayUnit,
  GestationalAgeFieldErrors,
  GestationalAgeInput,
  GestationalAgeResult,
} from './types';
import { GA_DISPLAY_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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
  input: GestationalAgeInput;
  errors: GestationalAgeFieldErrors;
  result: GestationalAgeResult | null;
  onChange: (input: GestationalAgeInput) => void;
}

export function GestationalAgeForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<GestationalAgeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational gestational age from an estimated due date. Entries stay in
        your browser only — not stored or shared in the link.
      </p>

      <div>
        <label className={labelClass} htmlFor="ga-edd">
          <span>Estimated due date</span>
          <InfoTooltip
            label="Estimated due date"
            text="EDD used with the current date to estimate completed gestational weeks and days (280-day convention)."
          />
        </label>
        <FieldShell error={errors.dueDate}>
          <input
            id="ga-edd"
            type="date"
            className={inputClass}
            value={input.dueDate}
            aria-invalid={Boolean(errors.dueDate)}
            onChange={(e) => set({ dueDate: e.target.value })}
          />
        </FieldShell>
        {!input.dueDate ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : null}
        {errors.dueDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ga-current">
          <span>Current date</span>
          <InfoTooltip
            label="Current date"
            text="Date as of which gestational age is counted. Defaults to today on your device."
          />
        </label>
        <FieldShell error={errors.currentDate}>
          <input
            id="ga-current"
            type="date"
            className={inputClass}
            value={input.currentDate}
            aria-invalid={Boolean(errors.currentDate)}
            onChange={(e) => set({ currentDate: e.target.value })}
          />
        </FieldShell>
        {errors.currentDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ga-out">
          <span>Gestational age</span>
          <InfoTooltip
            label="Gestational age"
            text="Completed weeks and days from EDD-based dating. Switch display between total days and weeks + days."
          />
        </label>
        <FieldShell muted>
          <output
            id="ga-out"
            className="flex w-full items-center gap-2 px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            {result && input.gaDisplayUnit === 'weeksDays' ? (
              <>
                <span className="font-medium">{result.weeks}</span>
                <span className="text-muted-foreground">wks</span>
                <span className="text-muted-foreground" aria-hidden>
                  |
                </span>
                <span className="font-medium">{result.daysRemainder}</span>
                <span className="text-muted-foreground">days</span>
              </>
            ) : result ? (
              <span className="font-medium">{result.gestationalAgeDays}</span>
            ) : (
              <span className="text-muted-foreground" />
            )}
          </output>
          <select
            className={selectClass}
            aria-label="Gestational age display unit"
            value={input.gaDisplayUnit}
            onChange={(e) =>
              set({ gaDisplayUnit: e.target.value as GaDisplayUnit })
            }
          >
            {(Object.keys(GA_DISPLAY_LABELS) as GaDisplayUnit[]).map((u) => (
              <option key={u} value={u}>
                {u === 'days' ? 'days' : 'wks'}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational dating only — not ultrasound measurement or medical advice.'}
        </p>
      </div>
    </form>
  );
}