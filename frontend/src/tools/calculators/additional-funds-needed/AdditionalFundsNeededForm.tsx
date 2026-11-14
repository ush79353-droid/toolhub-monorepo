'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { AfnFieldErrors, AfnInput, AfnResult } from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(amount: number, currency: AfnInput['currency']): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface AfnDraft {
  changeInAssets: string;
  changeInLiabilities: string;
  changeInRetainedEarnings: string;
  currency: AfnInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function formatAmount(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '' : String(value);
}

export function inputToDraft(input: AfnInput): AfnDraft {
  return {
    changeInAssets: formatAmount(input.changeInAssets),
    changeInLiabilities: formatAmount(input.changeInLiabilities),
    changeInRetainedEarnings: formatAmount(input.changeInRetainedEarnings),
    currency: input.currency,
  };
}

export function draftToInput(draft: AfnDraft): AfnInput {
  return {
    changeInAssets: parseOptionalNumber(draft.changeInAssets),
    changeInLiabilities: parseOptionalNumber(draft.changeInLiabilities),
    changeInRetainedEarnings: parseOptionalNumber(draft.changeInRetainedEarnings),
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
  currency: AfnInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: AfnInput['currency']) => void;
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

interface AfnFormProps {
  draft: AfnDraft;
  errors: AfnFieldErrors;
  result: AfnResult | null;
  onDraftChange: (draft: AfnDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function AdditionalFundsNeededForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: AfnFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<AfnDraft>) => onDraftChange({ ...draft, ...patch });
  const setCurrency = (currency: AfnDraft['currency']) => set({ currency });

  return (
    <form className="space-y-3.5" onSubmit={onSubmit} noValidate autoComplete="off">
      <MoneyRow
        id="afn-assets"
        label="Change in assets"
        tip="Increase (or decrease) in total assets for the planning period. Asset growth usually requires financing."
        value={draft.changeInAssets}
        error={errors.changeInAssets}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(changeInAssets) => set({ changeInAssets })}
        onCurrencyChange={setCurrency}
      />
      <MoneyRow
        id="afn-liabilities"
        label="Change in liabilities"
        tip="Increase in spontaneous liabilities such as accounts payable or accruals. This is internal financing from the liability side."
        value={draft.changeInLiabilities}
        error={errors.changeInLiabilities}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(changeInLiabilities) => set({ changeInLiabilities })}
        onCurrencyChange={setCurrency}
      />
      <MoneyRow
        id="afn-retained"
        label="Change in retained earnings"
        tip="Addition to retained earnings for the period — profit kept in the business after dividends. This is internal equity financing."
        value={draft.changeInRetainedEarnings}
        error={errors.changeInRetainedEarnings}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(changeInRetainedEarnings) => set({ changeInRetainedEarnings })}
        onCurrencyChange={setCurrency}
      />
      <MoneyRow
        id="afn-result"
        label="Additional funds needed"
        tip="AFN = change in assets − change in liabilities − change in retained earnings. Positive means external financing is indicated; negative means a surplus."
        value=""
        symbol={symbol}
        currency={draft.currency}
        onCurrencyChange={setCurrency}
        readOnly
        displayValue={
          result ? formatPlainMoney(result.additionalFundsNeeded, result.currency) : '—'
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="h-11 flex-1 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
