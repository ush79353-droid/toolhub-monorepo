'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RetainedEarningsFieldErrors,
  RetainedEarningsInput,
  RetainedEarningsResult,
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

interface RetainedEarningsFormProps {
  input: RetainedEarningsInput;
  errors: RetainedEarningsFieldErrors;
  result: RetainedEarningsResult | null;
  onChange: (input: RetainedEarningsInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RetainedEarningsForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: RetainedEarningsFormProps) {
  const [divOpen, setDivOpen] = useState(true);
  const [reOpen, setReOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const negativeRe =
    result != null && result.retainedEarnings < 0;

  const set = (patch: Partial<RetainedEarningsInput>) => {
    onChange({ ...input, ...patch });
  };

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
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for retained earnings amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX). Use net income after tax.
        Enter payout as a percent (30 means 30%). Positive earnings required
        for the conventional payout path.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <CollapsibleSection
        title="Dividends distributed"
        open={divOpen}
        onToggle={() => setDivOpen((o) => !o)}
      >
        <div>
          <label htmlFor="re-earnings" className={labelClass}>
            Earnings
            <InfoTooltip
              label="Earnings"
              text="Net income for the reporting period after operating expenses, interest, and taxes."
            />
          </label>
          <FieldShell error={errors.earnings}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="re-earnings"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.earnings}
              onChange={(e) => set({ earnings: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.earnings)}
            />
          </FieldShell>
          {errors.earnings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.earnings}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="re-payout" className={labelClass}>
            Dividend payout ratio
            <InfoTooltip
              label="Dividend payout ratio"
              text="Percent of positive net income distributed as dividends (30 means 30%). Values above 100% are allowed with a warning."
            />
          </label>
          <FieldShell error={errors.dividendPayoutRatio}>
            <input
              id="re-payout"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.dividendPayoutRatio}
              onChange={(e) => set({ dividendPayoutRatio: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.dividendPayoutRatio)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.dividendPayoutRatio ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.dividendPayoutRatio}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="re-div" className={labelClass}>
            Dividends distributed
            <InfoTooltip
              label="Dividends distributed"
              text="Earnings × (payout ratio ÷ 100)."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="re-div"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedDividends ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Retained earnings"
        open={reOpen}
        onToggle={() => setReOpen((o) => !o)}
      >
        <div>
          <label htmlFor="re-re" className={labelClass}>
            Retained earnings
            <InfoTooltip
              label="Retained earnings"
              text="Current-period earnings retained: Earnings − Dividends. Not the cumulative equity balance without beginning RE."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="re-re"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default ${
                negativeRe ? 'text-rose-700' : 'text-muted-foreground'
              }`}
              value={result?.formattedRetainedEarnings ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        <div>
          <label htmlFor="re-shares" className={labelClass}>
            Number of shares outstanding
            <InfoTooltip
              label="Number of shares outstanding"
              text="Whole number of shares used for retained earnings per share."
            />
          </label>
          <FieldShell error={errors.sharesOutstanding}>
            <input
              id="re-shares"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.sharesOutstanding}
              onChange={(e) => set({ sharesOutstanding: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.sharesOutstanding)}
            />
          </FieldShell>
          {errors.sharesOutstanding ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sharesOutstanding}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="re-reps" className={labelClass}>
            Retained earnings per share
            <InfoTooltip
              label="Retained earnings per share"
              text="Current-period retained earnings ÷ shares outstanding. Not the same as EPS."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="re-reps"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result?.formattedRetainedEarningsPerShare
                  ? `${result.formattedRetainedEarningsPerShare}/share`
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
