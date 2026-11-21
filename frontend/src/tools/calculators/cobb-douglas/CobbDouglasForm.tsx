'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CobbDouglasFieldErrors,
  CobbDouglasInput,
  CobbDouglasResult,
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

interface CobbDouglasFormProps {
  input: CobbDouglasInput;
  errors: CobbDouglasFieldErrors;
  result: CobbDouglasResult | null;
  onChange: (input: CobbDouglasInput) => void;
  onLoadExample: () => void;
}

export function CobbDouglasForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: CobbDouglasFormProps) {
  const set = (patch: Partial<CobbDouglasInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Y = A × L<sup>α</sup> × K<sup>β</sup>. Output is in model units (not
        currency). Measure labor and capital consistently.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load worked example
        </button>
        {' · '}
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is Cobb-Douglas?
        </a>
      </p>

      <div>
        <label htmlFor="cd-a" className={labelClass}>
          Total Factor Productivity (A)
          <InfoTooltip
            label="Total Factor Productivity"
            text="Total factor productivity measures the efficiency of production technology and organization. It determines how effectively labor and capital are transformed into output."
          />
        </label>
        <FieldShell error={errors.totalFactorProductivity}>
          <input
            id="cd-a"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.totalFactorProductivity}
            onChange={(e) => set({ totalFactorProductivity: e.target.value })}
            placeholder="1"
            aria-invalid={Boolean(errors.totalFactorProductivity)}
          />
        </FieldShell>
        {errors.totalFactorProductivity ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.totalFactorProductivity}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cd-labor" className={labelClass}>
          Labor (L)
          <InfoTooltip
            label="Labor"
            text="Labor represents the quantity of work used in production, such as employees, labor hours, or another consistently measured labor input."
          />
        </label>
        <FieldShell error={errors.labor}>
          <input
            id="cd-labor"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.labor}
            onChange={(e) => set({ labor: e.target.value })}
            placeholder="100"
            aria-invalid={Boolean(errors.labor)}
          />
        </FieldShell>
        {errors.labor ? (
          <p className="mt-1 text-xs text-rose-600">{errors.labor}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Use a consistent labor unit (workers, hours, etc.).
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cd-alpha" className={labelClass}>
          Output Elasticity of Labor (α)
          <InfoTooltip
            label="Output Elasticity of Labor"
            text="Output elasticity of labor measures the percentage change in total output resulting from a 1% increase in labor, holding capital and productivity constant."
          />
        </label>
        <FieldShell error={errors.laborElasticity}>
          <input
            id="cd-alpha"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.laborElasticity}
            onChange={(e) => set({ laborElasticity: e.target.value })}
            placeholder="0.6"
            aria-invalid={Boolean(errors.laborElasticity)}
          />
        </FieldShell>
        {errors.laborElasticity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.laborElasticity}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cd-capital" className={labelClass}>
          Capital (K)
          <InfoTooltip
            label="Capital"
            text="Capital represents the productive assets used in production, including machinery, equipment, facilities, and other capital resources."
          />
        </label>
        <FieldShell error={errors.capital}>
          <input
            id="cd-capital"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.capital}
            onChange={(e) => set({ capital: e.target.value })}
            placeholder="50"
            aria-invalid={Boolean(errors.capital)}
          />
        </FieldShell>
        {errors.capital ? (
          <p className="mt-1 text-xs text-rose-600">{errors.capital}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cd-beta" className={labelClass}>
          Output Elasticity of Capital (β)
          <InfoTooltip
            label="Output Elasticity of Capital"
            text="Output elasticity of capital measures the percentage change in total production resulting from a 1% increase in capital, holding labor and productivity constant."
          />
        </label>
        <FieldShell error={errors.capitalElasticity}>
          <input
            id="cd-beta"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.capitalElasticity}
            onChange={(e) => set({ capitalElasticity: e.target.value })}
            placeholder="0.4"
            aria-invalid={Boolean(errors.capitalElasticity)}
          />
        </FieldShell>
        {errors.capitalElasticity ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.capitalElasticity}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cd-y" className={labelClass}>
          Total Production (Y)
          <InfoTooltip
            label="Total Production"
            text="Estimated total output based on labor, capital, productivity, and output elasticity parameters."
          />
        </label>
        <FieldShell muted>
          <input
            id="cd-y"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={
              result != null ? `${result.formattedTotalProduction} units` : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
