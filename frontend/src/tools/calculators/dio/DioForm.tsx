'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageInventory,
  formatDioMoney,
} from './calculation';
import type {
  AverageInventoryMode,
  DioFieldErrors,
  DioInput,
  DioResult,
} from './types';

const PERIOD_PRESETS = [30, 90, 180, 365, 366] as const;

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

interface DioFormProps {
  input: DioInput;
  errors: DioFieldErrors;
  result: DioResult | null;
  onChange: (input: DioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function DioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: DioFormProps) {
  const [avgOpen, setAvgOpen] = useState(true);
  const [dioOpen, setDioOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const calculated = input.averageInventoryMode === 'calculated';

  const set = (patch: Partial<DioInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = '';
  if (calculated) {
    if (result?.formattedAverageInventory) {
      averageDisplay = result.formattedAverageInventory;
    } else {
      const start = parseNonneg(input.startingInventory);
      const end = parseNonneg(input.endingInventory);
      if (start !== null && end !== null) {
        const avg = calculateAverageInventory(start, end);
        if (avg !== null) averageDisplay = formatDioMoney(avg, input.currency);
      }
    }
  }

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
          aria-label="Currency for inventory and COGS amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures.
      </p>

      <fieldset>
        <legend className={labelClass}>Average inventory source</legend>
        <div className="flex flex-wrap gap-4" role="radiogroup">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="dio-avg-mode"
              className="h-4 w-4 accent-primary"
              checked={input.averageInventoryMode === 'calculated'}
              onChange={() =>
                set({
                  averageInventoryMode: 'calculated' satisfies AverageInventoryMode,
                })
              }
            />
            From starting &amp; ending
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="dio-avg-mode"
              className="h-4 w-4 accent-primary"
              checked={input.averageInventoryMode === 'manual'}
              onChange={() =>
                set({
                  averageInventoryMode: 'manual' satisfies AverageInventoryMode,
                })
              }
            />
            Enter average directly
          </label>
        </div>
      </fieldset>

      <CollapsibleSection
        title="Average inventory"
        open={avgOpen}
        onToggle={() => setAvgOpen((o) => !o)}
      >
        {calculated ? (
          <>
            <div>
              <label htmlFor="dio-starting" className={labelClass}>
                Starting inventory
                <InfoTooltip
                  label="Starting inventory"
                  text="Monetary value of inventory at the beginning of the selected accounting period."
                />
              </label>
              <FieldShell error={errors.startingInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dio-starting"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.startingInventory}
                  onChange={(e) => set({ startingInventory: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.startingInventory)}
                  aria-describedby={
                    errors.startingInventory ? 'dio-starting-err' : undefined
                  }
                />
              </FieldShell>
              {errors.startingInventory ? (
                <p id="dio-starting-err" className="mt-1 text-xs text-rose-600">
                  {errors.startingInventory}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dio-ending" className={labelClass}>
                Ending inventory
                <InfoTooltip
                  label="Ending inventory"
                  text="Monetary value of inventory at the end of the selected accounting period."
                />
              </label>
              <FieldShell error={errors.endingInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dio-ending"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingInventory}
                  onChange={(e) => set({ endingInventory: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.endingInventory)}
                  aria-describedby={
                    errors.endingInventory ? 'dio-ending-err' : undefined
                  }
                />
              </FieldShell>
              {errors.endingInventory ? (
                <p id="dio-ending-err" className="mt-1 text-xs text-rose-600">
                  {errors.endingInventory}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dio-average" className={labelClass}>
                Average inventory
                <InfoTooltip
                  label="Average inventory"
                  text="(Starting inventory + ending inventory) ÷ 2. A two-point average for the period."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dio-average"
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
          </>
        ) : (
          <div>
            <label htmlFor="dio-manual-avg" className={labelClass}>
              Average inventory
              <InfoTooltip
                label="Average inventory"
                text="Enter a known period average inventory directly. This value is used in the DIO formula without adding starting or ending balances."
              />
            </label>
            <FieldShell error={errors.manualAverageInventory}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dio-manual-avg"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualAverageInventory}
                onChange={(e) =>
                  set({ manualAverageInventory: e.target.value })
                }
                placeholder="0"
                aria-invalid={Boolean(errors.manualAverageInventory)}
                aria-describedby={
                  errors.manualAverageInventory
                    ? 'dio-manual-avg-err'
                    : undefined
                }
              />
            </FieldShell>
            {errors.manualAverageInventory ? (
              <p id="dio-manual-avg-err" className="mt-1 text-xs text-rose-600">
                {errors.manualAverageInventory}
              </p>
            ) : null}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Days inventory outstanding (DIO)"
        open={dioOpen}
        onToggle={() => setDioOpen((o) => !o)}
      >
        <div>
          <label htmlFor="dio-cogs" className={labelClass}>
            Cost of goods sold (COGS)
            <InfoTooltip
              label="Cost of goods sold"
              text="Cost associated with goods sold during the same accounting period as the inventory figures. Do not use sales revenue."
            />
          </label>
          <FieldShell error={errors.costOfGoodsSold}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="dio-cogs"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.costOfGoodsSold}
              onChange={(e) => set({ costOfGoodsSold: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.costOfGoodsSold)}
              aria-describedby={
                errors.costOfGoodsSold ? 'dio-cogs-err' : undefined
              }
            />
          </FieldShell>
          {errors.costOfGoodsSold ? (
            <p id="dio-cogs-err" className="mt-1 text-xs text-rose-600">
              {errors.costOfGoodsSold}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="dio-period" className={labelClass}>
            Days in accounting period
            <InfoTooltip
              label="Days in accounting period"
              text="Number of days in the reporting period that matches inventory and COGS. Use actual day counts when known (default 365)."
            />
          </label>
          <FieldShell error={errors.accountingPeriodDays}>
            <input
              id="dio-period"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.accountingPeriodDays}
              onChange={(e) => set({ accountingPeriodDays: e.target.value })}
              placeholder="365"
              aria-invalid={Boolean(errors.accountingPeriodDays)}
              aria-describedby={
                errors.accountingPeriodDays ? 'dio-period-err' : undefined
              }
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.accountingPeriodDays ? (
            <p id="dio-period-err" className="mt-1 text-xs text-rose-600">
              {errors.accountingPeriodDays}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PERIOD_PRESETS.map((days) => (
              <button
                key={days}
                type="button"
                className={`rounded-md border px-2 py-1 text-xs tabular-nums transition-colors ${
                  input.accountingPeriodDays === String(days)
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-accent hover:bg-muted/30'
                }`}
                onClick={() => set({ accountingPeriodDays: String(days) })}
              >
                {days}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="dio-result" className={labelClass}>
            DIO
            <InfoTooltip
              label="Days inventory outstanding"
              text="DIO = (Average inventory ÷ COGS) × days in period. Shown in days, not currency."
            />
          </label>
          <FieldShell muted>
            <input
              id="dio-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result
                  ? `${result.formattedDaysInventoryOutstanding} days`
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>
    </form>
  );
}
