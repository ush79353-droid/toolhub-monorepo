'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MONEY_MAGNITUDE_OPTIONS,
  RESERVE_RATIO_MODE_OPTIONS,
  type ReserveRatioFieldErrors,
  type ReserveRatioInput,
  type ReserveRatioMode,
  type ReserveRatioResult,
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

interface ReserveRatioFormProps {
  input: ReserveRatioInput;
  errors: ReserveRatioFieldErrors;
  result: ReserveRatioResult | null;
  onChange: (input: ReserveRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function ReserveRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: ReserveRatioFormProps) {
  const [showAdvancedNote, setShowAdvancedNote] = useState(false);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ReserveRatioInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (mode: ReserveRatioMode) => {
    if (mode === input.mode) return;
    onChange({ ...input, mode });
  };

  const depositsEditable = input.mode !== 'deposits';
  const reservesEditable =
    input.mode !== 'reserves' && input.mode !== 'required';
  const ratioEditable =
    input.mode === 'required' ||
    input.mode === 'deposits' ||
    input.mode === 'reserves' ||
    input.mode === 'ratio';
  const showRequiredReservesInput = input.mode === 'excess';
  const showRatioAsInput =
    input.mode === 'required' ||
    input.mode === 'deposits' ||
    input.mode === 'reserves';
  const showOptionalRequiredRatio = input.mode === 'ratio';

  const depositsDisplay = depositsEditable
    ? input.deposits
    : (result?.displayDeposits ?? '');
  const reservesDisplay = reservesEditable
    ? input.reserves
    : (result?.displayReserves ?? '');
  const ratioDisplay = showRatioAsInput
    ? input.requiredRatio
    : (result?.displayRatio ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Reserve ratio = (Reserves / Deposits) × 100. Currency is denomination
 only; not live FX. Funds not held as reserves is a simplified
        balance-sheet illustration, not automatic lending capacity. Some
        jurisdictions (e.g. U.S. Fed since March 2020) set reserve requirement
        ratios to zero; other liquidity and capital rules still apply.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="rr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="rr-magnitude" className={labelClass}>
          Magnitude
        </label>
        <select
          id="rr-magnitude"
          className={`${selectClass} w-full sm:w-auto`}
          value={input.magnitude}
          onChange={(e) =>
            set({
              magnitude: e.target.value as ReserveRatioInput['magnitude'],
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

      <div>
        <span className={labelClass}>Calculate</span>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Calculation mode"
        >
          {RESERVE_RATIO_MODE_OPTIONS.map((m) => (
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
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (1,000 million / 100 million → 10%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {(input.mode === 'ratio' ||
        input.mode === 'required' ||
        input.mode === 'reserves') && (
        <div>
          <label htmlFor="rr-deposits" className={labelClass}>
            Total Deposits
            <InfoTooltip content="Total deposits represent the deposit base used to calculate the reserve ratio." />
          </label>
          <FieldShell error={errors.deposits} muted={!depositsEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rr-deposits"
              className={inputClass}
              inputMode="decimal"
              readOnly={!depositsEditable}
              aria-readonly={!depositsEditable}
              value={depositsDisplay}
              onChange={(e) => set({ deposits: e.target.value })}
              placeholder="1,000"
            />
          </FieldShell>
          {errors.deposits ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.deposits}
            </p>
          ) : null}
        </div>
      )}

      {(input.mode === 'ratio' ||
        input.mode === 'excess' ||
        input.mode === 'deposits') && (
        <div>
          <label htmlFor="rr-reserves" className={labelClass}>
            {input.mode === 'excess' ? 'Actual (Total) Reserves' : 'Total Reserves'}
            <InfoTooltip content="Total reserves are the reserve assets held by a bank, such as eligible central-bank balances and vault cash, according to the applicable regulatory definition." />
          </label>
          <FieldShell error={errors.reserves} muted={!reservesEditable}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rr-reserves"
              className={inputClass}
              inputMode="decimal"
              readOnly={!reservesEditable}
              aria-readonly={!reservesEditable}
              value={reservesDisplay}
              onChange={(e) => set({ reserves: e.target.value })}
              placeholder="100"
            />
          </FieldShell>
          {errors.reserves ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.reserves}
            </p>
          ) : null}
        </div>
      )}

      {showRequiredReservesInput ? (
        <div>
          <label htmlFor="rr-req-reserves" className={labelClass}>
            Required Reserves
          </label>
          <FieldShell error={errors.requiredReserves}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rr-req-reserves"
              className={inputClass}
              inputMode="decimal"
              value={input.requiredReserves}
              onChange={(e) => set({ requiredReserves: e.target.value })}
              placeholder="100"
            />
          </FieldShell>
          {errors.requiredReserves ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.requiredReserves}
            </p>
          ) : null}
        </div>
      ) : null}

      {(showRatioAsInput || showOptionalRequiredRatio) && (
        <div>
          <label htmlFor="rr-ratio" className={labelClass}>
            {input.mode === 'ratio'
              ? 'Required Reserve Ratio (optional)'
              : input.mode === 'required'
                ? 'Required Reserve Ratio'
                : 'Reserve Ratio'}
            <InfoTooltip content="Enter a percentage. Required ratios are typically 0–100% in the simplified model. Actual reserves/deposits may exceed 100%." />
          </label>
          <FieldShell
            error={errors.requiredRatio}
            muted={input.mode === 'ratio' && !ratioEditable ? false : false}
          >
            <input
              id="rr-ratio"
              className={inputClass}
              inputMode="decimal"
              value={
                input.mode === 'ratio' ? input.requiredRatio : ratioDisplay
              }
              onChange={(e) => set({ requiredRatio: e.target.value })}
              placeholder="10"
              readOnly={false}
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.requiredRatio ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.requiredRatio}
            </p>
          ) : null}
        </div>
      )}

      {input.mode === 'ratio' ? (
        <div>
          <label htmlFor="rr-out-ratio" className={labelClass}>
            Reserve Ratio
          </label>
          <FieldShell muted>
            <input
              id="rr-out-ratio"
              className={inputClass}
              readOnly
              aria-readonly
              value={result?.formattedRatio ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      ) : null}

      {(input.mode === 'ratio' || input.mode === 'deposits') && (
        <div>
          <label htmlFor="rr-unreserved" className={labelClass}>
            Funds Not Held as Reserves
            <InfoTooltip content="Simplified L = D − R. Not necessarily legal or practical lending capacity." />
          </label>
          <FieldShell muted>
            <input
              id="rr-unreserved"
              className={inputClass}
              readOnly
              aria-readonly
              value={
                result
                  ? result.unreservedApplicable
                    ? result.formattedUnreserved
                    : 'Not applicable'
                  : ''
              }
              placeholder="—"
            />
          </FieldShell>
        </div>
      )}

      <div className="rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
          aria-expanded={showAdvancedNote}
          onClick={() => setShowAdvancedNote((v) => !v)}
        >
          Advanced reserve notes
          <span className="text-muted-foreground">
            {showAdvancedNote ? 'Hide' : 'Show'}
          </span>
        </button>
        {showAdvancedNote ? (
          <div className="space-y-2 border-t border-border px-3 py-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              Use the mode tabs for required reserves, excess/shortfall,
              deposits from ratio, or reserves from deposits. Optional required
              ratio in Reserve Ratio mode also shows surplus/shortfall and the
              simple money multiplier.
            </p>
            <p>
              Actual reserve ratio = actual reserves ÷ deposits. Required
              reserves = deposits × required ratio. Excess = actual − required
              (negative values are shown as a shortfall, not “available”
              excess).
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
