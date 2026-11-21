'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ForwardRateFieldErrors,
  ForwardRateInput,
  ForwardRateResult,
  ForwardRateTimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

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

interface ForwardRateFormProps {
  input: ForwardRateInput;
  errors: ForwardRateFieldErrors;
  result: ForwardRateResult | null;
  onChange: (input: ForwardRateInput) => void;
  onLoadExample: () => void;
}

export function ForwardRateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: ForwardRateFormProps) {
  const set = (patch: Partial<ForwardRateInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Implied forward rate from two annually compounded spot rates. Enter
        times n₁ &lt; n₂ and spots S₁, S₂ as percentages (5 means 5%). Months
        convert as years = months ÷ 12.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (1y @ 5% · 2y @ 6% → ≈ 7.01%)
      </button>

      <CollapsibleSection
        title="Time period 1"
        open={input.section1Open}
        onToggle={() => set({ section1Open: !input.section1Open })}
      >
        <div>
          <label htmlFor="fr-n1" className={labelClass}>
            Time period 1 (n₁)
            <InfoTooltip
              label="Time period 1"
              text="Shorter maturity of the first spot rate, expressed in years or months. Converted to years for the formula."
            />
          </label>
          <FieldShell error={errors.n1}>
            <input
              id="fr-n1"
              className={inputClass}
              inputMode="decimal"
              value={input.n1}
              onChange={(e) => set({ n1: e.target.value })}
              placeholder="1"
              aria-invalid={Boolean(errors.n1)}
            />
            <select
              className={unitSelectClass}
              aria-label="Time period 1 unit"
              value={input.n1Unit}
              onChange={(e) =>
                set({ n1Unit: e.target.value as ForwardRateTimeUnit })
              }
            >
              <option value="years">yrs</option>
              <option value="months">mo</option>
            </select>
          </FieldShell>
          {errors.n1 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.n1}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fr-s1" className={labelClass}>
            Spot rate for time period 1 (S₁)
            <InfoTooltip
              label="Spot rate S1"
              text="Annually compounded spot rate to maturity n₁, entered as a percent. Must satisfy 1 + S₁/100 > 0."
            />
          </label>
          <FieldShell error={errors.s1Percent}>
            <input
              id="fr-s1"
              className={inputClass}
              inputMode="decimal"
              value={input.s1Percent}
              onChange={(e) => set({ s1Percent: e.target.value })}
              placeholder="5"
              aria-invalid={Boolean(errors.s1Percent)}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.s1Percent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.s1Percent}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Time period 2"
        open={input.section2Open}
        onToggle={() => set({ section2Open: !input.section2Open })}
      >
        <div>
          <label htmlFor="fr-n2" className={labelClass}>
            Time period 2 (n₂)
            <InfoTooltip
              label="Time period 2"
              text="Longer maturity of the second spot rate. Must be strictly greater than n₁ after unit conversion."
            />
          </label>
          <FieldShell error={errors.n2}>
            <input
              id="fr-n2"
              className={inputClass}
              inputMode="decimal"
              value={input.n2}
              onChange={(e) => set({ n2: e.target.value })}
              placeholder="2"
              aria-invalid={Boolean(errors.n2)}
            />
            <select
              className={unitSelectClass}
              aria-label="Time period 2 unit"
              value={input.n2Unit}
              onChange={(e) =>
                set({ n2Unit: e.target.value as ForwardRateTimeUnit })
              }
            >
              <option value="years">yrs</option>
              <option value="months">mo</option>
            </select>
          </FieldShell>
          {errors.n2 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.n2}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="fr-s2" className={labelClass}>
            Spot rate for time period 2 (S₂)
            <InfoTooltip
              label="Spot rate S2"
              text="Annually compounded spot rate to maturity n₂, entered as a percent. Must satisfy 1 + S₂/100 > 0."
            />
          </label>
          <FieldShell error={errors.s2Percent}>
            <input
              id="fr-s2"
              className={inputClass}
              inputMode="decimal"
              value={input.s2Percent}
              onChange={(e) => set({ s2Percent: e.target.value })}
              placeholder="6"
              aria-invalid={Boolean(errors.s2Percent)}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.s2Percent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.s2Percent}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Forward rate"
        open={input.resultsOpen}
        onToggle={() => set({ resultsOpen: !input.resultsOpen })}
      >
        <div>
          <label htmlFor="fr-out" className={labelClass}>
            Forward rate
          </label>
          <FieldShell muted>
            <input
              id="fr-out"
              className={inputClass}
              readOnly
              aria-readonly
              value={
                result
                  ? result.forwardRatePercent.toLocaleString('en-US', {
                      maximumFractionDigits: 6,
                    })
                  : ''
              }
              placeholder="—"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.form ? (
            <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
          ) : null}
        </div>
      </CollapsibleSection>
    </form>
  );
}
