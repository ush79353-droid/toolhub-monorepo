'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageInventory,
  formatInvMoney,
} from './calculation';
import type {
  InventoryTurnoverFieldErrors,
  InventoryTurnoverInput,
  InventoryTurnoverResult,
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

function parseNonneg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

interface InventoryTurnoverFormProps {
  input: InventoryTurnoverInput;
  errors: InventoryTurnoverFieldErrors;
  result: InventoryTurnoverResult | null;
  onChange: (input: InventoryTurnoverInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function InventoryTurnoverForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: InventoryTurnoverFormProps) {
  const [resultsOpen, setResultsOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<InventoryTurnoverInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = result?.formattedAverageInventory ?? '';
  if (!averageDisplay) {
    const b = parseNonneg(input.beginningInventory);
    const e = parseNonneg(input.endingInventory);
    if (b !== null && e !== null) {
      const avg = calculateAverageInventory(b, e);
      if (avg !== null) averageDisplay = formatInvMoney(avg, input.currency);
    }
  }

  const turnoverDisplay =
    result?.formattedInventoryTurnover != null
      ? `${result.formattedInventoryTurnover}×`
      : '';
  const daysDisplay =
    result?.formattedInventoryDays != null
      ? `${result.formattedInventoryDays} days`
      : '';

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
          aria-label="Currency for inventory and COGS"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Use COGS (not revenue) for the same period as inventory
        balances.
      </p>

      <div>
        <label htmlFor="inv-cogs" className={labelClass}>
          Cost of Goods Sold
          <InfoTooltip
            label="Cost of Goods Sold"
            text="Direct costs of goods sold in the accounting period; materials, labor, and related production or merchandise costs recognized when sold. Do not substitute revenue."
          />
        </label>
        <FieldShell error={errors.costOfGoodsSold}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="inv-cogs"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.costOfGoodsSold}
            onChange={(e) => set({ costOfGoodsSold: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.costOfGoodsSold)}
          />
        </FieldShell>
        {errors.costOfGoodsSold ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfGoodsSold}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="inv-beg" className={labelClass}>
          Beginning inventory
          <InfoTooltip
            label="Beginning inventory"
            text="Inventory value at the start of the same accounting period used for COGS."
          />
        </label>
        <FieldShell error={errors.beginningInventory}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="inv-beg"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.beginningInventory}
            onChange={(e) => set({ beginningInventory: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.beginningInventory)}
          />
        </FieldShell>
        {errors.beginningInventory ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.beginningInventory}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="inv-end" className={labelClass}>
          Ending inventory
          <InfoTooltip
            label="Ending inventory"
            text="Inventory value at the end of the period, on a consistent cost basis (for example FIFO or weighted average)."
          />
        </label>
        <FieldShell error={errors.endingInventory}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="inv-end"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.endingInventory}
            onChange={(e) => set({ endingInventory: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.endingInventory)}
          />
        </FieldShell>
        {errors.endingInventory ? (
          <p className="mt-1 text-xs text-rose-600">{errors.endingInventory}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="inv-days" className={labelClass}>
          Days
          <InfoTooltip
            label="Days"
            text="Number of days in the accounting period for COGS (for example 365 for a year, 90 for a quarter). Must be greater than zero. No currency symbol."
          />
        </label>
        <FieldShell error={errors.days}>
          <input
            id="inv-days"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.days}
            onChange={(e) => set({ days: e.target.value })}
            placeholder="365"
            aria-invalid={Boolean(errors.days)}
          />
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
            days
          </span>
        </FieldShell>
        {errors.days ? (
          <p className="mt-1 text-xs text-rose-600">{errors.days}</p>
        ) : null}
      </div>

      <CollapsibleSection
        title="Results"
        open={resultsOpen}
        onToggle={() => setResultsOpen((o) => !o)}
      >
        <div>
          <label htmlFor="inv-idio" className={labelClass}>
            Inventory days
            <InfoTooltip
              label="Inventory days"
              text="(Average Inventory ÷ COGS) × Days; also called DIO / DSI. Unavailable when COGS is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="inv-idio"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={daysDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="inv-turnover" className={labelClass}>
            Inventory turnover
            <InfoTooltip
              label="Inventory turnover"
              text="COGS ÷ Average Inventory. Dimensionless multiplier; no currency or percent. Undefined when average inventory is zero."
            />
          </label>
          <FieldShell muted>
            <input
              id="inv-turnover"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={turnoverDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="inv-avg" className={labelClass}>
            Average inventory
            <InfoTooltip
              label="Average inventory"
              text="(Beginning inventory + Ending inventory) ÷ 2."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="inv-avg"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={averageDisplay}
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
