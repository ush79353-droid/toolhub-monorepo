'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LutealPhaseFieldErrors,
  LutealPhaseInput,
  LutealPhaseResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
  input: LutealPhaseInput;
  errors: LutealPhaseFieldErrors;
  result: LutealPhaseResult | null;
  onChange: (input: LutealPhaseInput) => void;
}

export function LutealPhaseForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<LutealPhaseInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="lp-ovulation">
          <span>Ovulation date</span>
          <InfoTooltip
            label="Ovulation date"
            text="Estimated or confirmed ovulation day for the cycle you are measuring."
          />
        </label>
        <FieldShell error={errors.ovulationDate}>
          <input
            id="lp-ovulation"
            type="date"
            className={inputClass}
            value={input.ovulationDate}
            aria-invalid={Boolean(errors.ovulationDate)}
            onChange={(e) => set({ ovulationDate: e.target.value })}
          />
        </FieldShell>
        {!input.ovulationDate ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : null}
        {errors.ovulationDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ovulationDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lp-period">
          <span>First day of period</span>
          <InfoTooltip
            label="First day of period"
            text="First day of the next menstrual period after that ovulation — not an earlier bleed."
          />
        </label>
        <FieldShell error={errors.periodStartDate}>
          <input
            id="lp-period"
            type="date"
            className={inputClass}
            value={input.periodStartDate}
            aria-invalid={Boolean(errors.periodStartDate)}
            onChange={(e) => set({ periodStartDate: e.target.value })}
          />
        </FieldShell>
        {!input.periodStartDate ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : null}
        {errors.periodStartDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodStartDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lp-length">
          <span>Luteal phase length</span>
          <InfoTooltip
            label="Luteal phase length"
            text="Calendar days from ovulation to the first day of the next period."
          />
        </label>
        <FieldShell muted>
          <output
            id="lp-length"
            className="flex w-full items-center gap-2 px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            <span className="font-medium">
              {result ? result.lutealPhaseDays : ''}
            </span>
            <span className="ml-auto text-sm font-medium text-primary">days</span>
          </output>
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
            'Educational estimate only — not ovulation test confirmation or medical advice.'}
        </p>
      </div>
    </form>
  );
}