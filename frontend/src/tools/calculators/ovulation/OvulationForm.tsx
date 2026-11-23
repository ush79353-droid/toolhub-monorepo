'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OvulationCycleResult,
  OvulationFieldErrors,
  OvulationInput,
  OvulationResult,
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
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function CycleFields({ cycle }: { cycle: OvulationCycleResult | undefined }) {
  return (
    <>
      <div>
        <div className={labelClass}>
          <span>Ovulation day</span>
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={cycle?.formattedOvulation ?? ''}
            aria-label="Ovulation day"
            tabIndex={-1}
          />
        </FieldShell>
      </div>
      <div>
        <div className={labelClass}>
          <span>First day of fertility window</span>
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={cycle?.formattedFertileStart ?? ''}
            aria-label="First day of fertility window"
            tabIndex={-1}
          />
        </FieldShell>
      </div>
      <div>
        <div className={labelClass}>
          <span>Last day of fertility window</span>
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={cycle?.formattedFertileEnd ?? ''}
            aria-label="Last day of fertility window"
            tabIndex={-1}
          />
        </FieldShell>
      </div>
      <div>
        <div className={labelClass}>
          <span>Due date</span>
          <InfoTooltip text="Educational EDD ≈ estimated conception (ovulation day) + 266 days (ACOG-style). Approximate only." />
        </div>
        <FieldShell muted>
          <input
            className={inputClass}
            readOnly
            value={cycle?.formattedDueDate ?? ''}
            aria-label="Estimated due date"
            tabIndex={-1}
          />
        </FieldShell>
      </div>
    </>
  );
}

interface Props {
  input: OvulationInput;
  errors: OvulationFieldErrors;
  result: OvulationResult | null;
  onChange: (input: OvulationInput) => void;
  onLoadExample: () => void;
}

export function OvulationForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<OvulationInput>) =>
    onChange({ ...input, ...patch });

  const c0 = result?.cycles[0];
  const c1 = result?.cycles[1];
  const c2 = result?.cycles[2];

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Educational ovulation and fertile-window calendar from cycle length and
        LMP.{' '}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-2 hover:underline"
          onClick={onLoadExample}
        >
          Load example
        </button>
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <div className={labelClass}>
          <span>Cycle duration</span>
          <InfoTooltip text="Average menstrual cycle length in whole days (21–45)." />
        </div>
        <FieldShell error={errors.cycleDurationDays}>
          <input
            className={inputClass}
            inputMode="numeric"
            value={input.cycleDurationDays}
            aria-label="Cycle duration in days"
            onChange={(e) => set({ cycleDurationDays: e.target.value })}
          />
          <span className="shrink-0 px-3 text-sm text-muted-foreground">
            days
          </span>
        </FieldShell>
        {errors.cycleDurationDays ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.cycleDurationDays}
          </p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>My last period started on…</span>
          <InfoTooltip text="First day of your last menstrual period (day 1 of the cycle)." />
        </div>
        <FieldShell error={errors.lastPeriodIso}>
          <input
            className={inputClass}
            type="date"
            value={input.lastPeriodIso}
            aria-label="Last period start date"
            onChange={(e) => set({ lastPeriodIso: e.target.value })}
          />
        </FieldShell>
        {errors.lastPeriodIso ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lastPeriodIso}</p>
        ) : null}
      </div>

      <CollapsibleSection
        title="First cycle"
        open={input.firstCycleOpen}
        onToggle={() => set({ firstCycleOpen: !input.firstCycleOpen })}
      >
        <CycleFields cycle={c0} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Second cycle"
        open={input.secondCycleOpen}
        onToggle={() => set({ secondCycleOpen: !input.secondCycleOpen })}
      >
        <CycleFields cycle={c1} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Third cycle"
        open={input.thirdCycleOpen}
        onToggle={() => set({ thirdCycleOpen: !input.thirdCycleOpen })}
      >
        <CycleFields cycle={c2} />
      </CollapsibleSection>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation} {result.disclaimer}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter cycle length and last-period start to see ovulation, fertile
          window, and approximate due dates for three cycles.
        </p>
      )}
    </form>
  );
}
