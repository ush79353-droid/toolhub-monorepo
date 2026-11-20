'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AffordabilityMode,
  ClosingCostMode,
  DownPaymentMode,
  HomeAffordabilityFieldErrors,
  HomeAffordabilityInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface HomeAffordabilityFormProps {
  input: HomeAffordabilityInput;
  errors: HomeAffordabilityFieldErrors;
  onChange: (input: HomeAffordabilityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function HomeAffordabilityForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: HomeAffordabilityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<HomeAffordabilityInput>) =>
    onChange({ ...input, ...patch });

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
          changes the symbol only — it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="ha-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate from</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="ha-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'payment'}
              onChange={() => set({ mode: 'payment' satisfies AffordabilityMode })}
            />
            Maximum housing payment
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="ha-mode"
              className="h-4 w-4 accent-primary"
              checked={input.mode === 'income'}
              onChange={() => set({ mode: 'income' satisfies AffordabilityMode })}
            />
            Household income &amp; DTI
          </label>
        </div>
      </fieldset>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.loanSpecOpen}
        onToggle={(event) => set({ loanSpecOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.loanSpecOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Loan specification</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {input.mode === 'payment' ? (
            <div>
              <label className={labelClass} htmlFor="ha-max-payment">
                <span>Maximum payment</span>
                <InfoTooltip
                  label="Maximum payment"
                  text="Total monthly housing budget for principal & interest, taxes, insurance, HOA, and mortgage insurance — not P&I alone."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.maximumPayment}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="ha-max-payment"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.maximumPayment}
                    aria-invalid={Boolean(errors.maximumPayment)}
                    onChange={(e) => set({ maximumPayment: e.target.value })}
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[110px]`}
                  aria-label="Payment period"
                  value={input.paymentPeriod}
                  onChange={(e) =>
                    set({
                      paymentPeriod: e.target.value as 'monthly' | 'annual',
                    })
                  }
                >
                  <option value="monthly">monthly</option>
                  <option value="annual">annual</option>
                </select>
              </div>
              {errors.maximumPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.maximumPayment}</p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className={labelClass} htmlFor="ha-term">
              <span>Loan term</span>
              <InfoTooltip
                label="Loan term"
                text="Mortgage duration. Converted internally to months for amortization."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.loanTermValue}>
                <input
                  id="ha-term"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.loanTermValue}
                  aria-invalid={Boolean(errors.loanTermValue)}
                  onChange={(e) => set({ loanTermValue: e.target.value })}
                />
              </FieldShell>
              <select
                className={`${selectClass} w-[110px]`}
                aria-label="Loan term unit"
                value={input.loanTermUnit}
                onChange={(e) =>
                  set({ loanTermUnit: e.target.value as 'years' | 'months' })
                }
              >
                <option value="years">years</option>
                <option value="months">months</option>
              </select>
            </div>
            {errors.loanTermValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.loanTermValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ha-rate">
              <span>Interest rate</span>
              <InfoTooltip
                label="Interest rate"
                text="Nominal annual mortgage interest rate. Monthly rate = annual ÷ 12."
              />
            </label>
            <FieldShell error={errors.annualInterestRate}>
              <input
                id="ha-rate"
                className={inputClass}
                inputMode="decimal"
                value={input.annualInterestRate}
                aria-invalid={Boolean(errors.annualInterestRate)}
                onChange={(e) => set({ annualInterestRate: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.annualInterestRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.annualInterestRate}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.additionalOpen}
        onToggle={(event) => set({ additionalOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.additionalOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Additional information</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ha-income">
              <span>
                {input.mode === 'income'
                  ? 'Gross household income'
                  : 'Gross household income (optional for DTI display)'}
              </span>
              <InfoTooltip
                label="Household income"
                text="Gross income before taxes. Used for DTI-based affordability in income mode."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.income}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id="ha-income"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.income}
                  aria-invalid={Boolean(errors.income)}
                  onChange={(e) => set({ income: e.target.value })}
                />
              </FieldShell>
              <select
                className={`${selectClass} w-[110px]`}
                aria-label="Income period"
                value={input.incomePeriod}
                onChange={(e) =>
                  set({
                    incomePeriod: e.target.value as 'annual' | 'monthly',
                  })
                }
              >
                <option value="annual">annual</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
            {errors.income ? (
              <p className="mt-1 text-xs text-rose-600">{errors.income}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ha-debt">
              <span>Monthly debt payments</span>
              <InfoTooltip
                label="Monthly debts"
                text="Recurring obligations such as auto, student, personal loans, and credit-card minimums — not ordinary living expenses."
              />
            </label>
            <FieldShell error={errors.monthlyDebtPayments}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden
              >
                {symbol}
              </span>
              <input
                id="ha-debt"
                className={inputClass}
                inputMode="decimal"
                value={input.monthlyDebtPayments}
                aria-invalid={Boolean(errors.monthlyDebtPayments)}
                onChange={(e) => set({ monthlyDebtPayments: e.target.value })}
              />
            </FieldShell>
            {errors.monthlyDebtPayments ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.monthlyDebtPayments}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ha-dp">
              <span>Down payment</span>
              <InfoTooltip
                label="Down payment"
                text="Fixed amount or percent of purchase price. Percent mode avoids circular edits by solving price and down payment together."
              />
            </label>
            <div className="mb-2 flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="ha-dp-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.downPaymentMode === 'amount'}
                  onChange={() =>
                    set({ downPaymentMode: 'amount' satisfies DownPaymentMode })
                  }
                />
                Amount
              </label>
              <label className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="ha-dp-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.downPaymentMode === 'percent'}
                  onChange={() =>
                    set({ downPaymentMode: 'percent' satisfies DownPaymentMode })
                  }
                />
                Percent of price
              </label>
            </div>
            {input.downPaymentMode === 'amount' ? (
              <>
                <FieldShell error={errors.downPaymentAmount}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="ha-dp"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.downPaymentAmount}
                    aria-invalid={Boolean(errors.downPaymentAmount)}
                    onChange={(e) => set({ downPaymentAmount: e.target.value })}
                  />
                </FieldShell>
                {errors.downPaymentAmount ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.downPaymentAmount}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <FieldShell error={errors.downPaymentPercent}>
                  <input
                    id="ha-dp"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.downPaymentPercent}
                    aria-invalid={Boolean(errors.downPaymentPercent)}
                    onChange={(e) => set({ downPaymentPercent: e.target.value })}
                  />
                  <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                </FieldShell>
                {errors.downPaymentPercent ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.downPaymentPercent}
                  </p>
                ) : null}
              </>
            )}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ha-tax">
                <span>Annual property tax rate</span>
                <InfoTooltip
                  label="Property tax rate"
                  text="Annual percent of purchase price. Monthly tax = price × rate ÷ 12."
                />
              </label>
              <FieldShell error={errors.annualPropertyTaxRate}>
                <input
                  id="ha-tax"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualPropertyTaxRate}
                  aria-invalid={Boolean(errors.annualPropertyTaxRate)}
                  onChange={(e) =>
                    set({ annualPropertyTaxRate: e.target.value })
                  }
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.annualPropertyTaxRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualPropertyTaxRate}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ha-ins">
                <span>Annual homeowners insurance</span>
                <InfoTooltip
                  label="Homeowners insurance"
                  text="Annual premium converted to a monthly housing expense."
                />
              </label>
              <FieldShell error={errors.annualHomeownersInsurance}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id="ha-ins"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualHomeownersInsurance}
                  aria-invalid={Boolean(errors.annualHomeownersInsurance)}
                  onChange={(e) =>
                    set({ annualHomeownersInsurance: e.target.value })
                  }
                />
              </FieldShell>
              {errors.annualHomeownersInsurance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualHomeownersInsurance}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ha-hoa">
                <span>Monthly HOA fees</span>
                <InfoTooltip
                  label="HOA fees"
                  text="Recurring homeowners association dues included in total housing payment."
                />
              </label>
              <FieldShell error={errors.monthlyHoa}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id="ha-hoa"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.monthlyHoa}
                  aria-invalid={Boolean(errors.monthlyHoa)}
                  onChange={(e) => set({ monthlyHoa: e.target.value })}
                />
              </FieldShell>
              {errors.monthlyHoa ? (
                <p className="mt-1 text-xs text-rose-600">{errors.monthlyHoa}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ha-mi">
                <span>Annual mortgage insurance rate</span>
                <InfoTooltip
                  label="Mortgage insurance"
                  text="Simplified estimate: monthly MI ≈ loan × annual rate ÷ 12. Actual premiums may differ."
                />
              </label>
              <FieldShell error={errors.annualMortgageInsuranceRate}>
                <input
                  id="ha-mi"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualMortgageInsuranceRate}
                  aria-invalid={Boolean(errors.annualMortgageInsuranceRate)}
                  onChange={(e) =>
                    set({ annualMortgageInsuranceRate: e.target.value })
                  }
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.annualMortgageInsuranceRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualMortgageInsuranceRate}
                </p>
              ) : null}
            </div>
          </div>

          {input.mode === 'income' ? (
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="ha-front">
                  <span>Maximum front-end DTI</span>
                  <InfoTooltip
                    label="Front-end DTI"
                    text="Illustrative housing-to-income limit (default 28%). Not a universal lender rule."
                  />
                </label>
                <FieldShell error={errors.frontEndDtiLimit}>
                  <input
                    id="ha-front"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.frontEndDtiLimit}
                    aria-invalid={Boolean(errors.frontEndDtiLimit)}
                    onChange={(e) => set({ frontEndDtiLimit: e.target.value })}
                  />
                  <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                </FieldShell>
                {errors.frontEndDtiLimit ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.frontEndDtiLimit}
                  </p>
                ) : null}
              </div>
              <div>
                <label className={labelClass} htmlFor="ha-back">
                  <span>Maximum back-end DTI</span>
                  <InfoTooltip
                    label="Back-end DTI"
                    text="Illustrative total debt-to-income limit (default 36%). Not a universal lender rule."
                  />
                </label>
                <FieldShell error={errors.backEndDtiLimit}>
                  <input
                    id="ha-back"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.backEndDtiLimit}
                    aria-invalid={Boolean(errors.backEndDtiLimit)}
                    onChange={(e) => set({ backEndDtiLimit: e.target.value })}
                  />
                  <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                </FieldShell>
                {errors.backEndDtiLimit ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.backEndDtiLimit}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div>
            <label className={labelClass}>Estimated closing costs</label>
            <div className="mb-2 flex flex-wrap gap-3">
              {(
                [
                  ['none', 'None'],
                  ['amount', 'Fixed amount'],
                  ['percent', 'Percent of price'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="ha-closing"
                    className="h-4 w-4 accent-primary"
                    checked={input.closingCostMode === value}
                    onChange={() =>
                      set({
                        closingCostMode: value satisfies ClosingCostMode,
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            {input.closingCostMode === 'amount' ? (
              <>
                <FieldShell error={errors.closingCostAmount}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    aria-label="Closing cost amount"
                    value={input.closingCostAmount}
                    aria-invalid={Boolean(errors.closingCostAmount)}
                    onChange={(e) => set({ closingCostAmount: e.target.value })}
                  />
                </FieldShell>
                {errors.closingCostAmount ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.closingCostAmount}
                  </p>
                ) : null}
              </>
            ) : null}
            {input.closingCostMode === 'percent' ? (
              <>
                <FieldShell error={errors.closingCostPercent}>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    aria-label="Closing cost percent"
                    value={input.closingCostPercent}
                    aria-invalid={Boolean(errors.closingCostPercent)}
                    onChange={(e) => set({ closingCostPercent: e.target.value })}
                  />
                  <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                </FieldShell>
                {errors.closingCostPercent ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.closingCostPercent}
                  </p>
                ) : null}
              </>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              Closing costs are shown as cash needed at closing and are not added
              into the down payment toward purchase price.
            </p>
          </div>
        </div>
      </details>

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
