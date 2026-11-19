'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LossRatioFieldErrors,
  LossRatioInput,
  LossRatioResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface LossRatioFormProps {
  input: LossRatioInput;
  errors: LossRatioFieldErrors;
  result: LossRatioResult | null;
  onChange: (input: LossRatioInput) => void;
  onCurrencyChange: (currency: LossRatioInput['currency']) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function LossRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
  onClear,
  onReset,
}: LossRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setField = (
    field: 'premiumsEarned' | 'claimsPaid' | 'lossAdjustmentExpenses',
    value: string,
  ) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Insurance loss ratio from earned premiums, claims paid, and loss adjustment expenses.
        Currency changes the display symbol only — amounts are not converted.
      </p>

      <div>
        <label className={labelClass} htmlFor="lr-currency">
          <span>Display currency</span>
        </label>
        <CurrencySelect
          id="lr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Display currency"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={input.financialOpen}
          onClick={() => onChange({ ...input, financialOpen: !input.financialOpen })}
        >
          <span>Financial results</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              input.financialOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>

        {input.financialOpen ? (
          <form
            className="space-y-3.5 border-t border-border px-3.5 py-3"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
          >
            <div>
              <label className={labelClass} htmlFor="lr-premiums">
                <span>Total premiums earned</span>
                <InfoTooltip
                  label="Total premiums earned"
                  text="Enter the insurance premiums earned during the reporting period. Use earned premiums rather than total written premiums."
                />
              </label>
              <FieldShell error={errors.premiumsEarned}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="lr-premiums"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.premiumsEarned}
                  aria-invalid={Boolean(errors.premiumsEarned)}
                  onChange={(e) => setField('premiumsEarned', e.target.value)}
                />
              </FieldShell>
              {errors.premiumsEarned ? (
                <p className="mt-1 text-xs text-rose-600">{errors.premiumsEarned}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-claims">
                <span>Insurance claims paid</span>
                <InfoTooltip
                  label="Insurance claims paid"
                  text="Enter the total insurance claim payments for the selected reporting period."
                />
              </label>
              <FieldShell error={errors.claimsPaid}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="lr-claims"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.claimsPaid}
                  aria-invalid={Boolean(errors.claimsPaid)}
                  onChange={(e) => setField('claimsPaid', e.target.value)}
                />
              </FieldShell>
              {errors.claimsPaid ? (
                <p className="mt-1 text-xs text-rose-600">{errors.claimsPaid}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="lr-lae">
                <span>Loss adjustment expenses</span>
                <InfoTooltip
                  label="Loss adjustment expenses"
                  text="Enter the expenses associated with investigating, managing, adjusting, and settling insurance claims."
                />
              </label>
              <FieldShell error={errors.lossAdjustmentExpenses}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="lr-lae"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lossAdjustmentExpenses}
                  aria-invalid={Boolean(errors.lossAdjustmentExpenses)}
                  onChange={(e) => setField('lossAdjustmentExpenses', e.target.value)}
                />
              </FieldShell>
              {errors.lossAdjustmentExpenses ? (
                <p className="mt-1 text-xs text-rose-600">{errors.lossAdjustmentExpenses}</p>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Loss ratio</h3>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">Loss ratio</p>
          <FieldShell className="bg-muted/30">
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result?.formattedLossRatio ?? ''}
              aria-readonly="true"
              aria-label="Loss ratio percentage"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>

        {result ? (
          <>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.interpretation}
            </p>
            <div className="rounded-lg border border-border bg-white px-3 py-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Insurance loss ratio summary
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground/90">
                <li>
                  Earned premiums: {symbol}
                  {result.formattedPremiumsEarned}
                </li>
                <li>
                  Claims paid: {symbol}
                  {result.formattedClaimsPaid}
                </li>
                <li>
                  Loss adjustment expenses: {symbol}
                  {result.formattedLossAdjustmentExpenses}
                </li>
                <li>
                  Total loss-related costs: {symbol}
                  {result.formattedTotalLossRelatedCosts}
                </li>
                <li>Loss ratio: {result.formattedLossRatio}%</li>
                <li>
                  Premiums remaining after loss-related costs: {symbol}
                  {result.formattedPremiumsRemaining}
                </li>
              </ul>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Premiums remaining after loss-related costs are not equivalent to net income or
                underwriting profit.
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter earned premiums (greater than zero), claims paid, and loss adjustment expenses to
            calculate the loss ratio.
          </p>
        )}
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Example — 53% loss ratio
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
