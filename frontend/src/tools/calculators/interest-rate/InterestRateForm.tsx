'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CapitalizationFrequency,
  InterestRateFieldErrors,
  InterestRateInput,
  InterestRateResult,
  PaymentFrequency,
} from './types';
import { CAPITALIZATION_OPTIONS, PAYMENT_FREQUENCY_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4';

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

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValueChange,
  onCurrencyChange,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  error?: string;
  symbol: string;
  currency: InterestRateInput['currency'];
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: InterestRateInput['currency']) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(event) => onValueChange(event.target.value)}
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

interface InterestRateFormProps {
  input: InterestRateInput;
  errors: InterestRateFieldErrors;
  result: InterestRateResult | null;
  onChange: (input: InterestRateInput) => void;
  onReset: () => void;
}

export function InterestRateForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: InterestRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<InterestRateInput>) => onChange({ ...input, ...patch });
  const setCurrency = (currency: InterestRateInput['currency']) => set({ currency });
  const isLoan = input.mode === 'loan';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={`${sectionClass} bg-muted/15`}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Calculation type</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="interest-rate-mode"
              className="h-4 w-4 border-border"
              checked={isLoan}
              onChange={() => set({ mode: 'loan' })}
            />
            Interest rate on loan
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="interest-rate-mode"
              className="h-4 w-4 border-border"
              checked={!isLoan}
              onChange={() => set({ mode: 'deposit' })}
            />
            Interest rate on deposit
          </label>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">
          {isLoan ? 'Loan specifications' : 'Deposit specifications'}
        </legend>

        {isLoan ? (
          <MoneyField
            id="ir-loan-amount"
            label="Loan amount"
            tip="Principal amount of the loan before fees."
            value={input.loanAmount}
            error={errors.loanAmount}
            symbol={symbol}
            currency={input.currency}
            onValueChange={(loanAmount) => set({ loanAmount })}
            onCurrencyChange={setCurrency}
          />
        ) : (
          <>
            <MoneyField
              id="ir-initial-deposit"
              label="Initial deposit"
              tip="Opening balance of the deposit account."
              value={input.initialDeposit}
              error={errors.initialDeposit}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(initialDeposit) => set({ initialDeposit })}
              onCurrencyChange={setCurrency}
            />
            <MoneyField
              id="ir-current-balance"
              label="Current balance"
              tip="Balance after growth. Must be greater than the initial deposit."
              value={input.currentBalance}
              error={errors.currentBalance}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(currentBalance) => set({ currentBalance })}
              onCurrencyChange={setCurrency}
            />
          </>
        )}

        <div>
          <span className={labelClass}>Term</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldShell error={errors.termYears}>
                <input
                  id="ir-term-years"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.termYears}
                  aria-label="Term years"
                  aria-invalid={Boolean(errors.termYears)}
                  onChange={(event) => set({ termYears: event.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              {errors.termYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
              ) : null}
            </div>
            <div>
              <FieldShell error={errors.termMonths}>
                <input
                  id="ir-term-months"
                  className={`${inputClass} pr-10`}
                  inputMode="numeric"
                  value={input.termMonths}
                  aria-label="Term months"
                  aria-invalid={Boolean(errors.termMonths)}
                  onChange={(event) => set({ termMonths: event.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  mos
                </span>
              </FieldShell>
              {errors.termMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ir-cap-freq">
            <span>Interest capitalization frequency</span>
            <InfoTooltip
              label="Interest capitalization frequency"
              text="How often interest is compounded (or continuous compounding)."
            />
          </label>
          <select
            id="ir-cap-freq"
            className={selectClass}
            value={input.capitalizationFrequency}
            onChange={(event) =>
              set({
                capitalizationFrequency: event.target.value as CapitalizationFrequency,
              })
            }
          >
            {CAPITALIZATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoan ? (
          <>
            <div>
              <label className={labelClass} htmlFor="ir-pay-freq">
                <span>Payment frequency</span>
              </label>
              <select
                id="ir-pay-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(event) =>
                  set({ paymentFrequency: event.target.value as PaymentFrequency })
                }
              >
                {PAYMENT_FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <MoneyField
              id="ir-periodic-payment"
              label="Periodic payment"
              tip="Installment paid each payment period."
              value={input.periodicPayment}
              error={errors.periodicPayment}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(periodicPayment) => set({ periodicPayment })}
              onCurrencyChange={setCurrency}
            />
            <MoneyField
              id="ir-prepaid-fees"
              label="Prepaid fees"
              tip="Fees paid upfront. They are not interest-bearing but raise APR."
              value={input.prepaidFees}
              error={errors.prepaidFees}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(prepaidFees) => set({ prepaidFees })}
              onCurrencyChange={setCurrency}
            />
            <MoneyField
              id="ir-loaned-fees"
              label="Loaned fees"
              tip="Fees rolled into the loan balance. Interest is charged on them."
              value={input.loanedFees}
              error={errors.loanedFees}
              symbol={symbol}
              currency={input.currency}
              onValueChange={(loanedFees) => set({ loanedFees })}
              onCurrencyChange={setCurrency}
            />
          </>
        ) : null}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>
        {result ? (
          <ul className="space-y-2 text-sm text-accent">
            <li>
              Annual nominal interest rate:{' '}
              <span className="font-semibold tabular-nums">
                {result.formattedAnnualNominal}%
              </span>
              {result.formattedPeriodicRate ? (
                <>
                  {' '}
                  (periodic rate:{' '}
                  <span className="font-semibold tabular-nums">
                    {result.formattedPeriodicRate}%
                  </span>
                  )
                </>
              ) : null}
            </li>
            <li>
              Effective annual rate (EAR):{' '}
              <span className="font-semibold tabular-nums">{result.formattedEar}%</span>
            </li>
            {result.formattedApr ? (
              <li>
                Annual Percentage Rate (APR):{' '}
                <span className="font-semibold tabular-nums">{result.formattedApr}%</span>
              </li>
            ) : null}
            {result.formattedTotalPayments && result.formattedTotalInterest ? (
              <li>
                Total payments:{' '}
                <span className="font-semibold tabular-nums">
                  {symbol}
                  {result.formattedTotalPayments}
                </span>
                {', interest '}
                <span className="font-semibold tabular-nums">
                  {symbol}
                  {result.formattedTotalInterest}
                </span>
                {result.formattedAdditionalFees ? (
                  <>
                    {', additional fees '}
                    <span className="font-semibold tabular-nums">
                      {symbol}
                      {result.formattedAdditionalFees}
                    </span>
                  </>
                ) : null}
              </li>
            ) : null}
            {result.formattedAdjustedPayment &&
            Number(input.loanedFees.replace(/,/g, '')) > 0 ? (
              <li>
                Periodic payment after rolling loaned fees into the loan:{' '}
                <span className="font-semibold tabular-nums">
                  {symbol}
                  {result.formattedAdjustedPayment}
                </span>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid inputs to see the interest rate summary.
          </p>
        )}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
