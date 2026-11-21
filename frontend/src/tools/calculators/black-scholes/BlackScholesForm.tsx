'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BlackScholesFieldErrors,
  BlackScholesInput,
  BlackScholesResult,
  MaturityTimeUnit,
} from './types';
import { TIME_UNIT_LABELS } from './types';

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

interface MoneyRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

function MoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  readOnly = false,
  onAmountChange,
  onCurrencyChange,
}: MoneyRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-readonly={readOnly || undefined}
            onChange={
              readOnly || !onAmountChange
                ? undefined
                : (e) => onAmountChange(e.target.value)
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface BlackScholesFormProps {
  input: BlackScholesInput;
  errors: BlackScholesFieldErrors;
  result: BlackScholesResult | null;
  onChange: (input: BlackScholesInput) => void;
  onMoneyCurrencyChange: (
    field: 'stock' | 'strike' | 'call' | 'put',
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function BlackScholesForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: BlackScholesFormProps) {
  const set = (patch: Partial<BlackScholesInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">
          Stock option details
        </p>

        <MoneyRow
          id="bs-stock"
          label="Current stock price"
          tooltip="Underlying spot price S. Independent FX — the model runs in this currency after converting the strike."
          value={input.stockPrice}
          currency={input.stockCurrency}
          error={errors.stockPrice}
          onAmountChange={(value) => set({ stockPrice: value })}
          onCurrencyChange={(next) => onMoneyCurrencyChange('stock', next)}
        />

        <MoneyRow
          id="bs-strike"
          label="Strike price"
          tooltip="Option strike K. Converted into the stock currency before pricing when currencies differ."
          value={input.strikePrice}
          currency={input.strikeCurrency}
          error={errors.strikePrice}
          onAmountChange={(value) => set({ strikePrice: value })}
          onCurrencyChange={(next) => onMoneyCurrencyChange('strike', next)}
        />

        <div>
          <label className={labelClass} htmlFor="bs-time">
            <span>Time to maturity</span>
            <InfoTooltip
              label="Time to maturity"
              text="Converted to years for the model: months ÷ 12, days ÷ 365. Never FX-converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.timeToMaturity}>
              <input
                id="bs-time"
                className={inputClass}
                inputMode="decimal"
                value={input.timeToMaturity}
                aria-invalid={Boolean(errors.timeToMaturity)}
                onChange={(e) => set({ timeToMaturity: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="bs-time-unit"
                className={selectClass}
                value={input.timeUnit}
                aria-label="Time to maturity unit"
                onChange={(e) =>
                  set({ timeUnit: e.target.value as MaturityTimeUnit })
                }
              >
                {(Object.keys(TIME_UNIT_LABELS) as MaturityTimeUnit[]).map(
                  (unit) => (
                    <option key={unit} value={unit}>
                      {TIME_UNIT_LABELS[unit]}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
          {errors.timeToMaturity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeToMaturity}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bs-div">
            <span>Dividend yield</span>
            <InfoTooltip
              label="Dividend yield"
              text="Continuous dividend yield q as a percent (for example 2 means 2%). Enter 0 for non-dividend underlyings."
            />
          </label>
          <FieldShell error={errors.dividendYieldPercent}>
            <input
              id="bs-div"
              className={inputClass}
              inputMode="decimal"
              value={input.dividendYieldPercent}
              aria-invalid={Boolean(errors.dividendYieldPercent)}
              onChange={(e) => set({ dividendYieldPercent: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.dividendYieldPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.dividendYieldPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bs-vol">
            <span>Volatility</span>
            <InfoTooltip
              label="Volatility"
              text="Annualized volatility σ as a percent (20 means 20%). Zero volatility uses the discounted forward intrinsic."
            />
          </label>
          <FieldShell error={errors.volatilityPercent}>
            <input
              id="bs-vol"
              className={inputClass}
              inputMode="decimal"
              value={input.volatilityPercent}
              aria-invalid={Boolean(errors.volatilityPercent)}
              onChange={(e) => set({ volatilityPercent: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.volatilityPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.volatilityPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bs-rate">
            <span>Risk-free interest rate</span>
            <InfoTooltip
              label="Risk-free interest rate"
              text="Continuously compounded risk-free rate r as a percent (5 means 5%)."
            />
          </label>
          <FieldShell error={errors.riskFreeRatePercent}>
            <input
              id="bs-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.riskFreeRatePercent}
              aria-invalid={Boolean(errors.riskFreeRatePercent)}
              onChange={(e) => set({ riskFreeRatePercent: e.target.value })}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.riskFreeRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.riskFreeRatePercent}
            </p>
          ) : null}
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-[13px] font-semibold text-accent">Results</p>

        <MoneyRow
          id="bs-call"
          label="Call option price"
          tooltip="European call under Black–Scholes–Merton. Display currency is independent; the model amount converts from the stock currency."
          value={result ? moneyAmountToInputString(result.call) : ''}
          currency={input.callCurrency}
          readOnly
          onCurrencyChange={(next) => onMoneyCurrencyChange('call', next)}
        />

        <MoneyRow
          id="bs-put"
          label="Put option price"
          tooltip="European put under Black–Scholes–Merton. Display currency is independent."
          value={result ? moneyAmountToInputString(result.put) : ''}
          currency={input.putCurrency}
          readOnly
          onCurrencyChange={(next) => onMoneyCurrencyChange('put', next)}
        />

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.boundaryNote ?? result.formulaBreakdown}
          </p>
        ) : null}
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
