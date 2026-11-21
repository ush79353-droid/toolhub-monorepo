'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MONEY_MAGNITUDE_OPTIONS,
  type ImpactSolve,
  type PropensitySource,
  type SpendingMultiplierFieldErrors,
  type SpendingMultiplierInput,
  type SpendingMultiplierResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-xs text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOURCE_OPTIONS: { id: PropensitySource; label: string }[] = [
  { id: 'mpc', label: 'From MPC' },
  { id: 'mps', label: 'From MPS' },
  { id: 'multiplier', label: 'From Multiplier' },
];

const IMPACT_OPTIONS: { id: ImpactSolve; label: string }[] = [
  { id: 'output', label: 'Output change (ΔY)' },
  { id: 'required', label: 'Required spending (ΔA)' },
];

interface SpendingMultiplierFormProps {
  input: SpendingMultiplierInput;
  errors: SpendingMultiplierFieldErrors;
  result: SpendingMultiplierResult | null;
  onChange: (input: SpendingMultiplierInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function SpendingMultiplierForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: SpendingMultiplierFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SpendingMultiplierInput>) =>
    onChange({ ...input, ...patch });

  const mpcEditable = input.propensitySource === 'mpc';
  const mpsEditable = input.propensitySource === 'mps';
  const kEditable = input.propensitySource === 'multiplier';
  const aEditable = input.impactSolve === 'output';
  const yEditable = input.impactSolve === 'required';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        k = 1/(1−MPC) = 1/MPS. Currency is denomination only — not live FX.
        Theoretical ΔY = k×ΔA under simplified Keynesian assumptions; not a
        guaranteed real-world GDP forecast.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="sm-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="sm-magnitude" className={labelClass}>
          Magnitude
        </label>
        <select
          id="sm-magnitude"
          className={`${selectClass} w-full sm:w-auto`}
          value={input.magnitude}
          onChange={(e) =>
            set({
              magnitude: e.target
                .value as SpendingMultiplierInput['magnitude'],
            })
          }
        >
          {MONEY_MAGNITUDE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (MPC 0.6 → k 2.5× · ΔA $1,000,000)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">
          Spending Multiplier
        </h3>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Propensity source"
        >
          {SOURCE_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={input.propensitySource === m.id}
              onClick={() => set({ propensitySource: m.id })}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                input.propensitySource === m.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="sm-mpc" className={labelClass}>
            Marginal Propensity to Consume (MPC)
            <InfoTooltip content="MPC measures the fraction of an additional unit of disposable income that households spend on consumption." />
          </label>
          <FieldShell error={errors.mpc} muted={!mpcEditable}>
            <input
              id="sm-mpc"
              className={inputClass}
              inputMode="decimal"
              readOnly={!mpcEditable}
              aria-readonly={!mpcEditable}
              value={mpcEditable ? input.mpc : (result?.displayMpc ?? '')}
              onChange={(e) => set({ mpc: e.target.value })}
              placeholder="0.6"
            />
          </FieldShell>
          {errors.mpc ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.mpc}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sm-mps" className={labelClass}>
            Marginal Propensity to Save (MPS)
            <InfoTooltip content="MPS measures the fraction of an additional unit of disposable income that households save. MPS = 1 − MPC." />
          </label>
          <FieldShell error={errors.mps} muted={!mpsEditable}>
            <input
              id="sm-mps"
              className={inputClass}
              inputMode="decimal"
              readOnly={!mpsEditable}
              aria-readonly={!mpsEditable}
              value={mpsEditable ? input.mps : (result?.displayMps ?? '')}
              onChange={(e) => set({ mps: e.target.value })}
              placeholder="0.4"
            />
          </FieldShell>
          {errors.mps ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.mps}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sm-k" className={labelClass}>
            Spending Multiplier
          </label>
          <FieldShell error={errors.multiplier} muted={!kEditable}>
            <input
              id="sm-k"
              className={inputClass}
              inputMode="decimal"
              readOnly={!kEditable}
              aria-readonly={!kEditable}
              value={
                kEditable
                  ? input.multiplier
                  : result?.multiplierUndefined
                    ? 'Undefined'
                    : (result?.displayMultiplier ?? '')
              }
              onChange={(e) => set({ multiplier: e.target.value })}
              placeholder="2.5"
            />
            <span className="pr-3 text-xs text-muted-foreground">×</span>
          </FieldShell>
          {errors.multiplier ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.multiplier}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <h3 className="text-sm font-semibold text-accent">
          Multiplier Impact on the Economy
        </h3>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Impact solve"
        >
          {IMPACT_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={input.impactSolve === m.id}
              onClick={() => set({ impactSolve: m.id })}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                input.impactSolve === m.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="sm-da" className={labelClass}>
            Change in Autonomous Spending
            <InfoTooltip content="An autonomous spending change is an initial increase or decrease in spending that is not directly caused by a change in current income." />
          </label>
          <FieldShell error={errors.autonomousSpending} muted={!aEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="sm-da"
              className={inputClass}
              inputMode="decimal"
              readOnly={!aEditable}
              aria-readonly={!aEditable}
              value={
                aEditable
                  ? input.autonomousSpending
                  : (result?.displayRequired ?? result?.displayAutonomous ?? '')
              }
              onChange={(e) => set({ autonomousSpending: e.target.value })}
              placeholder="1,000,000"
            />
          </FieldShell>
          {errors.autonomousSpending ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.autonomousSpending}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sm-dy" className={labelClass}>
            Change in Aggregate Output (ΔY)
          </label>
          <FieldShell error={errors.targetOutputChange} muted={!yEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="sm-dy"
              className={inputClass}
              inputMode="decimal"
              readOnly={!yEditable}
              aria-readonly={!yEditable}
              value={
                yEditable
                  ? input.targetOutputChange
                  : (result?.displayOutput ?? '')
              }
              onChange={(e) => set({ targetOutputChange: e.target.value })}
              placeholder="2,500,000"
            />
          </FieldShell>
          {errors.targetOutputChange ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.targetOutputChange}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sm-obs" className={labelClass}>
            Observed GDP Change (optional)
          </label>
          <FieldShell error={errors.observedGdpChange}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="sm-obs"
              className={inputClass}
              inputMode="decimal"
              value={input.observedGdpChange}
              onChange={(e) => set({ observedGdpChange: e.target.value })}
              placeholder="2,000,000"
            />
          </FieldShell>
          {errors.observedGdpChange ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.observedGdpChange}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sm-rounds" className={labelClass}>
            Spending rounds to show (0–25)
          </label>
          <FieldShell error={errors.roundsToShow}>
            <input
              id="sm-rounds"
              className={inputClass}
              inputMode="numeric"
              value={input.roundsToShow}
              onChange={(e) => set({ roundsToShow: e.target.value })}
              placeholder="5"
            />
          </FieldShell>
          {errors.roundsToShow ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.roundsToShow}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
