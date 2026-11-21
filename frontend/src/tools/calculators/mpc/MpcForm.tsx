'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MpcFieldErrors,
  MpcInput,
  MpcMode,
  MpcResult,
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

interface MpcFormProps {
  input: MpcInput;
  errors: MpcFieldErrors;
  result: MpcResult | null;
  onChange: (input: MpcInput) => void;
  onLoadExample: () => void;
}

export function MpcForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: MpcFormProps) {
  const set = (patch: Partial<MpcInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        MPC = ΔC / ΔYd · Consumer spending C = a + MPC × Yd. Currency labels
        denomination only. MPC is not clamped to 0–1; unusual values show a
        warning.
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="MPC calculation mode"
      >
        {(
          [
            ['from-changes', 'From ΔC and ΔYd'],
            ['direct-mpc', 'Enter MPC directly'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={input.mode === id}
            onClick={() => set({ mode: id as MpcMode })}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.mode === id
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mpc-currency"
          value={input.currency}
          onChange={(code: SupportedCurrency) => set({ currency: code })}
          aria-label="Money denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (ΔC $600 / ΔYd $1,000 → MPC 0.60 · C $42,000)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {input.mode === 'from-changes' ? (
        <>
          <div>
            <label htmlFor="mpc-dyd" className={labelClass}>
              Increase in Disposable Income (ΔYd)
              <InfoTooltip
                label="ΔYd"
                text="Change in disposable income between two observations. Negative values are decreases."
              />
            </label>
            <FieldShell error={errors.changeInDisposableIncome}>
              <input
                id="mpc-dyd"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.changeInDisposableIncome}
                onChange={(e) =>
                  set({ changeInDisposableIncome: e.target.value })
                }
                placeholder="1,000"
              />
            </FieldShell>
            {errors.changeInDisposableIncome ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.changeInDisposableIncome}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mpc-dc" className={labelClass}>
              Increase in Consumer Spending (ΔC)
              <InfoTooltip
                label="ΔC"
                text="Change in consumer spending between the same two observations."
              />
            </label>
            <FieldShell error={errors.changeInConsumption}>
              <input
                id="mpc-dc"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.changeInConsumption}
                onChange={(e) => set({ changeInConsumption: e.target.value })}
                placeholder="600"
              />
            </FieldShell>
            {errors.changeInConsumption ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.changeInConsumption}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="mpc-direct" className={labelClass}>
            Marginal Propensity to Consume (MPC)
            <InfoTooltip
              label="MPC"
              text="Enter MPC as a decimal (e.g. 0.6 for 60%). Not clamped to 0–1."
            />
          </label>
          <FieldShell error={errors.mpcDirect}>
            <input
              id="mpc-direct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.mpcDirect}
              onChange={(e) => set({ mpcDirect: e.target.value })}
              placeholder="0.6"
            />
          </FieldShell>
          {errors.mpcDirect ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mpcDirect}</p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor="mpc-out" className={labelClass}>
          Marginal Propensity to Consume (MPC)
        </label>
        <FieldShell muted>
          <input
            id="mpc-out"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={
              result
                ? `${result.formattedMpc} (${result.formattedMpcPercent})`
                : ''
            }
            placeholder="—"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="mpc-a" className={labelClass}>
          Autonomous Consumer Spending
          <InfoTooltip
            label="Autonomous consumption"
            text="Theoretical intercept when disposable income is zero in the linear consumption model — not literal household spending at zero income."
          />
        </label>
        <FieldShell error={errors.autonomousConsumption}>
          <input
            id="mpc-a"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.autonomousConsumption}
            onChange={(e) => set({ autonomousConsumption: e.target.value })}
            placeholder="18,000"
          />
        </FieldShell>
        {errors.autonomousConsumption ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.autonomousConsumption}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mpc-yd" className={labelClass}>
          Disposable Income
          <InfoTooltip
            label="Disposable income"
            text="Income available after applicable taxes and transfers in the modeled context."
          />
        </label>
        <FieldShell error={errors.disposableIncome}>
          <input
            id="mpc-yd"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.disposableIncome}
            onChange={(e) => set({ disposableIncome: e.target.value })}
            placeholder="40,000"
          />
        </FieldShell>
        {errors.disposableIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.disposableIncome}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mpc-c" className={labelClass}>
          Consumer Spending
        </label>
        <FieldShell muted>
          <input
            id="mpc-c"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedConsumerSpending ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>

      <label className="flex items-center gap-2 text-xs text-accent">
        <input
          type="checkbox"
          checked={input.showIncomeEqualsSpendingLine}
          onChange={(e) =>
            set({ showIncomeEqualsSpendingLine: e.target.checked })
          }
          className="h-4 w-4 rounded border-border"
        />
        Show 45° income-expenditure line (C = Yd)
      </label>
    </form>
  );
}
