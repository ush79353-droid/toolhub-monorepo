'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PriceQuantityFieldErrors,
  PriceQuantityInput,
  PriceQuantityResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(amount: number, currency: PriceQuantityInput['currency']): string {
  const digits = getCurrencyFractionDigits(currency);
  // Unit prices often need more than 2 decimals (e.g. 0.20).
  const maxDigits = Math.max(digits, 6);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  }).format(amount);
}

function formatMoneyFixed(amount: number, currency: PriceQuantityInput['currency']): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface PriceQuantityDraft {
  smallerQuantity: string;
  smallerPrice: string;
  largerQuantity: string;
  largerPrice: string;
  currency: PriceQuantityInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(currency: PriceQuantityInput['currency'] = 'PKR'): PriceQuantityDraft {
  return {
    smallerQuantity: '',
    smallerPrice: '',
    largerQuantity: '',
    largerPrice: '',
    currency,
  };
}

export function draftToInput(draft: PriceQuantityDraft): PriceQuantityInput {
  return {
    smallerQuantity: parseOptionalNumber(draft.smallerQuantity),
    smallerPrice: parseOptionalNumber(draft.smallerPrice),
    largerQuantity: parseOptionalNumber(draft.largerQuantity),
    largerPrice: parseOptionalNumber(draft.largerPrice),
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
  suffix,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  currency: PriceQuantityInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: PriceQuantityInput['currency']) => void;
  readOnly?: boolean;
  displayValue?: string;
  suffix?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <FieldShell error={error}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            {readOnly ? (
              <output
                id={id}
                className={`${inputClass} flex items-center font-semibold text-primary ${
                  suffix ? 'pr-14' : ''
                }`}
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
          {suffix ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </div>
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

function QuantityRow({
  id,
  label,
  tip,
  value,
  error,
  onValueChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          inputMode="decimal"
          placeholder=""
          className={inputClass}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </FieldShell>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface PriceQuantityFormProps {
  draft: PriceQuantityDraft;
  errors: PriceQuantityFieldErrors;
  result: PriceQuantityResult | null;
  onDraftChange: (draft: PriceQuantityDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function PriceQuantityForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: PriceQuantityFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<PriceQuantityDraft>) => onDraftChange({ ...draft, ...patch });
  const setCurrency = (currency: PriceQuantityDraft['currency']) => set({ currency });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate autoComplete="off">
      <section
        aria-labelledby="pq-smaller-heading"
        className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      >
        <h3 id="pq-smaller-heading" className="text-sm font-semibold text-accent">
          Smaller product
        </h3>
        <QuantityRow
          id="pq-smaller-qty"
          label="Quantity"
          tip="Number of units in the smaller pack or product."
          value={draft.smallerQuantity}
          error={errors.smallerQuantity}
          onValueChange={(smallerQuantity) => set({ smallerQuantity })}
        />
        <MoneyRow
          id="pq-smaller-price"
          label="Price"
          tip="Total price paid for the smaller product."
          value={draft.smallerPrice}
          error={errors.smallerPrice}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(smallerPrice) => set({ smallerPrice })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="pq-smaller-ppu"
          label="Price / unit"
          tip="Smaller price divided by smaller quantity."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          suffix="/ unit"
          displayValue={result ? formatPlainMoney(result.smallerPricePerUnit, result.currency) : '—'}
        />
      </section>

      <section
        aria-labelledby="pq-larger-heading"
        className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      >
        <h3 id="pq-larger-heading" className="text-sm font-semibold text-accent">
          Larger product
        </h3>
        <QuantityRow
          id="pq-larger-qty"
          label="Quantity"
          tip="Number of units in the larger pack or product."
          value={draft.largerQuantity}
          error={errors.largerQuantity}
          onValueChange={(largerQuantity) => set({ largerQuantity })}
        />
        <MoneyRow
          id="pq-larger-price"
          label="Price"
          tip="Total price paid for the larger product."
          value={draft.largerPrice}
          error={errors.largerPrice}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(largerPrice) => set({ largerPrice })}
          onCurrencyChange={setCurrency}
        />
        <MoneyRow
          id="pq-larger-ppu"
          label="Price / unit"
          tip="Larger price divided by larger quantity."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          suffix="/ unit"
          displayValue={result ? formatPlainMoney(result.largerPricePerUnit, result.currency) : '—'}
        />
      </section>

      <section
        aria-labelledby="pq-savings-heading"
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
      >
        <h3 id="pq-savings-heading" className="text-sm font-semibold text-accent">
          Savings
        </h3>
        <MoneyRow
          id="pq-would-cost"
          label="Would have cost"
          tip="What the larger quantity would cost at the smaller product’s price per unit."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={result ? formatMoneyFixed(result.wouldHaveCost, result.currency) : '—'}
        />
        <MoneyRow
          id="pq-you-save"
          label="You save"
          tip="Would have cost minus the larger product’s price. Negative means the larger pack costs more per unit."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={result ? formatMoneyFixed(result.youSave, result.currency) : '—'}
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
