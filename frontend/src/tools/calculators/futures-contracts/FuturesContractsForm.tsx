'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  FUTURES_CONTRACT_OPTIONS,
  type FuturesContractId,
  type FuturesContractsFieldErrors,
  type FuturesContractsInput,
  type FuturesContractsResult,
  type TradingDirection,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface FuturesContractsFormProps {
  input: FuturesContractsInput;
  errors: FuturesContractsFieldErrors;
  result: FuturesContractsResult | null;
  onChange: (input: FuturesContractsInput) => void;
  onMoneyCurrencyChange: (
    field: 'tickValue' | 'pointValue' | 'profitLoss',
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function FuturesContractsForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: FuturesContractsFormProps) {
  const set = (patch: Partial<FuturesContractsInput>) => {
    onChange({ ...input, ...patch });
  };

  const handleContractChange = (id: FuturesContractId) => {
    const preset = FUTURES_CONTRACT_OPTIONS.find((o) => o.id === id);
    set({
      futuresContract: id,
      ticksPerPoint: String(preset?.ticksPerPoint ?? input.ticksPerPoint),
    });
  };

  const plLabel =
    input.tradingDirection === 'long'
      ? 'Profit / loss for a long position'
      : 'Profit / loss for a short position';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">Trade parameters</p>

        <fieldset>
          <legend className={labelClass}>Which way are you trading?</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['long', 'Long position'],
                ['short', 'Short position'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fc-direction"
                  className="h-4 w-4 accent-primary"
                  checked={input.tradingDirection === value}
                  onChange={() =>
                    set({ tradingDirection: value as TradingDirection })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="fc-contract">
            <span>Select your futures contract</span>
            <InfoTooltip
              label="Futures contract"
              text="Sets the default ticks per point from the shared CME-style catalog (ES, MES, NQ, YM, CL, GC, or custom)."
            />
          </label>
          <select
            id="fc-contract"
            className={selectClass}
            value={input.futuresContract}
            onChange={(e) =>
              handleContractChange(e.target.value as FuturesContractId)
            }
          >
            {FUTURES_CONTRACT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-tick">
            <span>Tick value</span>
            <InfoTooltip
              label="Tick value"
              text="Money value of one minimum price tick in the selected currency. Point value = tick × ticks per point."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.tickValue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.tickValueCurrency)}
              </span>
              <input
                id="fc-tick"
                className={inputClass}
                inputMode="decimal"
                value={input.tickValue}
                aria-invalid={Boolean(errors.tickValue)}
                onChange={(e) => set({ tickValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fc-tick-currency"
                value={input.tickValueCurrency}
                onChange={(next) => onMoneyCurrencyChange('tickValue', next)}
                aria-label="Tick value currency"
              />
            </div>
          </div>
          {errors.tickValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tickValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-ticks-per-point">
            <span>Number of ticks per point</span>
            <InfoTooltip
              label="Ticks per point"
              text="How many minimum ticks make one full point for this contract (for example 4 for ES/MES)."
            />
          </label>
          <FieldShell error={errors.ticksPerPoint}>
            <input
              id="fc-ticks-per-point"
              className={inputClass}
              inputMode="decimal"
              value={input.ticksPerPoint}
              aria-invalid={Boolean(errors.ticksPerPoint)}
              onChange={(e) => set({ ticksPerPoint: e.target.value })}
            />
          </FieldShell>
          {errors.ticksPerPoint ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ticksPerPoint}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-point-value">
            <span>Point value</span>
            <InfoTooltip
              label="Point value"
              text="Calculated as tick value × ticks per point, then converted into this display currency when rates are available."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.pointValueCurrency)}
              </span>
              <input
                id="fc-point-value"
                className={inputClass}
                readOnly
                value={
                  result
                    ? moneyAmountToInputString(result.pointValueDisplayed)
                    : ''
                }
                aria-readonly="true"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fc-point-currency"
                value={input.pointValueCurrency}
                onChange={(next) => onMoneyCurrencyChange('pointValue', next)}
                aria-label="Point value currency"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">
          Trade profit / loss
        </p>

        <div>
          <label className={labelClass} htmlFor="fc-buy">
            <span>Add your buying contract price</span>
            <InfoTooltip
              label="Buying contract price"
              text="Entry (long) or cover (short) price quoted in contract points."
            />
          </label>
          <FieldShell error={errors.buyingPrice}>
            <input
              id="fc-buy"
              className={inputClass}
              inputMode="decimal"
              value={input.buyingPrice}
              aria-invalid={Boolean(errors.buyingPrice)}
              onChange={(e) => set({ buyingPrice: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              points
            </span>
          </FieldShell>
          {errors.buyingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buyingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-sell">
            <span>Add your selling contract price</span>
            <InfoTooltip
              label="Selling contract price"
              text="Exit (long) or entry (short) price quoted in contract points."
            />
          </label>
          <FieldShell error={errors.sellingPrice}>
            <input
              id="fc-sell"
              className={inputClass}
              inputMode="decimal"
              value={input.sellingPrice}
              aria-invalid={Boolean(errors.sellingPrice)}
              onChange={(e) => set({ sellingPrice: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              points
            </span>
          </FieldShell>
          {errors.sellingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sellingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-points">
            <span>Number of points</span>
            <InfoTooltip
              label="Number of points"
              text="Sell price minus buy price. Long profits when this is positive; short profits when it is negative."
            />
          </label>
          <FieldShell muted>
            <input
              id="fc-points"
              className={inputClass}
              readOnly
              value={result?.formattedNumberOfPoints ?? ''}
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-contracts">
            <span>Number of futures contracts</span>
            <InfoTooltip
              label="Number of futures contracts"
              text="Whole contracts only. Scales P/L linearly."
            />
          </label>
          <FieldShell error={errors.numberOfContracts}>
            <input
              id="fc-contracts"
              className={inputClass}
              inputMode="numeric"
              value={input.numberOfContracts}
              aria-invalid={Boolean(errors.numberOfContracts)}
              onChange={(e) => set({ numberOfContracts: e.target.value })}
            />
          </FieldShell>
          {errors.numberOfContracts ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.numberOfContracts}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fc-pl">
            <span>{plLabel}</span>
            <InfoTooltip
              label="Profit / loss"
              text="Long: points × point value × contracts. Short: the negative of that amount. Display currency converts from the tick currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.profitLossCurrency)}
              </span>
              <input
                id="fc-pl"
                className={inputClass}
                readOnly
                value={
                  result
                    ? moneyAmountToInputString(result.profitLossDisplayed)
                    : ''
                }
                aria-readonly="true"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fc-pl-currency"
                value={input.profitLossCurrency}
                onChange={(next) => onMoneyCurrencyChange('profitLoss', next)}
                aria-label="Profit or loss currency"
              />
            </div>
          </div>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.interpretation}
            </p>
          ) : null}
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
