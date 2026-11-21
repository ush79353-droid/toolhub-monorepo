'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BITCOIN_ETF_OPTIONS,
  type BitcoinEtfFieldErrors,
  type BitcoinEtfInput,
  type BitcoinEtfResult,
} from './types';

interface BitcoinEtfFormProps {
  input: BitcoinEtfInput;
  errors: BitcoinEtfFieldErrors;
  result: BitcoinEtfResult | null;
  onChange: (input: BitcoinEtfInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium text-accent focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function BitcoinEtfForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: BitcoinEtfFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BitcoinEtfInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
 Returns are estimates only; not guarantees. No live Bitcoin or ETF prices are used.
        Verified issuer expense ratios are not bundled yet; choose Custom and enter the ratio
        yourself.
      </p>

      <div>
        <FieldLabel
          htmlFor="btc-etf"
          label="Choose your ETF"
          tip="Select Custom to enter the expense ratio manually. Do not treat options as investment advice."
        />
        <select
          id="btc-etf"
          className={selectClass}
          value={input.etfId}
          aria-invalid={Boolean(errors.etfId)}
          onChange={(e) =>
            set({
              etfId: e.target.value as BitcoinEtfInput['etfId'],
            })
          }
        >
          <option value="">Select</option>
          {BITCOIN_ETF_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.etfId ? <p className="mt-1 text-xs text-rose-600">{errors.etfId}</p> : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="btc-investment"
          label="Investment amount"
          tip="Starting amount before upfront other costs. Changing currency converts fiat amounts using stored rates."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="btc-investment"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.investmentAmount}
              aria-invalid={Boolean(errors.investmentAmount)}
              onChange={(e) => set({ investmentAmount: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="btc-investment-currency"
              value={input.currency}
              onChange={onCurrencyChange}
            />
          </div>
        </div>
        {errors.investmentAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.investmentAmount}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="btc-duration"
          label="Duration"
          tip="Holding period in years. Fractional years are allowed."
        />
        <div className="relative">
          <input
            id="btc-duration"
            className={`${inputClass} pr-12`}
            inputMode="decimal"
            value={input.durationYears}
            aria-invalid={Boolean(errors.durationYears)}
            onChange={(e) => set({ durationYears: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            yrs
          </span>
        </div>
        {errors.durationYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationYears}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="btc-expense"
            label="Expense ratio"
            tip="Annual fund expense ratio as a percent of assets (0–100)."
          />
          <div className="relative">
            <input
              id="btc-expense"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.expenseRatio}
              aria-invalid={Boolean(errors.expenseRatio)}
              onChange={(e) => set({ expenseRatio: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.expenseRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.expenseRatio}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="btc-other-costs"
            label="Other costs"
            tip="Upfront costs subtracted before compounding (default 0.00)."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="btc-other-costs"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.otherCosts}
                aria-invalid={Boolean(errors.otherCosts)}
                onChange={(e) => set({ otherCosts: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="btc-other-costs-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Other costs currency"
              />
            </div>
          </div>
          {errors.otherCosts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.otherCosts}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="btc-expected"
            label="Expected return"
            tip="Assumed annual return before expense ratio (estimate, not a guarantee). Default 10%."
          />
          <div className="relative">
            <input
              id="btc-expected"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.expectedReturn}
              aria-invalid={Boolean(errors.expectedReturn)}
              onChange={(e) => set({ expectedReturn: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.expectedReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.expectedReturn}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="btc-effective"
            label="Effective return"
            tip="(1 + expected/100) × (1 − expense/100) − 1, shown as a percent."
          />
          <div className="relative">
            <input
              id="btc-effective"
              className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedEffectiveReturn : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel
          htmlFor="btc-fv"
          label="Future value of your investment"
          tip="(Investment − other costs) × (1 + effective return)^duration."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="btc-fv"
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedFutureValue : ''}
              aria-live="polite"
            />
          </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="btc-fv-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Future value currency"
              />
            </div>
        </div>
      </div>

      <div>
        <FieldLabel
          htmlFor="btc-total-cost"
          label="Total cost of ETF"
          tip="Upfront other costs plus estimated expense-ratio fees charged each year (not lost investment gains)."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="btc-total-cost"
              className={`${inputClass} bg-muted/10 pl-8 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedTotalCost : ''}
              aria-live="polite"
            />
          </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="btc-total-cost-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Total cost currency"
              />
            </div>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
