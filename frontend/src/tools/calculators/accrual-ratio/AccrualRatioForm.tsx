'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AccrualRatioFieldErrors,
  AccrualRatioInput,
  AccrualRatioMethod,
  AccrualRatioResult,
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

interface AccrualRatioFormProps {
  input: AccrualRatioInput;
  errors: AccrualRatioFieldErrors;
  result: AccrualRatioResult | null;
  onChange: (input: AccrualRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function AccrualRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: AccrualRatioFormProps) {
  const [beginningOpen, setBeginningOpen] = useState(true);
  const [endingOpen, setEndingOpen] = useState(true);
  const [cashFlowOpen, setCashFlowOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<AccrualRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  const setMethod = (method: AccrualRatioMethod) => {
    if (method === input.method) return;
    set({ method });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. The accrual
          ratio is dimensionless when numerator and denominator share that
          currency.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="accrual-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>What type of accrual ratio</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="accrual-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'balanceSheet'}
              onChange={() => setMethod('balanceSheet')}
            />
            Balance sheet accrual ratio
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="accrual-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'cashFlow'}
              onChange={() => setMethod('cashFlow')}
            />
            Cash flow accrual ratio
          </label>
        </div>
      </fieldset>

      <CollapsibleSection
        title="Beginning net operating assets"
        open={beginningOpen}
        onToggle={() => setBeginningOpen((v) => !v)}
      >
        <div>
          <label htmlFor="accrual-beg-assets" className={labelClass}>
            <span>Beginning operating assets</span>
            <InfoTooltip
              label="Beginning operating assets"
              text="Assets used in operating activities at the start of the period (e.g. operating receivables, inventory, operating fixed assets under the classification you use)."
            />
          </label>
          <FieldShell error={errors.beginningOperatingAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-beg-assets"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.beginningOperatingAssets}
              aria-invalid={errors.beginningOperatingAssets ? true : undefined}
              onChange={(e) =>
                set({ beginningOperatingAssets: e.target.value })
              }
            />
          </FieldShell>
          {errors.beginningOperatingAssets ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.beginningOperatingAssets}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="accrual-beg-liab" className={labelClass}>
            <span>Beginning operating liabilities</span>
            <InfoTooltip
              label="Beginning operating liabilities"
              text="Operating obligations at period start — not financing liabilities — under your reporting classification."
            />
          </label>
          <FieldShell error={errors.beginningOperatingLiabilities}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-beg-liab"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.beginningOperatingLiabilities}
              aria-invalid={
                errors.beginningOperatingLiabilities ? true : undefined
              }
              onChange={(e) =>
                set({ beginningOperatingLiabilities: e.target.value })
              }
            />
          </FieldShell>
          {errors.beginningOperatingLiabilities ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.beginningOperatingLiabilities}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="accrual-beg-noa" className={labelClass}>
            <span>Beginning net operating assets</span>
            <InfoTooltip
              label="Beginning net operating assets"
              text="Beginning operating assets − beginning operating liabilities. Negative NOA is allowed when liabilities exceed assets."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-beg-noa"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedBeginningNOA ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Ending net operating assets"
        open={endingOpen}
        onToggle={() => setEndingOpen((v) => !v)}
      >
        <div>
          <label htmlFor="accrual-end-assets" className={labelClass}>
            <span>Ending operating assets</span>
            <InfoTooltip
              label="Ending operating assets"
              text="Operating assets at the end of the selected financial period."
            />
          </label>
          <FieldShell error={errors.endingOperatingAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-end-assets"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.endingOperatingAssets}
              aria-invalid={errors.endingOperatingAssets ? true : undefined}
              onChange={(e) => set({ endingOperatingAssets: e.target.value })}
            />
          </FieldShell>
          {errors.endingOperatingAssets ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.endingOperatingAssets}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="accrual-end-liab" className={labelClass}>
            <span>Ending operating liabilities</span>
            <InfoTooltip
              label="Ending operating liabilities"
              text="Operating liabilities at period end under your classification."
            />
          </label>
          <FieldShell error={errors.endingOperatingLiabilities}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-end-liab"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.endingOperatingLiabilities}
              aria-invalid={
                errors.endingOperatingLiabilities ? true : undefined
              }
              onChange={(e) =>
                set({ endingOperatingLiabilities: e.target.value })
              }
            />
          </FieldShell>
          {errors.endingOperatingLiabilities ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.endingOperatingLiabilities}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="accrual-end-noa" className={labelClass}>
            <span>Ending net operating assets</span>
            <InfoTooltip
              label="Ending net operating assets"
              text="Ending operating assets − ending operating liabilities."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="accrual-end-noa"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedEndingNOA ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {input.method === 'cashFlow' ? (
        <CollapsibleSection
          title="Earnings and operating cash flow"
          open={cashFlowOpen}
          onToggle={() => setCashFlowOpen((v) => !v)}
        >
          <div>
            <label htmlFor="accrual-ni" className={labelClass}>
              <span>Net income</span>
              <InfoTooltip
                label="Net income"
                text="Accounting profit or loss for the period. Negative values (losses) are allowed."
              />
            </label>
            <FieldShell error={errors.netIncome}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="accrual-ni"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.netIncome}
                aria-invalid={errors.netIncome ? true : undefined}
                onChange={(e) => set({ netIncome: e.target.value })}
              />
            </FieldShell>
            {errors.netIncome ? (
              <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="accrual-ocf" className={labelClass}>
              <span>Operating cash flow</span>
              <InfoTooltip
                label="Operating cash flow"
                text="Cash generated or used by operations. Negative operating cash flow is allowed."
              />
            </label>
            <FieldShell error={errors.operatingCashFlow}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="accrual-ocf"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.operatingCashFlow}
                aria-invalid={errors.operatingCashFlow ? true : undefined}
                onChange={(e) => set({ operatingCashFlow: e.target.value })}
              />
            </FieldShell>
            {errors.operatingCashFlow ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.operatingCashFlow}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="accrual-cfa" className={labelClass}>
              <span>Cash flow accruals</span>
              <InfoTooltip
                label="Cash flow accruals"
                text="Net income − operating cash flow."
              />
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="accrual-cfa"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default text-muted-foreground`}
                value={result?.formattedCashFlowAccruals ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </CollapsibleSection>
      ) : null}

      <div>
        <label htmlFor="accrual-ratio-out" className={labelClass}>
          <span>Accrual ratio</span>
          <InfoTooltip
            label="Accrual ratio"
            text={
              input.method === 'balanceSheet'
                ? 'Balance sheet: (Ending NOA − Beginning NOA) / Average NOA, shown as a percentage.'
                : 'Cash flow: (Net income − Operating cash flow) / Average NOA, shown as a percentage.'
            }
          />
        </label>
        <FieldShell muted>
          <input
            id="accrual-ratio-out"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={
              result?.formattedAccrualRatioPercent !== null &&
              result?.formattedAccrualRatioPercent
                ? `${result.formattedAccrualRatioPercent}%`
                : result?.status === 'zeroDenominator'
                  ? 'Unavailable'
                  : ''
            }
            aria-live="polite"
          />
        </FieldShell>
        {result?.warningMessage ? (
          <p className="mt-1 text-xs text-amber-700" role="status">
            {result.warningMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
