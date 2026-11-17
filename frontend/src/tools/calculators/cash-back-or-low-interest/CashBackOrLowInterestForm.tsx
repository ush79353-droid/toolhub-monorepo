'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CashBackOrLowInterestFieldErrors,
  CashBackOrLowInterestInput,
  CashBackOrLowInterestResult,
  OfferBreakdown,
} from './types';
import { US_STATE_OPTIONS } from './us-states';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function OfferRows({
  title,
  offer,
  termMonths,
  emphasize,
}: {
  title: string;
  offer: OfferBreakdown;
  termMonths: number;
  emphasize: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        emphasize
          ? 'border-brand-teal/40 bg-brand-softTeal/30'
          : 'border-border bg-white/60'
      }`}
    >
      <h4 className="text-[13px] font-semibold text-accent">{title}</h4>
      <dl className="mt-2 space-y-1.5 text-sm text-accent">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total Loan Amount</dt>
          <dd className="tabular-nums">${offer.formattedTotalLoanAmount}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Sales Tax</dt>
          <dd className="tabular-nums">${offer.formattedSalesTax}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Upfront Payment</dt>
          <dd className="tabular-nums">${offer.formattedUpfrontPayment}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Monthly Pay</dt>
          <dd className="font-semibold tabular-nums">${offer.formattedMonthlyPayment}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total of {termMonths} Loan Payments</dt>
          <dd className="tabular-nums">${offer.formattedTotalLoanPayments}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total Loan Interest</dt>
          <dd className="tabular-nums">${offer.formattedTotalLoanInterest}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border/60 pt-1.5">
          <dt className="text-muted-foreground">
            Total Cost (price, interest, tax, fees)
          </dt>
          <dd className="font-semibold tabular-nums">${offer.formattedTotalCost}</dd>
        </div>
      </dl>
    </div>
  );
}

interface CashBackOrLowInterestFormProps {
  input: CashBackOrLowInterestInput;
  errors: CashBackOrLowInterestFieldErrors;
  result: CashBackOrLowInterestResult | null;
  onChange: (input: CashBackOrLowInterestInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function CashBackOrLowInterestForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: CashBackOrLowInterestFormProps) {
  const set = (patch: Partial<CashBackOrLowInterestInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="grid gap-4 lg:grid-cols-2">
        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Inputs</legend>

          <div className="space-y-3 rounded-lg border border-border/70 bg-white/50 p-3">
            <h3 className="text-[13px] font-semibold text-accent">Cash Back Offer</h3>

            <div>
              <label className={labelClass} htmlFor="cbli-cashback">
                <span>Cash Back Amount</span>
              </label>
              <FieldShell error={errors.cashBackAmount}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cbli-cashback"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cashBackAmount}
                  aria-invalid={Boolean(errors.cashBackAmount)}
                  onChange={(e) => set({ cashBackAmount: e.target.value })}
                />
              </FieldShell>
              {errors.cashBackAmount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.cashBackAmount}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-high-rate">
                <span>Interest Rate (High)</span>
              </label>
              <FieldShell error={errors.highInterestRatePercent}>
                <input
                  id="cbli-high-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.highInterestRatePercent}
                  aria-invalid={Boolean(errors.highInterestRatePercent)}
                  onChange={(e) => set({ highInterestRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.highInterestRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.highInterestRatePercent}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border/70 bg-white/50 p-3">
            <h3 className="text-[13px] font-semibold text-accent">Low Interest Rate Offer</h3>

            <div>
              <label className={labelClass} htmlFor="cbli-low-rate">
                <span>Interest Rate (Low)</span>
              </label>
              <FieldShell error={errors.lowInterestRatePercent}>
                <input
                  id="cbli-low-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.lowInterestRatePercent}
                  aria-invalid={Boolean(errors.lowInterestRatePercent)}
                  onChange={(e) => set({ lowInterestRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.lowInterestRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.lowInterestRatePercent}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border/70 bg-white/50 p-3">
            <h3 className="text-[13px] font-semibold text-accent">Other Information</h3>

            <div>
              <label className={labelClass} htmlFor="cbli-price">
                <span>Auto Price</span>
              </label>
              <FieldShell error={errors.autoPrice}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cbli-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.autoPrice}
                  aria-invalid={Boolean(errors.autoPrice)}
                  onChange={(e) => set({ autoPrice: e.target.value })}
                />
              </FieldShell>
              {errors.autoPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.autoPrice}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-term">
                <span>Loan Term</span>
              </label>
              <FieldShell error={errors.loanTermMonths}>
                <input
                  id="cbli-term"
                  className={`${inputClass} pr-16`}
                  inputMode="numeric"
                  value={input.loanTermMonths}
                  aria-invalid={Boolean(errors.loanTermMonths)}
                  onChange={(e) => set({ loanTermMonths: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  months
                </span>
              </FieldShell>
              {errors.loanTermMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.loanTermMonths}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-down">
                <span>Down Payment</span>
              </label>
              <FieldShell error={errors.downPayment}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cbli-down"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.downPayment}
                  aria-invalid={Boolean(errors.downPayment)}
                  onChange={(e) => set({ downPayment: e.target.value })}
                />
              </FieldShell>
              {errors.downPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-tradein">
                <span>Trade-in Value</span>
              </label>
              <FieldShell error={errors.tradeInValue}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cbli-tradein"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.tradeInValue}
                  aria-invalid={Boolean(errors.tradeInValue)}
                  onChange={(e) => set({ tradeInValue: e.target.value })}
                />
              </FieldShell>
              {errors.tradeInValue ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tradeInValue}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-state">
                <span>Your State</span>
                <InfoTooltip
                  label="Your State"
                  text="Lists verified US states and DC for reference. Sales tax is entered manually — this project does not store unverified per-state rates, so selecting a state never overwrites Sales Tax %."
                />
              </label>
              <select
                id="cbli-state"
                className={selectClass}
                value={input.stateCode}
                onChange={(e) => set({ stateCode: e.target.value })}
              >
                <option value="">-- Select --</option>
                {US_STATE_OPTIONS.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-tax">
                <span>Sales Tax</span>
              </label>
              <FieldShell error={errors.salesTaxPercent}>
                <input
                  id="cbli-tax"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.salesTaxPercent}
                  aria-invalid={Boolean(errors.salesTaxPercent)}
                  onChange={(e) => set({ salesTaxPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.salesTaxPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salesTaxPercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="cbli-fees">
                <span>Title, Registration and Other Fees</span>
              </label>
              <FieldShell error={errors.titleRegistrationFees}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                  $
                </span>
                <input
                  id="cbli-fees"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.titleRegistrationFees}
                  aria-invalid={Boolean(errors.titleRegistrationFees)}
                  onChange={(e) => set({ titleRegistrationFees: e.target.value })}
                />
              </FieldShell>
              {errors.titleRegistrationFees ? (
                <p className="mt-1 text-xs text-rose-600">{errors.titleRegistrationFees}</p>
              ) : null}
            </div>

            <label className="flex items-start gap-2.5 text-sm text-accent">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border"
                checked={input.includeAllFeesInLoan}
                onChange={(e) => set({ includeAllFeesInLoan: e.target.checked })}
              />
              <span>Include All Fees in Loan</span>
            </label>
          </div>

          {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button type="submit" className="h-11 font-medium">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 font-medium"
              onClick={onReset}
            >
              Clear
            </Button>
          </div>
        </fieldset>

        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

          {result ? (
            <>
              <div className="rounded-lg border border-border bg-white/70 p-3">
                <p className="text-sm font-semibold text-rose-700">{result.verdictTitle}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-accent">
                  {result.verdictExplanation}
                </p>
                {result.betterOffer !== 'tie' ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Total cost savings:{' '}
                    <span className="font-medium tabular-nums text-accent">
                      ${result.formattedTotalCostSavings}
                    </span>
                  </p>
                ) : null}
              </div>

              <OfferRows
                title="With Cash Back Offer"
                offer={result.cashBackOffer}
                termMonths={result.loanTermMonths}
                emphasize={result.betterOffer === 'cash-back'}
              />
              <OfferRows
                title="With Low Interest Rate Offer"
                offer={result.lowInterestOffer}
                termMonths={result.loanTermMonths}
                emphasize={result.betterOffer === 'low-interest'}
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter valid values and click Calculate to compare cash back versus low interest
              total cost.
            </p>
          )}
        </fieldset>
      </div>
    </form>
  );
}
