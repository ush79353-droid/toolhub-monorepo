'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  OperatingAssetTurnoverFieldErrors,
  OperatingAssetTurnoverInput,
  OperatingAssetTurnoverResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(
  amount: number,
  currency: OperatingAssetTurnoverInput['currency'],
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

function formatTurnover(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export interface OperatingAssetTurnoverDraft {
  cash: string;
  accountsReceivable: string;
  inventory: string;
  prepaidExpenses: string;
  fixedAssets: string;
  sales: string;
  currency: OperatingAssetTurnoverInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(
  currency: OperatingAssetTurnoverInput['currency'] = 'PKR',
): OperatingAssetTurnoverDraft {
  return {
    cash: '',
    accountsReceivable: '',
    inventory: '',
    prepaidExpenses: '',
    fixedAssets: '',
    sales: '',
    currency,
  };
}

export function draftToInput(draft: OperatingAssetTurnoverDraft): OperatingAssetTurnoverInput {
  return {
    cash: parseOptionalNumber(draft.cash),
    accountsReceivable: parseOptionalNumber(draft.accountsReceivable),
    inventory: parseOptionalNumber(draft.inventory),
    prepaidExpenses: parseOptionalNumber(draft.prepaidExpenses),
    fixedAssets: parseOptionalNumber(draft.fixedAssets),
    sales: parseOptionalNumber(draft.sales),
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
  currency: OperatingAssetTurnoverInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: OperatingAssetTurnoverInput['currency']) => void;
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

interface OperatingAssetTurnoverFormProps {
  draft: OperatingAssetTurnoverDraft;
  errors: OperatingAssetTurnoverFieldErrors;
  result: OperatingAssetTurnoverResult | null;
  onDraftChange: (draft: OperatingAssetTurnoverDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function OperatingAssetTurnoverForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: OperatingAssetTurnoverFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<OperatingAssetTurnoverDraft>) =>
    onDraftChange({ ...draft, ...patch });
  const setCurrency = (currency: OperatingAssetTurnoverDraft['currency']) => set({ currency });

  const turnoverDisplay =
    result?.operatingAssetTurnover === null || result?.operatingAssetTurnover === undefined
      ? '—'
      : formatTurnover(result.operatingAssetTurnover);

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate autoComplete="off">
      <section
        aria-labelledby="oat-assets-heading"
        className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      >
        <h3 id="oat-assets-heading" className="text-sm font-semibold text-accent">
          Operating assets
        </h3>
        <MoneyRow
          id="oat-cash"
          label="Cash"
          tip="Cash and cash equivalents used in operations."
          value={draft.cash}
          error={errors.cash}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(cash) => set({ cash })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="oat-ar"
          label="Accounts receivable"
          tip="Amounts customers owe for goods or services already delivered."
          value={draft.accountsReceivable}
          error={errors.accountsReceivable}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(accountsReceivable) => set({ accountsReceivable })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="oat-inventory"
          label="Inventory"
          tip="Goods held for sale or used in production."
          value={draft.inventory}
          error={errors.inventory}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(inventory) => set({ inventory })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="oat-prepaid"
          label="Prepaid expenses"
          tip="Operating costs paid in advance that still have future benefit."
          value={draft.prepaidExpenses}
          error={errors.prepaidExpenses}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(prepaidExpenses) => set({ prepaidExpenses })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="oat-fixed"
          label="Fixed assets"
          tip="Long-lived operating assets such as property, plant, and equipment."
          value={draft.fixedAssets}
          error={errors.fixedAssets}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(fixedAssets) => set({ fixedAssets })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="oat-operating-assets"
          label="Operating assets"
          tip="Cash + accounts receivable + inventory + prepaid expenses + fixed assets."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={
            result ? formatPlainMoney(result.operatingAssets, result.currency) : '—'
          }
        />
      </section>

      <section
        aria-labelledby="oat-turnover-heading"
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
      >
        <h3 id="oat-turnover-heading" className="text-sm font-semibold text-accent">
          Operating asset turnover
        </h3>
        <MoneyRow
          id="oat-sales"
          label="Sales"
          tip="Net sales (revenue) for the same period as the operating assets snapshot."
          value={draft.sales}
          error={errors.sales}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(sales) => set({ sales })}
          onCurrencyChange={setCurrency}
        />
        <div>
          <label className={labelClass} htmlFor="oat-turnover">
            <span>Operating asset turnover</span>
            <InfoTooltip
              label="Operating asset turnover"
              text="Sales ÷ operating assets. Shown as a multiple (×). Blank when operating assets are zero."
            />
          </label>
          <div className="relative">
            <FieldShell>
              <output
                id="oat-turnover"
                className={`${inputClass} flex items-center pr-8 font-semibold text-primary`}
                aria-live="polite"
              >
                {turnoverDisplay}
              </output>
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
              ×
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
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
