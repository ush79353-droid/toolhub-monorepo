'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GiniFieldErrors,
  GiniInput,
  GiniMode,
  GiniResult,
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

const MODES: { id: GiniMode; label: string }[] = [
  { id: 'areas', label: 'Areas A & B' },
  { id: 'incomes', label: 'Income distribution' },
];

interface GiniFormProps {
  input: GiniInput;
  errors: GiniFieldErrors;
  result: GiniResult | null;
  onChange: (input: GiniInput) => void;
  onLoadExample: () => void;
  onLoadIncomeExample: () => void;
}

export function GiniForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onLoadIncomeExample,
}: GiniFormProps) {
  const set = (patch: Partial<GiniInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Gini coefficient G = A / (A + B). Area A is between the equality line
        and Lorenz curve; Area B is below the Lorenz curve. Gini index = G ×
 100. Distinguishes dispersion from prosperity; income ≠ wealth
        inequality.
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

      <div className="flex flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load area example (1200 / 3800 → 0.24)
        </button>
        <button
          type="button"
          onClick={onLoadIncomeExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load income example
        </button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.mode === 'areas' ? (
        <>
          <div>
            <label htmlFor="gini-a" className={labelClass}>
              Area A
              <InfoTooltip
                label="Area A"
                text="Area A is the region between the line of perfect equality and the Lorenz curve."
              />
            </label>
            <FieldShell error={errors.areaA}>
              <input
                id="gini-a"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.areaA}
                onChange={(e) => set({ areaA: e.target.value })}
                placeholder="1200"
              />
              <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                unit²
              </span>
            </FieldShell>
            {errors.areaA ? (
              <p className="mt-1 text-xs text-rose-600">{errors.areaA}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="gini-b" className={labelClass}>
              Area B
              <InfoTooltip
                label="Area B"
                text="Area B is the region below the Lorenz curve, within the region bounded by the cumulative population and cumulative income axes."
              />
            </label>
            <FieldShell error={errors.areaB}>
              <input
                id="gini-b"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.areaB}
                onChange={(e) => set({ areaB: e.target.value })}
                placeholder="3800"
              />
              <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                unit²
              </span>
            </FieldShell>
            {errors.areaB ? (
              <p className="mt-1 text-xs text-rose-600">{errors.areaB}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="gini-g" className={labelClass}>
              Gini Coefficient
            </label>
            <FieldShell muted>
              <input
                id="gini-g"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={result?.formattedGini ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="gini-incomes" className={labelClass}>
            Incomes (comma or space separated)
            <InfoTooltip
              label="Incomes"
              text="Enter nonnegative individual income observations. Values are sorted ascending. Unweighted individual mode; not frequency-weighted grouped data."
            />
          </label>
          <textarea
            id="gini-incomes"
            rows={4}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.incomesText}
            onChange={(e) => set({ incomesText: e.target.value })}
            placeholder="10000, 20000, 30000, 40000, 100000"
          />
          {errors.incomesText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.incomesText}</p>
          ) : null}
        </div>
      )}
    </form>
  );
}
