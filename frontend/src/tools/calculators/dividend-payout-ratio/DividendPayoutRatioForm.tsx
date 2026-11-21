'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DividendPayoutRatioFieldErrors,
  DividendPayoutRatioInput,
  DividendPayoutRatioResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface DividendPayoutRatioFormProps {
  input: DividendPayoutRatioInput;
  errors: DividendPayoutRatioFieldErrors;
  result: DividendPayoutRatioResult | null;
  onChange: (input: DividendPayoutRatioInput) => void;
  onTotalDividendsCurrencyChange: (next: SupportedCurrency) => void;
  onNetIncomeCurrencyChange: (next: SupportedCurrency) => void;
  onDeclaredDpsCurrencyChange: (next: SupportedCurrency) => void;
  onDilutedEpsCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function DividendPayoutRatioForm({
  input,
  errors,
  result,
  onChange,
  onTotalDividendsCurrencyChange,
  onNetIncomeCurrencyChange,
  onDeclaredDpsCurrencyChange,
  onDilutedEpsCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: DividendPayoutRatioFormProps) {
  const dividendsSymbol = getCurrencySymbol(input.totalDividendsCurrency);
  const incomeSymbol = getCurrencySymbol(input.netIncomeCurrency);
  const dpsSymbol = getCurrencySymbol(input.declaredDpsCurrency);
  const epsSymbol = getCurrencySymbol(input.dilutedEpsCurrency);

  const set = (patch: Partial<DividendPayoutRatioInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="dpr-total-dividends">
            <span>Total dividends</span>
            <InfoTooltip
              label="Total dividends"
              text="Cash dividends paid for the same period as net income. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalDividends}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {dividendsSymbol}
              </span>
              <input
                id="dpr-total-dividends"
                className={inputClass}
                inputMode="decimal"
                value={input.totalDividends}
                aria-invalid={Boolean(errors.totalDividends)}
                onChange={(e) => set({ totalDividends: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dpr-total-dividends-currency"
                value={input.totalDividendsCurrency}
                onChange={onTotalDividendsCurrencyChange}
                aria-label="Total dividends currency"
              />
            </div>
          </div>
          {errors.totalDividends ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalDividends}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpr-net-income">
            <span>Net income</span>
            <InfoTooltip
              label="Net income"
              text="Earnings for the same period as total dividends. Zero net income makes the company payout ratio undefined. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.netIncome}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {incomeSymbol}
              </span>
              <input
                id="dpr-net-income"
                className={inputClass}
                inputMode="decimal"
                value={input.netIncome}
                aria-invalid={Boolean(errors.netIncome)}
                onChange={(e) => set({ netIncome: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dpr-net-income-currency"
                value={input.netIncomeCurrency}
                onChange={onNetIncomeCurrencyChange}
                aria-label="Net income currency"
              />
            </div>
          </div>
          {errors.netIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dpr-payout-ratio">
            <span>Dividend payout ratio</span>
            <InfoTooltip
              label="Dividend payout ratio"
              text="Total dividends ÷ net income × 100. Never FX-converted. Above 100% and negative values are allowed with explanation."
            />
          </label>
          <FieldShell muted>
            <input
              id="dpr-payout-ratio"
              className={`${inputClass} pr-8`}
              readOnly
              tabIndex={-1}
              value={result?.formattedPayoutRatioPercent ?? ''}
              aria-live="polite"
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {result?.payoutRatioPercent !== null && result?.isAbove100 ? (
            <p className="mt-1 text-xs text-amber-700">
              Payout above 100% means dividends exceed net income for this period.
            </p>
          ) : null}
          {result?.payoutRatioPercent !== null && result?.isNegative ? (
            <p className="mt-1 text-xs text-amber-700">
              Negative payout is a diagnostic when dividends and net income have
 opposite signs; not a conventional sustainable payout target.
            </p>
          ) : null}
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.perShareOpen}
        onToggle={(event) => set({ perShareOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.perShareOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Per share calculation</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="dpr-declared-dps">
              <span>Declared dividends per share</span>
              <InfoTooltip
                label="Declared dividends per share"
                text="Dividends declared per share for the same period as diluted EPS. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.declaredDps}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {dpsSymbol}
                </span>
                <input
                  id="dpr-declared-dps"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.declaredDps}
                  aria-invalid={Boolean(errors.declaredDps)}
                  onChange={(e) => set({ declaredDps: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="dpr-declared-dps-currency"
                  value={input.declaredDpsCurrency}
                  onChange={onDeclaredDpsCurrencyChange}
                  aria-label="Declared dividends per share currency"
                />
              </div>
            </div>
            {errors.declaredDps ? (
              <p className="mt-1 text-xs text-rose-600">{errors.declaredDps}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="dpr-diluted-eps">
              <span>Diluted EPS</span>
              <InfoTooltip
                label="Diluted EPS"
                text="Diluted earnings per share for the same period as declared DPS. Zero diluted EPS makes the per-share payout undefined. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.dilutedEps}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {epsSymbol}
                </span>
                <input
                  id="dpr-diluted-eps"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.dilutedEps}
                  aria-invalid={Boolean(errors.dilutedEps)}
                  onChange={(e) => set({ dilutedEps: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="dpr-diluted-eps-currency"
                  value={input.dilutedEpsCurrency}
                  onChange={onDilutedEpsCurrencyChange}
                  aria-label="Diluted EPS currency"
                />
              </div>
            </div>
            {errors.dilutedEps ? (
              <p className="mt-1 text-xs text-rose-600">{errors.dilutedEps}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="dpr-payout-per-share">
              <span>Dividend payout ratio per share</span>
              <InfoTooltip
                label="Dividend payout ratio per share"
                text="Declared DPS ÷ diluted EPS × 100. Never FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="dpr-payout-per-share"
                className={`${inputClass} pr-8`}
                readOnly
                tabIndex={-1}
                value={result?.formattedPayoutPerSharePercent ?? ''}
                aria-live="polite"
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
            {result?.payoutPerSharePercent !== null && result?.isPerShareAbove100 ? (
              <p className="mt-1 text-xs text-amber-700">
                Per-share payout above 100% means DPS exceeds diluted EPS for this
                period.
              </p>
            ) : null}
            {result?.payoutPerSharePercent !== null && result?.isPerShareNegative ? (
              <p className="mt-1 text-xs text-amber-700">
                Negative per-share payout is a diagnostic when DPS and diluted EPS have
 opposite signs; not a conventional sustainable payout target.
              </p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.dilutedEpsOpen}
        onToggle={(event) => set({ dilutedEpsOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.dilutedEpsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Diluted earnings per share</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified diluted-EPS fields for this calculator. Enter
            diluted EPS above under Per share calculation.
          </p>
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

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
