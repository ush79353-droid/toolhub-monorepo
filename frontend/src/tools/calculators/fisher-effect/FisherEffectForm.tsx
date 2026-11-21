'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FisherCalculationMode,
  FisherEffectFieldErrors,
  FisherEffectInput,
  FisherEffectResult,
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

interface FisherEffectFormProps {
  input: FisherEffectInput;
  errors: FisherEffectFieldErrors;
  result: FisherEffectResult | null;
  onChange: (input: FisherEffectInput) => void;
}

const MODES: { id: FisherCalculationMode; label: string }[] = [
  { id: 'real', label: 'Real interest rate' },
  { id: 'nominal', label: 'Nominal interest rate' },
  { id: 'inflation', label: 'Expected inflation' },
];

export function FisherEffectForm({
  input,
  errors,
  result,
  onChange,
}: FisherEffectFormProps) {
  const set = (patch: Partial<FisherEffectInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: FisherCalculationMode) => {
    if (mode === input.mode) return;
    // Preserve known values; clear the newly computed field display by keeping strings
    onChange({ ...input, mode });
  };

  const nominalEditable = input.mode !== 'nominal';
  const realEditable = input.mode !== 'real';
  const inflationEditable = input.mode !== 'inflation';

  const nominalDisplay = nominalEditable
    ? input.nominalRate
    : (result?.formattedNominal.replace(/%$/, '') ?? '');
  const realDisplay = realEditable
    ? input.realRate
    : (result?.formattedReal.replace(/%$/, '') ?? '');
  const inflationDisplay = inflationEditable
    ? input.expectedInflation
    : (result?.formattedInflation.replace(/%$/, '') ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Exact Fisher equation is the default: (1+i)=(1+r)(1+πᵉ). Approximate
        i≈r+πᵉ is shown for comparison only. Rates are not guaranteed investment
        returns.
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Calculation mode"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={input.mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.mode === m.id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="fe-nominal" className={labelClass}>
          Nominal interest rate
          <InfoTooltip
            label="Nominal interest rate"
            text="The stated annual interest rate before adjusting for inflation."
          />
        </label>
        <FieldShell error={errors.nominalRate} muted={!nominalEditable}>
          <input
            id="fe-nominal"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!nominalEditable ? 'cursor-default font-semibold' : ''}`}
            value={nominalDisplay}
            readOnly={!nominalEditable}
            tabIndex={nominalEditable ? 0 : -1}
            onChange={(e) => set({ nominalRate: e.target.value })}
            aria-invalid={Boolean(errors.nominalRate)}
            aria-readonly={!nominalEditable}
            placeholder="5"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.nominalRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.nominalRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fe-inflation" className={labelClass}>
          Expected inflation
          <InfoTooltip
            label="Expected inflation"
            text="Anticipated change in the general price level over the same period. Negative values represent deflation."
          />
        </label>
        <FieldShell error={errors.expectedInflation} muted={!inflationEditable}>
          <input
            id="fe-inflation"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!inflationEditable ? 'cursor-default font-semibold' : ''}`}
            value={inflationDisplay}
            readOnly={!inflationEditable}
            tabIndex={inflationEditable ? 0 : -1}
            onChange={(e) => set({ expectedInflation: e.target.value })}
            aria-invalid={Boolean(errors.expectedInflation)}
            aria-readonly={!inflationEditable}
            placeholder="2"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.expectedInflation ? (
          <p className="mt-1 text-xs text-rose-600">{errors.expectedInflation}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fe-real" className={labelClass}>
          Real interest rate
          <InfoTooltip
            label="Real interest rate"
            text="The inflation-adjusted interest rate from the Fisher equation."
          />
        </label>
        <FieldShell error={errors.realRate} muted={!realEditable}>
          <input
            id="fe-real"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!realEditable ? 'cursor-default font-semibold' : ''}`}
            value={realDisplay}
            readOnly={!realEditable}
            tabIndex={realEditable ? 0 : -1}
            onChange={(e) => set({ realRate: e.target.value })}
            aria-invalid={Boolean(errors.realRate)}
            aria-readonly={!realEditable}
            placeholder="—"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.realRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.realRate}</p>
        ) : null}
      </div>
    </form>
  );
}
