'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageAccountsPayable,
  calculatePurchases,
  formatDpoMoney,
} from './calculation';
import type {
  BalanceSource,
  DpoFieldErrors,
  DpoInput,
  DpoResult,
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

interface DpoFormProps {
  input: DpoInput;
  errors: DpoFieldErrors;
  result: DpoResult | null;
  onChange: (input: DpoInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function DpoForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: DpoFormProps) {
  const [apOpen, setApOpen] = useState(true);
  const [purchOpen, setPurchOpen] = useState(true);
  const [dpoOpen, setDpoOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const apCalc = input.averageApSource === 'calculated';
  const purchCalc = input.purchasesSource === 'calculated';

  const set = (patch: Partial<DpoInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = '';
  if (apCalc) {
    if (result?.formattedAverageAccountsPayable) {
      averageDisplay = result.formattedAverageAccountsPayable;
    } else {
      const beg = parseNonneg(input.beginningAccountsPayable);
      const end = parseNonneg(input.endingAccountsPayable);
      if (beg !== null && end !== null) {
        const avg = calculateAverageAccountsPayable(beg, end);
        if (avg !== null) averageDisplay = formatDpoMoney(avg, input.currency);
      }
    }
  }

  let purchasesDisplay = '';
  if (purchCalc) {
    if (result?.formattedPurchases) {
      purchasesDisplay = result.formattedPurchases;
    } else {
      const beg = parseNonneg(input.beginningInventory);
      const end = parseNonneg(input.endingInventory);
      const cogs = parseNonneg(input.costOfGoodsSold);
      if (beg !== null && end !== null && cogs !== null) {
        const p = calculatePurchases(cogs, end, beg);
        if (p !== null) purchasesDisplay = formatDpoMoney(p, input.currency);
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
          aria-label="Currency for payables, inventory, and purchases"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures.
      </p>

      <CollapsibleSection
        title="Average Payables"
        open={apOpen}
        onToggle={() => setApOpen((o) => !o)}
      >
        <fieldset>
          <legend className={labelClass}>Average AP source</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dpo-ap-source"
                className="h-4 w-4 accent-primary"
                checked={input.averageApSource === 'calculated'}
                onChange={() =>
                  set({
                    averageApSource: 'calculated' satisfies BalanceSource,
                  })
                }
              />
              From beginning &amp; ending
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dpo-ap-source"
                className="h-4 w-4 accent-primary"
                checked={input.averageApSource === 'manual'}
                onChange={() =>
                  set({ averageApSource: 'manual' satisfies BalanceSource })
                }
              />
              Enter average directly
            </label>
          </div>
        </fieldset>

        {apCalc ? (
          <>
            <div>
              <label htmlFor="dpo-beg-ap" className={labelClass}>
                Beginning accounts payable
                <InfoTooltip
                  label="Beginning accounts payable"
                  text="Outstanding amount owed to suppliers at the beginning of the reporting period."
                />
              </label>
              <FieldShell error={errors.beginningAccountsPayable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-beg-ap"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningAccountsPayable}
                  onChange={(e) =>
                    set({ beginningAccountsPayable: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.beginningAccountsPayable)}
                  aria-describedby={
                    errors.beginningAccountsPayable
                      ? 'dpo-beg-ap-err'
                      : undefined
                  }
                />
              </FieldShell>
              {errors.beginningAccountsPayable ? (
                <p id="dpo-beg-ap-err" className="mt-1 text-xs text-rose-600">
                  {errors.beginningAccountsPayable}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dpo-end-ap" className={labelClass}>
                Ending accounts payable
                <InfoTooltip
                  label="Ending accounts payable"
                  text="Outstanding amount owed to suppliers at the end of the reporting period."
                />
              </label>
              <FieldShell error={errors.endingAccountsPayable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-end-ap"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingAccountsPayable}
                  onChange={(e) =>
                    set({ endingAccountsPayable: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.endingAccountsPayable)}
                  aria-describedby={
                    errors.endingAccountsPayable ? 'dpo-end-ap-err' : undefined
                  }
                />
              </FieldShell>
              {errors.endingAccountsPayable ? (
                <p id="dpo-end-ap-err" className="mt-1 text-xs text-rose-600">
                  {errors.endingAccountsPayable}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dpo-avg-ap" className={labelClass}>
                Average accounts payable
                <InfoTooltip
                  label="Average accounts payable"
                  text="(Beginning AP + ending AP) ÷ 2."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-avg-ap"
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
            <label htmlFor="dpo-manual-ap" className={labelClass}>
              Average accounts payable
              <InfoTooltip
                label="Average accounts payable"
                text="Enter a known period average accounts payable directly."
              />
            </label>
            <FieldShell error={errors.manualAverageAp}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dpo-manual-ap"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualAverageAp}
                onChange={(e) => set({ manualAverageAp: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.manualAverageAp)}
                aria-describedby={
                  errors.manualAverageAp ? 'dpo-manual-ap-err' : undefined
                }
              />
            </FieldShell>
            {errors.manualAverageAp ? (
              <p id="dpo-manual-ap-err" className="mt-1 text-xs text-rose-600">
                {errors.manualAverageAp}
              </p>
            ) : null}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Purchases"
        open={purchOpen}
        onToggle={() => setPurchOpen((o) => !o)}
      >
        <fieldset>
          <legend className={labelClass}>Purchases source</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dpo-purch-source"
                className="h-4 w-4 accent-primary"
                checked={input.purchasesSource === 'calculated'}
                onChange={() =>
                  set({
                    purchasesSource: 'calculated' satisfies BalanceSource,
                  })
                }
              />
              From inventory &amp; COGS
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dpo-purch-source"
                className="h-4 w-4 accent-primary"
                checked={input.purchasesSource === 'manual'}
                onChange={() =>
                  set({ purchasesSource: 'manual' satisfies BalanceSource })
                }
              />
              Enter purchases directly
            </label>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Estimated purchases = COGS + ending inventory − beginning
            inventory. Prefer actual credit purchases when available.
          </p>
        </fieldset>

        {purchCalc ? (
          <>
            <div>
              <label htmlFor="dpo-beg-inv" className={labelClass}>
                Beginning inventory
                <InfoTooltip
                  label="Beginning inventory"
                  text="Inventory at the start of the same reporting period as COGS."
                />
              </label>
              <FieldShell error={errors.beginningInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-beg-inv"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningInventory}
                  onChange={(e) => set({ beginningInventory: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.beginningInventory)}
                  aria-describedby={
                    errors.beginningInventory ? 'dpo-beg-inv-err' : undefined
                  }
                />
              </FieldShell>
              {errors.beginningInventory ? (
                <p id="dpo-beg-inv-err" className="mt-1 text-xs text-rose-600">
                  {errors.beginningInventory}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dpo-end-inv" className={labelClass}>
                Ending inventory
                <InfoTooltip
                  label="Ending inventory"
                  text="Inventory at the end of the same reporting period as COGS."
                />
              </label>
              <FieldShell error={errors.endingInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-end-inv"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingInventory}
                  onChange={(e) => set({ endingInventory: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.endingInventory)}
                  aria-describedby={
                    errors.endingInventory ? 'dpo-end-inv-err' : undefined
                  }
                />
              </FieldShell>
              {errors.endingInventory ? (
                <p id="dpo-end-inv-err" className="mt-1 text-xs text-rose-600">
                  {errors.endingInventory}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dpo-cogs" className={labelClass}>
                Cost of goods sold
                <InfoTooltip
                  label="Cost of goods sold"
                  text="COGS for the same period used with beginning and ending inventory to estimate purchases."
                />
              </label>
              <FieldShell error={errors.costOfGoodsSold}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-cogs"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.costOfGoodsSold}
                  onChange={(e) => set({ costOfGoodsSold: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.costOfGoodsSold)}
                  aria-describedby={
                    errors.costOfGoodsSold ? 'dpo-cogs-err' : undefined
                  }
                />
              </FieldShell>
              {errors.costOfGoodsSold ? (
                <p id="dpo-cogs-err" className="mt-1 text-xs text-rose-600">
                  {errors.costOfGoodsSold}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dpo-purchases" className={labelClass}>
                Purchases
                <InfoTooltip
                  label="Purchases"
                  text="COGS + ending inventory − beginning inventory. Negative estimates block standard DPO."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dpo-purchases"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={purchasesDisplay}
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="dpo-manual-purch" className={labelClass}>
              Purchases
              <InfoTooltip
                label="Purchases"
                text="Enter purchases directly. Prefer relevant credit purchases when available for supplier payables."
              />
            </label>
            <FieldShell error={errors.manualPurchases}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dpo-manual-purch"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualPurchases}
                onChange={(e) => set({ manualPurchases: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.manualPurchases)}
                aria-describedby={
                  errors.manualPurchases ? 'dpo-manual-purch-err' : undefined
                }
              />
            </FieldShell>
            {errors.manualPurchases ? (
              <p id="dpo-manual-purch-err" className="mt-1 text-xs text-rose-600">
                {errors.manualPurchases}
              </p>
            ) : null}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Days Payable Outstanding (DPO)"
        open={dpoOpen}
        onToggle={() => setDpoOpen((o) => !o)}
      >
        <div>
          <label htmlFor="dpo-period" className={labelClass}>
            Days in accounting period
            <InfoTooltip
              label="Days in accounting period"
              text="Number of days in the reporting period that matches AP, inventory, and purchases (default 365)."
            />
          </label>
          <FieldShell error={errors.accountingPeriodDays}>
            <input
              id="dpo-period"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.accountingPeriodDays}
              onChange={(e) => set({ accountingPeriodDays: e.target.value })}
              placeholder="365"
              aria-invalid={Boolean(errors.accountingPeriodDays)}
              aria-describedby={
                errors.accountingPeriodDays ? 'dpo-period-err' : undefined
              }
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.accountingPeriodDays ? (
            <p id="dpo-period-err" className="mt-1 text-xs text-rose-600">
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
          <label htmlFor="dpo-result" className={labelClass}>
            Days payable outstanding
            <InfoTooltip
              label="Days payable outstanding"
              text="DPO = (Average AP ÷ Purchases) × days. Shown in days, not currency."
            />
          </label>
          <FieldShell muted>
            <input
              id="dpo-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result
                  ? `${result.formattedDaysPayableOutstanding} days`
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
