'use client';

import Link from 'next/link';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FisherEquationFieldErrors,
  FisherEquationInput,
  FisherEquationMode,
  FisherEquationResult,
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

interface FisherEquationFormProps {
  input: FisherEquationInput;
  errors: FisherEquationFieldErrors;
  result: FisherEquationResult | null;
  onChange: (input: FisherEquationInput) => void;
}

const MODES: { id: FisherEquationMode; label: string }[] = [
  { id: 'real', label: 'Calculate real interest rate' },
  { id: 'nominal', label: 'Calculate nominal interest rate' },
  { id: 'inflation', label: 'Calculate expected inflation' },
];

export function FisherEquationForm({
  input,
  errors,
  result,
  onChange,
}: FisherEquationFormProps) {
  const set = (patch: Partial<FisherEquationInput>) =>
    onChange({ ...input, ...patch });

  const nominalEditable = input.mode !== 'nominal';
  const realEditable = input.mode !== 'real';
  const inflationEditable = input.mode !== 'inflation';

  const strip = (s: string | undefined) => (s ?? '').replace(/%$/, '');

  const nominalDisplay = nominalEditable
    ? input.nominalRate
    : strip(result?.formattedNominal);
  const realDisplay = realEditable
    ? input.realRate
    : strip(result?.formattedReal);
  const inflationDisplay = inflationEditable
    ? input.expectedInflation
    : strip(result?.formattedInflation);
  const approxDisplay =
    input.mode === 'real'
      ? strip(result?.formattedApproximate)
      : input.mode === 'nominal'
        ? strip(result?.formattedApproximate)
        : strip(result?.formattedApproximate);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Exact equation (1+i)=(1+r)(1+πᵉ) is the default. The approximated
        output uses i≈r+πᵉ and is labeled separately. Related:{' '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect Calculator
        </Link>
        .
      </p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Calculation mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={input.mode === m.id}
            onClick={() => set({ mode: m.id })}
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

      {result?.activeEquation ? (
        <p className="font-mono text-xs text-accent">{result.activeEquation}</p>
      ) : null}

      <div>
        <label htmlFor="fq-nominal" className={labelClass}>
          Nominal interest rate
          <InfoTooltip
            label="Nominal interest rate"
            text="The stated interest rate before adjusting for inflation."
          />
        </label>
        <FieldShell error={errors.nominalRate} muted={!nominalEditable}>
          <input
            id="fq-nominal"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!nominalEditable ? 'cursor-default font-semibold' : ''}`}
            value={nominalDisplay}
            readOnly={!nominalEditable}
            tabIndex={nominalEditable ? 0 : -1}
            onChange={(e) => set({ nominalRate: e.target.value })}
            placeholder="8"
            aria-readonly={!nominalEditable}
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
        <label htmlFor="fq-inflation" className={labelClass}>
          Expected inflation rate
          <InfoTooltip
            label="Expected inflation rate"
            text="Expected percentage change in the price level over the same period. Negative values represent expected deflation."
          />
        </label>
        <FieldShell error={errors.expectedInflation} muted={!inflationEditable}>
          <input
            id="fq-inflation"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!inflationEditable ? 'cursor-default font-semibold' : ''}`}
            value={inflationDisplay}
            readOnly={!inflationEditable}
            tabIndex={inflationEditable ? 0 : -1}
            onChange={(e) => set({ expectedInflation: e.target.value })}
            placeholder="3"
            aria-readonly={!inflationEditable}
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
        <label htmlFor="fq-real" className={labelClass}>
          Real interest rate
          <InfoTooltip
            label="Real interest rate"
            text="The exact inflation-adjusted interest rate derived from the Fisher equation."
          />
        </label>
        <FieldShell error={errors.realRate} muted={!realEditable}>
          <input
            id="fq-real"
            type="text"
            inputMode="decimal"
            className={`${inputClass} ${!realEditable ? 'cursor-default font-semibold' : ''}`}
            value={realDisplay}
            readOnly={!realEditable}
            tabIndex={realEditable ? 0 : -1}
            onChange={(e) => set({ realRate: e.target.value })}
            placeholder="—"
            aria-readonly={!realEditable}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.realRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.realRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fq-approx" className={labelClass}>
          Approximated{' '}
          {input.mode === 'nominal'
            ? 'nominal'
            : input.mode === 'inflation'
              ? 'expected inflation'
              : 'real'}{' '}
          interest rate
          <InfoTooltip
            label="Approximated rate"
            text="Approximate Fisher result: r≈i−πᵉ, i≈r+πᵉ, or πᵉ≈i−r. Not the exact equation."
          />
        </label>
        <FieldShell muted>
          <input
            id="fq-approx"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={approxDisplay}
            placeholder="—"
            aria-readonly="true"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
      </div>
    </form>
  );
}
