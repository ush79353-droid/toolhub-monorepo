'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PutCallParityFieldErrors,
  PutCallParityInput,
  PutCallParityResult,
  PvTimeUnit,
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

interface PutCallParityFormProps {
  input: PutCallParityInput;
  errors: PutCallParityFieldErrors;
  result: PutCallParityResult | null;
  onChange: (input: PutCallParityInput) => void;
  onMoneyCurrencyChange: (
    field: 'call' | 'put' | 'pvStrike' | 'spot' | 'helperStrike',
    next: SupportedCurrency,
  ) => void;
  onApplyPvHelper: () => void;
  onLoadExample: () => void;
}

export function PutCallParityForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  onApplyPvHelper,
  onLoadExample,
}: PutCallParityFormProps) {
  const set = (patch: Partial<PutCallParityInput>) =>
    onChange({ ...input, ...patch });

  const callDisplay =
    result?.solveTarget === 'call'
      ? result.solvedAmount.toLocaleString('en-US', {
          maximumFractionDigits: 8,
          useGrouping: false,
        })
      : input.callPrice;
  const putDisplay =
    result?.solveTarget === 'put'
      ? result.solvedAmount.toLocaleString('en-US', {
          maximumFractionDigits: 8,
          useGrouping: false,
        })
      : input.putPrice;
  const pvDisplay =
    result?.solveTarget === 'pvStrike'
      ? result.solvedAmount.toLocaleString('en-US', {
          maximumFractionDigits: 8,
          useGrouping: false,
        })
      : input.pvStrike;
  const spotDisplay =
    result?.solveTarget === 'spot'
      ? result.solvedAmount.toLocaleString('en-US', {
          maximumFractionDigits: 8,
          useGrouping: false,
        })
      : input.spotPrice;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        This calculator will calculate the 4th value after you{' '}
        <strong className="font-semibold text-accent">
          enter 3 out of 4 values
        </strong>
        . Parity: C + PV(K) = P + S. Each money field has an independent
        currency (default PKR).
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (C=10 · PV(K)=95 · S=100 → P=5)
      </button>

      <MoneyRow
        id="pcp-call"
        label="European call option price"
        tooltip="Premium of the European call. Leave blank to solve for the call."
        value={callDisplay}
        currency={input.callCurrency}
        error={errors.callPrice}
        readOnly={result?.solveTarget === 'call'}
        onAmountChange={(v) => set({ callPrice: v })}
        onCurrencyChange={(c) => onMoneyCurrencyChange('call', c)}
      />

      <MoneyRow
        id="pcp-put"
        label="European put option price"
        tooltip="Premium of the European put. Leave blank to solve for the put."
        value={putDisplay}
        currency={input.putCurrency}
        error={errors.putPrice}
        readOnly={result?.solveTarget === 'put'}
        onAmountChange={(v) => set({ putPrice: v })}
        onCurrencyChange={(c) => onMoneyCurrencyChange('put', c)}
      />

      <MoneyRow
        id="pcp-pv"
        label="Present value of strike price"
        tooltip="Discounted strike PV(K). Use the helper below to compute K·e^(−rT), or leave blank to solve for PV(K)."
        value={pvDisplay}
        currency={input.pvStrikeCurrency}
        error={errors.pvStrike}
        readOnly={result?.solveTarget === 'pvStrike'}
        onAmountChange={(v) => set({ pvStrike: v })}
        onCurrencyChange={(c) => onMoneyCurrencyChange('pvStrike', c)}
      />

      <MoneyRow
        id="pcp-spot"
        label="Spot price of the underlying asset"
        tooltip="Current price of the underlying. Leave blank to solve for spot."
        value={spotDisplay}
        currency={input.spotCurrency}
        error={errors.spotPrice}
        readOnly={result?.solveTarget === 'spot'}
        onAmountChange={(v) => set({ spotPrice: v })}
        onCurrencyChange={(c) => onMoneyCurrencyChange('spot', c)}
      />

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <legend className="sr-only">
          Calculate present value of strike price
        </legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-primary sm:px-4"
          aria-expanded={input.pvHelperOpen}
          onClick={() => set({ pvHelperOpen: !input.pvHelperOpen })}
        >
          <span>Calculate present value of strike price</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              input.pvHelperOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {input.pvHelperOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              PV(K) = K × e^(−rT) with continuous compounding. Applies into the
              PV(K) field above (converted to that field&apos;s currency).
            </p>
            <MoneyRow
              id="pcp-helper-k"
              label="Strike price (K)"
              tooltip="Undiscounted strike used only in the PV helper."
              value={input.helperStrike}
              currency={input.helperStrikeCurrency}
              error={errors.helperStrike}
              onAmountChange={(v) => set({ helperStrike: v })}
              onCurrencyChange={(c) => onMoneyCurrencyChange('helperStrike', c)}
            />
            <div>
              <label htmlFor="pcp-helper-r" className={labelClass}>
                Risk-free rate
                <InfoTooltip
                  label="Risk-free rate"
                  text="Continuously compounded annual risk-free rate as a percent (5 means 5%)."
                />
              </label>
              <FieldShell error={errors.helperRatePercent}>
                <input
                  id="pcp-helper-r"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.helperRatePercent}
                  onChange={(e) => set({ helperRatePercent: e.target.value })}
                  placeholder="5"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.helperRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.helperRatePercent}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="pcp-helper-t" className={labelClass}>
                Time to expiration
              </label>
              <FieldShell error={errors.helperTime}>
                <input
                  id="pcp-helper-t"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.helperTime}
                  onChange={(e) => set({ helperTime: e.target.value })}
                  placeholder="1"
                />
                <select
                  className={unitSelectClass}
                  aria-label="Time unit"
                  value={input.helperTimeUnit}
                  onChange={(e) =>
                    set({
                      helperTimeUnit: e.target.value as PvTimeUnit,
                    })
                  }
                >
                  <option value="years">yrs</option>
                  <option value="months">mo</option>
                </select>
              </FieldShell>
              {errors.helperTime ? (
                <p className="mt-1 text-xs text-rose-600">{errors.helperTime}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onApplyPvHelper}
              className="h-10 w-full rounded-xl border border-border bg-white text-xs font-semibold text-accent hover:bg-muted/30"
            >
              Apply PV(K) to field above
            </button>
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
