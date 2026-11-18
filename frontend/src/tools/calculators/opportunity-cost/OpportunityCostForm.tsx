'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OpportunityCostFieldErrors,
  OpportunityCostInput,
  OpportunityCostResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface OpportunityCostFormProps {
  input: OpportunityCostInput;
  errors: OpportunityCostFieldErrors;
  result: OpportunityCostResult | null;
  onChange: (input: OpportunityCostInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function OpportunityCostForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: OpportunityCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<OpportunityCostInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="oc-money">
          <span>Money to spend</span>
          <InfoTooltip
            label="Money to spend"
            text="Amount you would spend today instead of investing. Must be zero or greater."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.moneyToSpend}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="oc-money"
              className={inputClass}
              inputMode="decimal"
              value={input.moneyToSpend}
              aria-invalid={Boolean(errors.moneyToSpend)}
              onChange={(event) => set({ moneyToSpend: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="oc-money-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Money to spend currency"
            />
          </div>
        </div>
        {errors.moneyToSpend ? (
          <p className="mt-1 text-xs text-rose-600">{errors.moneyToSpend}</p>
        ) : null}
      </div>

      <details open className="rounded-xl border border-border bg-muted/20">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          If I invest the money
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <div>
            <label className={labelClass} htmlFor="oc-return">
              <span>Annual return on savings</span>
              <InfoTooltip
                label="Annual return on savings"
                text="Expected annual pre-tax return if the money is invested. Tax is applied to this return before compounding."
              />
            </label>
            <FieldShell error={errors.annualReturn}>
              <input
                id="oc-return"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.annualReturn}
                aria-invalid={Boolean(errors.annualReturn)}
                onChange={(event) => set({ annualReturn: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.annualReturn ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualReturn}</p>
            ) : null}
          </div>

          <div>
            <div className={`${labelClass} mb-1.5`}>
              <span>Investment period</span>
              <InfoTooltip
                label="Investment period"
                text="How long the money would stay invested, in years and months. Both must be non-negative."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FieldShell error={errors.years}>
                <input
                  id="oc-years"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.years}
                  placeholder="0"
                  aria-label="Years"
                  aria-invalid={Boolean(errors.years)}
                  onChange={(event) => set({ years: event.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              <FieldShell error={errors.months}>
                <input
                  id="oc-months"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.months}
                  placeholder="0"
                  aria-label="Months"
                  aria-invalid={Boolean(errors.months)}
                  onChange={(event) => set({ months: event.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  mos
                </span>
              </FieldShell>
            </div>
            {errors.years ? (
              <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
            ) : errors.months ? (
              <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="oc-tax">
              <span>Income tax</span>
              <InfoTooltip
                label="Income tax"
                text="Tax rate applied to investment earnings (0–100%). After-tax return = annual return × (1 − tax)."
              />
            </label>
            <FieldShell error={errors.incomeTax}>
              <input
                id="oc-tax"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.incomeTax}
                aria-invalid={Boolean(errors.incomeTax)}
                onChange={(event) => set({ incomeTax: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.incomeTax ? (
              <p className="mt-1 text-xs text-rose-600">{errors.incomeTax}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="oc-inflation">
              <span>Annual inflation rate</span>
              <InfoTooltip
                label="Annual inflation rate"
                text="Used to express future savings in today’s purchasing power. Must be greater than −100%."
              />
            </label>
            <FieldShell error={errors.inflation}>
              <input
                id="oc-inflation"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.inflation}
                aria-invalid={Boolean(errors.inflation)}
                onChange={(event) => set({ inflation: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.inflation ? (
              <p className="mt-1 text-xs text-rose-600">{errors.inflation}</p>
            ) : null}
          </div>
        </div>
      </details>

      <div className="space-y-3.5">
        <h3 className="text-sm font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="oc-total-savings">
            <span>Total savings (after tax)</span>
            <InfoTooltip
              label="Total savings (after tax)"
              text="Future value after compounding the after-tax annual return for the investment period."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="oc-total-savings"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalSavings : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="oc-total-savings-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Total savings currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="oc-opportunity-cost">
            <span>Opportunity cost — inflation adjusted</span>
            <InfoTooltip
              label="Opportunity cost — inflation adjusted"
              text="Real future value minus money spent today. Measures the inflation-adjusted investment gain forgone by spending instead of investing."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="oc-opportunity-cost"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedOpportunityCost : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="oc-opportunity-cost-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Opportunity cost currency"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showSupplementary}
            onChange={(event) => set({ showSupplementary: event.target.checked })}
          />
          Show supplementary metrics
        </label>

        {input.showSupplementary ? (
          <div className="space-y-3.5 rounded-xl border border-border bg-muted/20 p-4">
            <div>
              <label className={labelClass} htmlFor="oc-real-savings">
                <span>Inflation-adjusted savings</span>
                <InfoTooltip
                  label="Inflation-adjusted savings"
                  text="Total savings after tax, deflated by inflation over the investment period (Real FV)."
                />
              </label>
              <FieldShell muted>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="oc-real-savings"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedRealSavings : ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
            <div>
              <label className={labelClass} htmlFor="oc-nominal-gain">
                <span>Nominal investment gain</span>
                <InfoTooltip
                  label="Nominal investment gain"
                  text="Total savings after tax minus money spent. Not inflation-adjusted."
                />
              </label>
              <FieldShell muted>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  {symbol}
                </span>
                <input
                  id="oc-nominal-gain"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedNominalGain : ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
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
