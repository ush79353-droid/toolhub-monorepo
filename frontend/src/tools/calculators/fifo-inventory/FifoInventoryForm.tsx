'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import type {
  FifoInventoryFieldErrors,
  FifoInventoryInput,
  FifoInventoryResult,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-4 rounded-xl border border-border bg-muted/20 p-4';

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface FifoInventoryFormProps {
  input: FifoInventoryInput;
  errors: FifoInventoryFieldErrors;
  result: FifoInventoryResult | null;
  onChange: (input: FifoInventoryInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function FifoInventoryForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: FifoInventoryFormProps) {
  const [boughtOpen, setBoughtOpen] = React.useState(true);
  const [soldOpen, setSoldOpen] = React.useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FifoInventoryInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof FifoInventoryInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<FifoInventoryInput>);
  };

  const moneyField = (
    key: 'batch1Price' | 'batch2Price' | 'sellingPrice',
    id: string,
    label: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input[key])}
            aria-invalid={Boolean(errors[key])}
            onChange={onNumber(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const qtyField = (
    key: 'batch1Qty' | 'batch2Qty' | 'unitsSold',
    id: string,
    label: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <FieldShell error={errors[key]}>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={numberOrBlank(input[key])}
          aria-invalid={Boolean(errors[key])}
          onChange={onNumber(key)}
        />
      </FieldShell>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={boughtOpen}
          onClick={() => setBoughtOpen((open) => !open)}
        >
          Inventories bought
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${boughtOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {boughtOpen ? (
          <div className="space-y-4 border-t border-border px-4 py-4">
            {moneyField('batch1Price', 'fifo-b1-price', '1st units purchased price')}
            {qtyField('batch1Qty', 'fifo-b1-qty', 'Number of units purchased 1st time')}
            {moneyField('batch2Price', 'fifo-b2-price', '2nd units purchased price')}
            {qtyField('batch2Qty', 'fifo-b2-qty', 'Number of units purchased 2nd time')}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={soldOpen}
          onClick={() => setSoldOpen((open) => !open)}
        >
          Units sold
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${soldOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {soldOpen ? (
          <div className="space-y-4 border-t border-border px-4 py-4">
            {qtyField('unitsSold', 'fifo-sold', 'Total units sold')}
            {moneyField('sellingPrice', 'fifo-sell', 'Selling price')}
          </div>
        ) : null}
      </div>

      <section className={sectionClass} aria-labelledby="fifo-results-heading">
        <h3 id="fifo-results-heading" className="text-[13px] font-semibold text-accent">
          Revenue and margin
        </h3>
        <div>
          <label className={labelClass} htmlFor="fifo-revenue">
            Revenues
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="fifo-revenue"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.revenueDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fifo-revenue-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Revenues currency"
              />
            </div>
          </div>
        </div>
        {result ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">FIFO COGS</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {symbol} {result.cogsDisplay}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">Gross profit</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {symbol} {result.profitDisplay}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">Gross margin</dt>
              <dd className="font-semibold tabular-nums text-accent">
                {result.marginDisplay ? `${result.marginDisplay}%` : '—'}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

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
