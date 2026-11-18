'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INSURANCE_UNAVAILABLE_REASON,
  LOANABLE_AMOUNT_UNAVAILABLE_REASON,
  OTHER_VALUES_UNAVAILABLE_REASON,
  TOTAL_AMORTIZATION_UNAVAILABLE_REASON,
  monthlyFromAnnual,
} from './calculation';
import {
  FIXED_PRICING_OPTIONS,
  REPAYMENT_PERIOD_OPTIONS,
  type FixedPricingOptionId,
  type PagIbigHousingLoanFieldErrors,
  type PagIbigHousingLoanInput,
  type PagIbigHousingLoanResult,
  type RepaymentPeriodYears,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const noteClass = 'mt-1 text-xs text-amber-800';

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

function MoneyInput({
  id,
  value,
  error,
  muted,
  readOnly,
  onChange,
}: {
  id: string;
  value: string;
  error?: string;
  muted?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <FieldShell error={error} muted={muted}>
      <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
        ₱
      </span>
      <input
        id={id}
        className={`${inputClass} ${readOnly || muted ? 'font-semibold' : ''}`}
        inputMode="decimal"
        value={value}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-live={readOnly ? 'polite' : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </FieldShell>
  );
}

interface PagIbigHousingLoanFormProps {
  input: PagIbigHousingLoanInput;
  errors: PagIbigHousingLoanFieldErrors;
  result: PagIbigHousingLoanResult | null;
  onChange: (input: PagIbigHousingLoanInput) => void;
  onReset: () => void;
}

export function PagIbigHousingLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: PagIbigHousingLoanFormProps) {
  const set = (patch: Partial<PagIbigHousingLoanInput>) =>
    onChange({ ...input, ...patch });

  const handleAnnualIncome = (raw: string) => {
    const cleaned = raw.trim().replace(/,/g, '');
    const annual = cleaned === '' ? Number.NaN : Number(cleaned);
    const monthly =
      Number.isFinite(annual) && annual >= 0 ? monthlyFromAnnual(annual) : null;
    set({
      grossAnnualIncome: raw,
      grossMonthlyIncome: monthly === null ? '' : String(monthly),
      incomeSource: 'annual',
    });
  };

  const handleMonthlyIncome = (raw: string) => {
    const cleaned = raw.trim().replace(/,/g, '');
    const monthly = cleaned === '' ? Number.NaN : Number(cleaned);
    const annual =
      Number.isFinite(monthly) && monthly >= 0 ? monthly * 12 : Number.NaN;
    set({
      grossMonthlyIncome: raw,
      grossAnnualIncome: Number.isFinite(annual) ? String(annual) : '',
      incomeSource: 'monthly',
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Loanable amount based on property value
        </legend>

        <div>
          <label className={labelClass} htmlFor="pagibig-property">
            <span>Estimated value of property</span>
          </label>
          <MoneyInput
            id="pagibig-property"
            value={input.estimatedPropertyValue}
            error={errors.estimatedPropertyValue}
            onChange={(value) => set({ estimatedPropertyValue: value })}
          />
          {errors.estimatedPropertyValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.estimatedPropertyValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-loanable">
            <span>Loanable amount</span>
            <InfoTooltip
              label="Loanable amount"
              text={LOANABLE_AMOUNT_UNAVAILABLE_REASON}
            />
          </label>
          <MoneyInput id="pagibig-loanable" value="" muted readOnly />
          <p className={noteClass}>{LOANABLE_AMOUNT_UNAVAILABLE_REASON}</p>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Loan and repayment details
        </legend>

        <div>
          <label className={labelClass} htmlFor="pagibig-loan">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Requested financing principal in Philippine pesos. Not capped against loanable amount until official Pag-IBIG limits are sourced."
            />
          </label>
          <MoneyInput
            id="pagibig-loan"
            value={input.loanAmount}
            error={errors.loanAmount}
            onChange={(value) => set({ loanAmount: value })}
          />
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-repayment">
            <span>Repayment period</span>
          </label>
          <select
            id="pagibig-repayment"
            className={selectClass}
            value={input.repaymentPeriodYears}
            onChange={(e) =>
              set({
                repaymentPeriodYears: Number(e.target.value) as RepaymentPeriodYears,
              })
            }
          >
            {REPAYMENT_PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Only the screenshot-confirmed 30-year term is offered; other durations were not
            listed in available reference data.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-pricing">
            <span>Fixed pricing period</span>
            <InfoTooltip
              label="Fixed pricing period"
              text="Screenshot option 30 years (9.750%). This example rate is used for amortization math and is not claimed as a verified current Pag-IBIG circular rate."
            />
          </label>
          <select
            id="pagibig-pricing"
            className={selectClass}
            value={input.fixedPricingOptionId}
            onChange={(e) =>
              set({
                fixedPricingOptionId: e.target.value as FixedPricingOptionId,
              })
            }
          >
            {FIXED_PRICING_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-pi">
            <span>Monthly principal and interest</span>
          </label>
          <MoneyInput
            id="pagibig-pi"
            value={result ? result.formattedMonthlyPrincipalAndInterest : ''}
            muted
            readOnly
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-insurance">
            <span>Monthly insurance premium</span>
            <InfoTooltip
              label="Monthly insurance premium"
              text={INSURANCE_UNAVAILABLE_REASON}
            />
          </label>
          <MoneyInput id="pagibig-insurance" value="" muted readOnly />
          <p className={noteClass}>{INSURANCE_UNAVAILABLE_REASON}</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-total">
            <span>Total monthly amortization</span>
            <InfoTooltip
              label="Total monthly amortization"
              text={TOTAL_AMORTIZATION_UNAVAILABLE_REASON}
            />
          </label>
          <MoneyInput id="pagibig-total" value="" muted readOnly />
          <p className={noteClass}>{TOTAL_AMORTIZATION_UNAVAILABLE_REASON}</p>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Income details</legend>

        <div>
          <label className={labelClass} htmlFor="pagibig-annual">
            <span>Gross annual income</span>
          </label>
          <MoneyInput
            id="pagibig-annual"
            value={input.grossAnnualIncome}
            error={errors.grossAnnualIncome}
            onChange={handleAnnualIncome}
          />
          {errors.grossAnnualIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.grossAnnualIncome}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pagibig-monthly">
            <span>Gross monthly income</span>
          </label>
          <MoneyInput
            id="pagibig-monthly"
            value={input.grossMonthlyIncome}
            error={errors.grossMonthlyIncome}
            onChange={handleMonthlyIncome}
          />
          {errors.grossMonthlyIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.grossMonthlyIncome}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Monthly = annual ÷ 12 · Annual = monthly × 12 (last-edited field drives the other).
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          <span className="inline-flex items-center gap-1.5">
            Show other calculated values?
            <InfoTooltip
              label="Show other calculated values"
              text={OTHER_VALUES_UNAVAILABLE_REASON}
            />
          </span>
        </legend>
        <div className="flex flex-wrap gap-4 text-sm text-accent">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="pagibig-other-values"
              checked={!input.showOtherCalculatedValues}
              onChange={() => set({ showOtherCalculatedValues: false })}
            />
            No
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="pagibig-other-values"
              checked={input.showOtherCalculatedValues}
              onChange={() => set({ showOtherCalculatedValues: true })}
            />
            Yes
          </label>
        </div>
        {input.showOtherCalculatedValues ? (
          <p className={noteClass}>{OTHER_VALUES_UNAVAILABLE_REASON}</p>
        ) : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
