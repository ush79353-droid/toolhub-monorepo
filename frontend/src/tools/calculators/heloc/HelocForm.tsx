'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HelocAdjustmentType,
  HelocFieldErrors,
  HelocInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface HelocFormProps {
  input: HelocInput;
  errors: HelocFieldErrors;
  onChange: (input: HelocInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function HelocForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: HelocFormProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [adjOpen, setAdjOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const showAdj = input.adjustmentType === 'scheduled';

  const set = (patch: Partial<HelocInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="heloc-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for HELOC amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX conversion).
        Fees are modeled as cash costs paid separately from principal.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <CollapsibleSection
        title="HELOC details"
        open={detailsOpen}
        onToggle={() => setDetailsOpen((o) => !o)}
      >
        <div>
          <label htmlFor="heloc-balance" className={labelClass}>
            Current HELOC balance
            <InfoTooltip
              label="Current HELOC balance"
              text="Outstanding balance currently borrowed on the line of credit; not the full credit limit."
            />
          </label>
          <FieldShell error={errors.currentBalance}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="heloc-balance"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentBalance}
              onChange={(e) => set({ currentBalance: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.currentBalance)}
            />
          </FieldShell>
          {errors.currentBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentBalance}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-draw" className={labelClass}>
            Draw period
            <InfoTooltip
              label="Draw period"
              text="Years of interest-only access. Modeled with no additional draws or principal payments."
            />
          </label>
          <FieldShell error={errors.drawPeriodYears}>
            <input
              id="heloc-draw"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.drawPeriodYears}
              onChange={(e) => set({ drawPeriodYears: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.drawPeriodYears)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              years
            </span>
          </FieldShell>
          {errors.drawPeriodYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.drawPeriodYears}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-repay" className={labelClass}>
            Repayment term
            <InfoTooltip
              label="Repayment term"
              text="Years to amortize the remaining balance after the draw period ends."
            />
          </label>
          <FieldShell error={errors.repaymentTermYears}>
            <input
              id="heloc-repay"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.repaymentTermYears}
              onChange={(e) => set({ repaymentTermYears: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.repaymentTermYears)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              years
            </span>
          </FieldShell>
          {errors.repaymentTermYears ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.repaymentTermYears}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-rate" className={labelClass}>
            Interest rate
            <InfoTooltip
              label="Interest rate"
              text="Initial annual nominal interest rate. Monthly rate = APR / 12."
            />
          </label>
          <FieldShell error={errors.initialInterestRate}>
            <input
              id="heloc-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialInterestRate}
              onChange={(e) => set({ initialInterestRate: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.initialInterestRate)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.initialInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.initialInterestRate}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-fee-pct" className={labelClass}>
            Up-front fee as a percentage
            <InfoTooltip
              label="Up-front fee as a percentage"
              text="Fee = balance × rate / 100. Paid separately; not added to principal."
            />
          </label>
          <FieldShell error={errors.upfrontFeePercent}>
            <input
              id="heloc-fee-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.upfrontFeePercent}
              onChange={(e) => set({ upfrontFeePercent: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.upfrontFeePercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.upfrontFeePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.upfrontFeePercent}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-fee-fixed" className={labelClass}>
            Up-front fees
            <InfoTooltip
              label="Up-front fees"
              text="Fixed application, origination, or processing fees paid separately from principal."
            />
          </label>
          <FieldShell error={errors.upfrontFeeFixed}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="heloc-fee-fixed"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.upfrontFeeFixed}
              onChange={(e) => set({ upfrontFeeFixed: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.upfrontFeeFixed)}
            />
          </FieldShell>
          {errors.upfrontFeeFixed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.upfrontFeeFixed}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="heloc-annual" className={labelClass}>
            Annual fee
            <InfoTooltip
              label="Annual fee"
              text="Charged once every 12 months in the schedule for the full modeled term (not as a monthly installment)."
            />
          </label>
          <FieldShell error={errors.annualFee}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="heloc-annual"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.annualFee}
              onChange={(e) => set({ annualFee: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.annualFee)}
            />
          </FieldShell>
          {errors.annualFee ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualFee}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Interest rate adjustments"
        open={adjOpen}
        onToggle={() => setAdjOpen((o) => !o)}
      >
        <div>
          <label htmlFor="heloc-adj-type" className={labelClass}>
            Adjustment type
            <InfoTooltip
              label="Adjustment type"
              text="No adjustment keeps the initial rate. Scheduled mode applies a simplified percentage-point change at each boundary: an assumption, not a market forecast."
            />
          </label>
          <select
            id="heloc-adj-type"
            className={selectClass}
            value={input.adjustmentType}
            onChange={(e) =>
              set({
                adjustmentType: e.target.value as HelocAdjustmentType,
              })
            }
          >
            <option value="none">No adjustment</option>
            <option value="scheduled">Percentage-point schedule</option>
          </select>
        </div>

        {showAdj ? (
          <>
            <div>
              <label htmlFor="heloc-adj-amt" className={labelClass}>
                Expected adjustment
                <InfoTooltip
                  label="Expected adjustment"
                  text="Percentage-point change at each adjustment (e.g. 0.5 means +0.5 pp, not a 0.5% relative increase). Negative values lower the rate."
                />
              </label>
              <FieldShell error={errors.expectedRateAdjustment}>
                <input
                  id="heloc-adj-amt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.expectedRateAdjustment}
                  onChange={(e) =>
                    set({ expectedRateAdjustment: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.expectedRateAdjustment)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  pp
                </span>
              </FieldShell>
              {errors.expectedRateAdjustment ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.expectedRateAdjustment}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="heloc-first-adj" className={labelClass}>
                First adjustment after
              </label>
              <FieldShell error={errors.firstAdjustmentAfterYears}>
                <input
                  id="heloc-first-adj"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.firstAdjustmentAfterYears}
                  onChange={(e) =>
                    set({ firstAdjustmentAfterYears: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.firstAdjustmentAfterYears)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  years
                </span>
              </FieldShell>
              {errors.firstAdjustmentAfterYears ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.firstAdjustmentAfterYears}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="heloc-interval" className={labelClass}>
                Period between adjustments
              </label>
              <FieldShell error={errors.adjustmentIntervalMonths}>
                <input
                  id="heloc-interval"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.adjustmentIntervalMonths}
                  onChange={(e) =>
                    set({ adjustmentIntervalMonths: e.target.value })
                  }
                  placeholder="12"
                  aria-invalid={Boolean(errors.adjustmentIntervalMonths)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  months
                </span>
              </FieldShell>
              {errors.adjustmentIntervalMonths ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.adjustmentIntervalMonths}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="heloc-cap" className={labelClass}>
                Maximum projected interest rate
                <InfoTooltip
                  label="Maximum projected interest rate"
                  text="Lifetime ceiling in this simplified model. Real HELOCs may use separate periodic caps, floors, index, and margin rules."
                />
              </label>
              <FieldShell error={errors.maximumInterestRate}>
                <input
                  id="heloc-cap"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.maximumInterestRate}
                  onChange={(e) =>
                    set({ maximumInterestRate: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.maximumInterestRate)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.maximumInterestRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.maximumInterestRate}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Initial rate applies for the full draw and repayment term.
          </p>
        )}
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
