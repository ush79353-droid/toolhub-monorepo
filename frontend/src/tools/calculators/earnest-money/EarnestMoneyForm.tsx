'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EarnestMoneyFieldErrors,
  EarnestMoneyInput,
  EarnestMoneyMode,
  EarnestMoneyResult,
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

interface EarnestMoneyFormProps {
  input: EarnestMoneyInput;
  errors: EarnestMoneyFieldErrors;
  result: EarnestMoneyResult | null;
  onChange: (input: EarnestMoneyInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EarnestMoneyForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EarnestMoneyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const priceReadOnly = input.mode === 'propertyPrice';
  const pctReadOnly = input.mode === 'percentage';
  const amountReadOnly = input.mode === 'deposit';

  const set = (patch: Partial<EarnestMoneyInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMode = (mode: EarnestMoneyMode) => {
    if (mode === input.mode) return;
    set({ mode });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
 changes the symbol only; it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="em-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="em-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'deposit'}
              onChange={() => setMode('deposit')}
            />
            Earnest money needed
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="em-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'percentage'}
              onChange={() => setMode('percentage')}
            />
            Earnest money percentage
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="em-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'propertyPrice'}
              onChange={() => setMode('propertyPrice')}
            />
            Property price
          </label>
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="em-property-price">
          <span>Property price</span>
          <InfoTooltip
            label="Property price"
            text="Agreed or expected purchase price of the home or property."
          />
        </label>
        <FieldShell error={errors.propertyPrice} muted={priceReadOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="em-property-price"
            className={inputClass}
            inputMode="decimal"
            readOnly={priceReadOnly}
            tabIndex={priceReadOnly ? -1 : undefined}
            value={
              priceReadOnly
                ? (result?.formattedPropertyPrice ?? '')
                : input.propertyPrice
            }
            aria-invalid={Boolean(errors.propertyPrice)}
            aria-live={priceReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ propertyPrice: e.target.value })}
          />
        </FieldShell>
        {errors.propertyPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.propertyPrice}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="em-percentage">
          <span>Earnest money percentage</span>
          <InfoTooltip
            label="Earnest money percentage"
            text="Portion of the purchase price offered as the earnest money deposit."
          />
        </label>
        <FieldShell error={errors.earnestMoneyPercentage} muted={pctReadOnly}>
          <input
            id="em-percentage"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            readOnly={pctReadOnly}
            tabIndex={pctReadOnly ? -1 : undefined}
            value={
              pctReadOnly
                ? (result?.formattedEarnestMoneyPercentage ?? '')
                : input.earnestMoneyPercentage
            }
            aria-invalid={Boolean(errors.earnestMoneyPercentage)}
            aria-live={pctReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ earnestMoneyPercentage: e.target.value })}
          />
          <span
            className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %
          </span>
        </FieldShell>
        {errors.earnestMoneyPercentage ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.earnestMoneyPercentage}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="em-amount">
          <span>Earnest money needed</span>
          <InfoTooltip
            label="Earnest money"
            text="Deposit amount offered to show purchase intent. In deposit mode this is calculated; in other modes you enter it."
          />
        </label>
        <FieldShell error={errors.earnestMoneyAmount} muted={amountReadOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id="em-amount"
            className={inputClass}
            inputMode="decimal"
            readOnly={amountReadOnly}
            tabIndex={amountReadOnly ? -1 : undefined}
            value={
              amountReadOnly
                ? (result?.formattedEarnestMoneyAmount ?? '')
                : input.earnestMoneyAmount
            }
            aria-invalid={Boolean(errors.earnestMoneyAmount)}
            aria-live={amountReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ earnestMoneyAmount: e.target.value })}
          />
        </FieldShell>
        {errors.earnestMoneyAmount ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.earnestMoneyAmount}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
