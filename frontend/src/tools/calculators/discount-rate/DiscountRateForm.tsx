'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CASH_FLOW_FREQUENCY_OPTIONS,
  COMPOUND_OPTIONS,
  type CashFlowFrequency,
  type CashFlowTiming,
  type CompoundFrequency,
  type DiscountRateFieldErrors,
  type DiscountRateInput,
  type DiscountRateResult,
  type TermUnit,
} from './types';

interface DiscountRateFormProps {
  input: DiscountRateInput;
  errors: DiscountRateFieldErrors;
  result: DiscountRateResult | null;
  onChange: (input: DiscountRateInput) => void;
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

export function DiscountRateForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: DiscountRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DiscountRateInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Main specifications</legend>

        <div>
          <FieldLabel
            htmlFor="dr-pv"
            label="Present Value (PV)"
            tip="Today’s value of the cash stream. Currency labels denomination only."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="dr-pv"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.presentValue}
                aria-invalid={Boolean(errors.presentValue)}
                onChange={(e) => set({ presentValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dr-pv-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.presentValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.presentValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="dr-fv"
            label="Future Value (FV)"
            tip="Value at the end of the term. Currency labels denomination only."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="dr-fv"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.futureValue}
                aria-invalid={Boolean(errors.futureValue)}
                onChange={(e) => set({ futureValue: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dr-fv-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.futureValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.futureValue}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="dr-term"
            label="Term or number of periods"
            tip="Investment or discount horizon. Choose years or months."
          />
          <div className="flex gap-2">
            <input
              id="dr-term"
              className={`${inputClass} min-w-0 flex-1`}
              inputMode="decimal"
              value={input.term}
              aria-invalid={Boolean(errors.term)}
              onChange={(e) => set({ term: e.target.value })}
            />
            <select
              id="dr-term-unit"
              className={`${selectClass} w-[110px] shrink-0 sm:w-[120px]`}
              value={input.termUnit}
              aria-label="Term unit"
              onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </div>
          {errors.term ? <p className="mt-1 text-xs text-rose-600">{errors.term}</p> : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="dr-compound"
            label="Compounding frequency"
            tip="How many times per year the discount rate compounds (m)."
          />
          <select
            id="dr-compound"
            className={selectClass}
            value={input.compoundFrequency}
            onChange={(e) =>
              set({ compoundFrequency: e.target.value as CompoundFrequency })
            }
          >
            {COMPOUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Periodic cash flows</legend>

        <div>
          <FieldLabel
            htmlFor="dr-cf"
            label="Cash flow (CF)"
            tip="Recurring amount each cash-flow period. Use 0 for FV-only discounting."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="dr-cf"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.cashFlow}
                aria-invalid={Boolean(errors.cashFlow)}
                onChange={(e) => set({ cashFlow: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dr-cf-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.cashFlow ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cashFlow}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="dr-cf-freq"
            label="Cash flow frequency"
            tip="How often the periodic cash flow occurs."
          />
          <select
            id="dr-cf-freq"
            className={selectClass}
            value={input.cashFlowFrequency}
            onChange={(e) =>
              set({ cashFlowFrequency: e.target.value as CashFlowFrequency })
            }
          >
            {CASH_FLOW_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel
            htmlFor="dr-cf-timing"
            label="Type of cash flows"
            tip="Beginning of period pays at the start of each interval; end pays at the close."
          />
          <select
            id="dr-cf-timing"
            className={selectClass}
            value={input.cashFlowTiming}
            onChange={(e) => set({ cashFlowTiming: e.target.value as CashFlowTiming })}
          >
            <option value="end">End of period</option>
            <option value="beginning">Beginning of period</option>
          </select>
        </div>
      </fieldset>

      <div>
        <FieldLabel
          htmlFor="dr-result"
          label="Annual discount rate"
          tip="Nominal annual rate r that equates PV to discounted FV and cash flows."
        />
        <div className="relative">
          <input
            id="dr-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-8 font-semibold text-accent`}
            value={result ? result.formattedRate : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
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
