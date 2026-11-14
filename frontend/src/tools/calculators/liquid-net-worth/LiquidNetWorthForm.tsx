'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LiquidNetWorthFieldErrors,
  LiquidNetWorthInput,
  LiquidNetWorthResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(
  amount: number,
  currency: LiquidNetWorthInput['currency'],
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface LiquidNetWorthDraft {
  totalLiquidAssets: string;
  totalLiabilities: string;
  currency: LiquidNetWorthInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(
  currency: LiquidNetWorthInput['currency'] = 'PKR',
): LiquidNetWorthDraft {
  return {
    totalLiquidAssets: '',
    totalLiabilities: '',
    currency,
  };
}

export function draftToInput(draft: LiquidNetWorthDraft): LiquidNetWorthInput {
  return {
    totalLiquidAssets: parseOptionalNumber(draft.totalLiquidAssets),
    totalLiabilities: parseOptionalNumber(draft.totalLiabilities),
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
  currency: LiquidNetWorthInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: LiquidNetWorthInput['currency']) => void;
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

interface LiquidNetWorthFormProps {
  draft: LiquidNetWorthDraft;
  errors: LiquidNetWorthFieldErrors;
  result: LiquidNetWorthResult | null;
  onDraftChange: (draft: LiquidNetWorthDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function LiquidNetWorthForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: LiquidNetWorthFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<LiquidNetWorthDraft>) => onDraftChange({ ...draft, ...patch });
  const setCurrency = (currency: LiquidNetWorthDraft['currency']) => set({ currency });

  return (
    <form className="space-y-3.5" onSubmit={onSubmit} noValidate autoComplete="off">
      <MoneyRow
        id="lnw-assets"
        label="Total liquid assets"
        tip="Cash and near-cash holdings you can convert quickly — checking, savings, money market, and similar liquid accounts."
        value={draft.totalLiquidAssets}
        error={errors.totalLiquidAssets}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(totalLiquidAssets) => set({ totalLiquidAssets })}
        onCurrencyChange={setCurrency}
      />
      <MoneyRow
        id="lnw-liabilities"
        label="Total liabilities"
        tip="Debts and obligations you still owe — credit cards, loans, bills due, and similar liabilities."
        value={draft.totalLiabilities}
        error={errors.totalLiabilities}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(totalLiabilities) => set({ totalLiabilities })}
        onCurrencyChange={setCurrency}
      />
      <MoneyRow
        id="lnw-result"
        label="Liquid net worth"
        tip="Total liquid assets minus total liabilities. A negative value means liabilities exceed liquid assets."
        value=""
        symbol={symbol}
        currency={draft.currency}
        onCurrencyChange={setCurrency}
        readOnly
        displayValue={
          result ? formatPlainMoney(result.liquidNetWorth, result.currency) : '—'
        }
      />

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
