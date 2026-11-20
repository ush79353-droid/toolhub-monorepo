'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LifoInventoryFieldErrors,
  LifoInventoryInput,
  LifoInventoryResult,
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

interface LifoInventoryFormProps {
  input: LifoInventoryInput;
  errors: LifoInventoryFieldErrors;
  result: LifoInventoryResult | null;
  onChange: (input: LifoInventoryInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function LifoInventoryForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: LifoInventoryFormProps) {
  const [boughtOpen, setBoughtOpen] = useState(true);
  const [soldOpen, setSoldOpen] = useState(true);
  const [marginOpen, setMarginOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<LifoInventoryInput>) => {
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
          aria-label="Currency for purchase and selling prices"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. LIFO assigns newest purchase costs to COGS first —
        quantities use whole units.
      </p>

      <CollapsibleSection
        title="Inventories bought"
        open={boughtOpen}
        onToggle={() => setBoughtOpen((o) => !o)}
      >
        <div>
          <label htmlFor="lifo-b1-price" className={labelClass}>
            1st unit&apos;s purchased price
            <InfoTooltip
              label="1st unit's purchased price"
              text="Unit cost of the first (older) inventory batch."
            />
          </label>
          <FieldShell error={errors.batch1Price}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-b1-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.batch1Price}
              onChange={(e) => set({ batch1Price: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.batch1Price)}
            />
          </FieldShell>
          {errors.batch1Price ? (
            <p className="mt-1 text-xs text-rose-600">{errors.batch1Price}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lifo-b1-qty" className={labelClass}>
            Number of units purchased 1st time
            <InfoTooltip
              label="Number of units purchased 1st time"
              text="Quantity in the first purchase batch. Whole numbers only."
            />
          </label>
          <FieldShell error={errors.batch1Qty}>
            <input
              id="lifo-b1-qty"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.batch1Qty}
              onChange={(e) => set({ batch1Qty: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.batch1Qty)}
            />
          </FieldShell>
          {errors.batch1Qty ? (
            <p className="mt-1 text-xs text-rose-600">{errors.batch1Qty}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lifo-b2-price" className={labelClass}>
            2nd unit&apos;s purchased price
            <InfoTooltip
              label="2nd unit's purchased price"
              text="Unit cost of the second (newest) inventory batch — used first under LIFO."
            />
          </label>
          <FieldShell error={errors.batch2Price}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-b2-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.batch2Price}
              onChange={(e) => set({ batch2Price: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.batch2Price)}
            />
          </FieldShell>
          {errors.batch2Price ? (
            <p className="mt-1 text-xs text-rose-600">{errors.batch2Price}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lifo-b2-qty" className={labelClass}>
            Number of units purchased 2nd time
            <InfoTooltip
              label="Number of units purchased 2nd time"
              text="Quantity in the second (newest) purchase batch."
            />
          </label>
          <FieldShell error={errors.batch2Qty}>
            <input
              id="lifo-b2-qty"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.batch2Qty}
              onChange={(e) => set({ batch2Qty: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.batch2Qty)}
            />
          </FieldShell>
          {errors.batch2Qty ? (
            <p className="mt-1 text-xs text-rose-600">{errors.batch2Qty}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Units sold"
        open={soldOpen}
        onToggle={() => setSoldOpen((o) => !o)}
      >
        <div>
          <label htmlFor="lifo-sold" className={labelClass}>
            Total units sold
            <InfoTooltip
              label="Total units sold"
              text="Cannot exceed total units purchased. Whole numbers only."
            />
          </label>
          <FieldShell error={errors.unitsSold}>
            <input
              id="lifo-sold"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.unitsSold}
              onChange={(e) => set({ unitsSold: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.unitsSold)}
            />
          </FieldShell>
          {errors.unitsSold ? (
            <p className="mt-1 text-xs text-rose-600">{errors.unitsSold}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lifo-sell" className={labelClass}>
            Selling price
            <InfoTooltip
              label="Selling price"
              text="Price charged per unit sold — used for revenue, not for COGS."
            />
          </label>
          <FieldShell error={errors.sellingPrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-sell"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sellingPrice}
              onChange={(e) => set({ sellingPrice: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.sellingPrice)}
            />
          </FieldShell>
          {errors.sellingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sellingPrice}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Revenue and margin"
        open={marginOpen}
        onToggle={() => setMarginOpen((o) => !o)}
      >
        <div>
          <label htmlFor="lifo-revenue" className={labelClass}>
            Revenue
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-revenue"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedRevenue ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="lifo-cogs" className={labelClass}>
            LIFO Cost of Goods Sold
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-cogs"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedLifoCogs ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="lifo-ending" className={labelClass}>
            Ending inventory
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-ending"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedEndingInventory ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="lifo-gp" className={labelClass}>
            Gross profit
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lifo-gp"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedGrossProfit ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="lifo-margin" className={labelClass}>
            Gross profit margin
          </label>
          <FieldShell muted>
            <input
              id="lifo-margin"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result?.formattedGrossProfitMargin != null
                  ? `${result.formattedGrossProfitMargin}%`
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
