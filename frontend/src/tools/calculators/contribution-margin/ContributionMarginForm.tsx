'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ContributionMarginFieldErrors,
  ContributionMarginInput,
  ContributionMarginResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(amount: number, currency: ContributionMarginInput['currency']): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export interface ContributionMarginDraft {
  sellingPricePerUnit: string;
  variableCostPerUnit: string;
  numberOfUnits: string;
  fixedCosts: string;
  currency: ContributionMarginInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function formatAmount(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '' : String(value);
}

export function emptyDraft(
  currency: ContributionMarginInput['currency'] = 'PKR',
): ContributionMarginDraft {
  return {
    sellingPricePerUnit: '',
    variableCostPerUnit: '',
    numberOfUnits: '',
    fixedCosts: '',
    currency,
  };
}

export function inputToDraft(input: ContributionMarginInput): ContributionMarginDraft {
  return {
    sellingPricePerUnit: formatAmount(input.sellingPricePerUnit),
    variableCostPerUnit: formatAmount(input.variableCostPerUnit),
    numberOfUnits: formatAmount(input.numberOfUnits),
    fixedCosts: formatAmount(input.fixedCosts),
    currency: input.currency,
  };
}

export function draftToInput(draft: ContributionMarginDraft): ContributionMarginInput {
  return {
    sellingPricePerUnit: parseOptionalNumber(draft.sellingPricePerUnit),
    variableCostPerUnit: parseOptionalNumber(draft.variableCostPerUnit),
    numberOfUnits: parseOptionalNumber(draft.numberOfUnits),
    fixedCosts: parseOptionalNumber(draft.fixedCosts),
    currency: draft.currency,
  };
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function MoneyRow({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValueChange,
  onCurrencyChange,
  readOnly = false,
  displayValue,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  currency: ContributionMarginInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: ContributionMarginInput['currency']) => void;
  readOnly?: boolean;
  displayValue?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex items-center gap-2">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          {readOnly ? (
            <output
              id={id}
              className={`${inputClass} flex items-center font-semibold text-primary`}
              aria-live="polite"
            >
              {displayValue ?? '—'}
            </output>
          ) : (
            <input
              id={id}
              inputMode="decimal"
              placeholder=""
              className={inputClass}
              value={value}
              onChange={(event) => onValueChange?.(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          )}
        </FieldShell>
        <div className="w-[120px] shrink-0 sm:w-[130px]">
          <CurrencySelect
            id={`${id}-currency`}
            aria-label={`${label} currency`}
            value={currency}
            onChange={onCurrencyChange}
          />
        </div>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ContributionMarginFormProps {
  draft: ContributionMarginDraft;
  errors: ContributionMarginFieldErrors;
  result: ContributionMarginResult | null;
  onDraftChange: (draft: ContributionMarginDraft) => void;
  onCurrencyChange: (currency: ContributionMarginInput['currency']) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function ContributionMarginForm({
  draft,
  errors,
  result,
  onDraftChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: ContributionMarginFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<ContributionMarginDraft>) => onDraftChange({ ...draft, ...patch });

  const ratioDisplay =
    result?.contributionMarginRatioPercent === null ||
    result?.contributionMarginRatioPercent === undefined
      ? '—'
      : formatPercent(result.contributionMarginRatioPercent);

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate autoComplete="off">
      <section
        aria-labelledby="cm-data-heading"
        className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      >
        <h3 id="cm-data-heading" className="text-sm font-semibold text-accent">
          Data provided
        </h3>
        <MoneyRow
          id="cm-selling-price"
          label="Selling price per unit"
          tip="Price charged for one unit before subtracting variable cost."
          value={draft.sellingPricePerUnit}
          error={errors.sellingPricePerUnit}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(sellingPricePerUnit) => set({ sellingPricePerUnit })}
          onCurrencyChange={onCurrencyChange}
        />
        <MoneyRow
          id="cm-variable-cost"
          label="Variable cost per unit"
          tip="Cost that changes with each unit produced or sold."
          value={draft.variableCostPerUnit}
          error={errors.variableCostPerUnit}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(variableCostPerUnit) => set({ variableCostPerUnit })}
          onCurrencyChange={onCurrencyChange}
        />
        <div>
          <label className={labelClass} htmlFor="cm-units">
            <span>Number of units</span>
            <InfoTooltip
              label="Number of units"
              text="Units sold or produced in the same period as the fixed costs."
            />
          </label>
          <FieldShell error={errors.numberOfUnits}>
            <input
              id="cm-units"
              inputMode="decimal"
              placeholder=""
              className={inputClass}
              value={draft.numberOfUnits}
              onChange={(event) => set({ numberOfUnits: event.target.value })}
              aria-invalid={Boolean(errors.numberOfUnits)}
              aria-describedby={errors.numberOfUnits ? 'cm-units-error' : undefined}
            />
          </FieldShell>
          {errors.numberOfUnits ? (
            <p id="cm-units-error" className="mt-1 text-xs text-rose-600">
              {errors.numberOfUnits}
            </p>
          ) : null}
        </div>
        <MoneyRow
          id="cm-fixed-costs"
          label="Fixed costs"
          tip="Costs that stay the same regardless of how many units you sell in the period."
          value={draft.fixedCosts}
          error={errors.fixedCosts}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(fixedCosts) => set({ fixedCosts })}
          onCurrencyChange={onCurrencyChange}
        />
      </section>

      <section
        aria-labelledby="cm-results-heading"
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
      >
        <h3 id="cm-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>
        <MoneyRow
          id="cm-contribution-margin"
          label="Contribution margin"
          tip="(Selling price per unit − Variable cost per unit) × Number of units."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={onCurrencyChange}
          readOnly
          displayValue={
            result ? formatPlainMoney(result.contributionMargin, result.currency) : '—'
          }
        />
        <div>
          <label className={labelClass} htmlFor="cm-ratio">
            <span>Contribution margin ratio</span>
            <InfoTooltip
              label="Contribution margin ratio"
              text="((Selling price − Variable cost) ÷ Selling price) × 100. Blank when selling price is zero."
            />
          </label>
          <div className="relative">
            <FieldShell>
              <output
                id="cm-ratio"
                className={`${inputClass} flex items-center pr-8 font-semibold text-primary`}
                aria-live="polite"
              >
                {ratioDisplay}
              </output>
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
              %
            </span>
          </div>
        </div>
        <MoneyRow
          id="cm-profit"
          label="Profit generated"
          tip="Contribution margin − Fixed costs. Negative values mean a loss for the period."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={onCurrencyChange}
          readOnly
          displayValue={result ? formatPlainMoney(result.profitGenerated, result.currency) : '—'}
        />
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
