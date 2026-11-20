'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DownPaymentMode,
  PmiFieldErrors,
  PmiInput,
  PmiResult,
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

interface PmiFormProps {
  input: PmiInput;
  errors: PmiFieldErrors;
  result: PmiResult | null;
  onChange: (input: PmiInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PmiForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: PmiFormProps) {
  const [mortgageOpen, setMortgageOpen] = useState(true);
  const [pmiOpen, setPmiOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<PmiInput>) => {
    onChange({ ...input, ...patch });
  };

  const setDownPaymentMode = (mode: DownPaymentMode) => {
    if (mode === input.downPaymentMode) return;
    set({ downPaymentMode: mode });
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
          changes the symbol only — it does not convert values. US-style PMI
          rules are illustrative; they are not tied to the selected currency.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="pmi-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Mortgage specification"
        open={mortgageOpen}
        onToggle={() => setMortgageOpen((v) => !v)}
      >
        <div>
          <label htmlFor="pmi-home-price" className={labelClass}>
            <span>Home price</span>
            <InfoTooltip
              label="Home price"
              text="Purchase price or property valuation used for the initial loan-to-value ratio."
            />
          </label>
          <FieldShell error={errors.homePrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pmi-home-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.homePrice}
              aria-invalid={errors.homePrice ? true : undefined}
              onChange={(e) => set({ homePrice: e.target.value })}
            />
          </FieldShell>
          {errors.homePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.homePrice}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>Down payment</span>
          <div className="mb-2 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="pmi-dp-mode"
                className="h-4 w-4 accent-primary"
                checked={input.downPaymentMode === 'amount'}
                onChange={() => setDownPaymentMode('amount')}
              />
              Amount
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="pmi-dp-mode"
                className="h-4 w-4 accent-primary"
                checked={input.downPaymentMode === 'percentage'}
                onChange={() => setDownPaymentMode('percentage')}
              />
              Percentage
            </label>
          </div>

          {input.downPaymentMode === 'amount' ? (
            <>
              <FieldShell error={errors.downPaymentAmount}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="pmi-down-amount"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.downPaymentAmount}
                  aria-invalid={errors.downPaymentAmount ? true : undefined}
                  onChange={(e) => set({ downPaymentAmount: e.target.value })}
                />
              </FieldShell>
              {errors.downPaymentAmount ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.downPaymentAmount}
                </p>
              ) : null}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Down payment %:{' '}
                {result
                  ? `${result.formattedDownPaymentPercentage}%`
                  : '—'}
              </p>
            </>
          ) : (
            <>
              <FieldShell error={errors.downPaymentPercentage}>
                <input
                  id="pmi-down-pct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.downPaymentPercentage}
                  aria-invalid={
                    errors.downPaymentPercentage ? true : undefined
                  }
                  onChange={(e) =>
                    set({ downPaymentPercentage: e.target.value })
                  }
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.downPaymentPercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.downPaymentPercentage}
                </p>
              ) : null}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Down payment amount:{' '}
                {result
                  ? `${symbol}${result.formattedDownPaymentAmount}`
                  : '—'}
              </p>
            </>
          )}
        </div>

        <div>
          <label htmlFor="pmi-mortgage-amount" className={labelClass}>
            <span>Mortgage amount</span>
            <InfoTooltip
              label="Mortgage amount"
              text="Home price minus down payment. Read-only in this calculator."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pmi-mortgage-amount"
              type="text"
              className={inputClass}
              value={result?.formattedMortgageAmount ?? ''}
              readOnly
              aria-readonly
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="pmi-ltv" className={labelClass}>
            <span>Loan-to-value ratio</span>
            <InfoTooltip
              label="Loan-to-value ratio"
              text="LTV = (Mortgage amount / Home price) × 100."
            />
          </label>
          <FieldShell muted>
            <input
              id="pmi-ltv"
              type="text"
              className={inputClass}
              value={
                result ? `${result.formattedLoanToValueRatio}%` : ''
              }
              readOnly
              aria-readonly
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="PMI calculations"
        open={pmiOpen}
        onToggle={() => setPmiOpen((v) => !v)}
      >
        <div>
          <label htmlFor="pmi-annual-rate" className={labelClass}>
            <span>Annual rate</span>
            <InfoTooltip
              label="Annual PMI rate"
              text="Assumed annual PMI premium percentage applied to the mortgage amount. Actual pricing depends on coverage, LTV, credit, loan structure, and insurer or lender requirements — not a quote."
            />
          </label>
          <FieldShell error={errors.annualPmiRate}>
            <input
              id="pmi-annual-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.annualPmiRate}
              aria-invalid={errors.annualPmiRate ? true : undefined}
              onChange={(e) => set({ annualPmiRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.annualPmiRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualPmiRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pmi-annual" className={labelClass}>
            <span>Annual PMI</span>
            <InfoTooltip
              label="Annual PMI"
              text="Mortgage amount × (annual PMI rate / 100). Simplified estimate."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pmi-annual"
              type="text"
              className={inputClass}
              value={result?.formattedAnnualPmi ?? ''}
              readOnly
              aria-readonly
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="pmi-monthly" className={labelClass}>
            <span>Monthly PMI</span>
            <InfoTooltip
              label="Monthly PMI"
              text="Annual PMI divided by 12. Simplified monthly estimate."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="pmi-monthly"
              type="text"
              className={inputClass}
              value={result?.formattedMonthlyPmi ?? ''}
              readOnly
              aria-readonly
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
