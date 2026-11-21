'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CogsKnownMode,
  EndingInventoryFieldErrors,
  EndingInventoryInput,
  EndingInventoryResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface EndingInventoryFormProps {
  input: EndingInventoryInput;
  errors: EndingInventoryFieldErrors;
  result: EndingInventoryResult | null;
  onChange: (input: EndingInventoryInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EndingInventoryForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EndingInventoryFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const cogsKnown = input.cogsKnown === 'yes';

  const set = (patch: Partial<EndingInventoryInput>) => {
    onChange({ ...input, ...patch });
  };

  const switchMode = (mode: CogsKnownMode) => {
    onChange({
      ...input,
      cogsKnown: mode,
      costOfGoodsSold: mode === 'yes' ? input.costOfGoodsSold : '',
      inventoryTurnover: mode === 'no' ? input.inventoryTurnover : '',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for inventory amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Do not use sales revenue in place of COGS.
      </p>

      <div>
        <label htmlFor="ei-cogs-known" className={labelClass}>
          Is the value of COGS known?
          <InfoTooltip
            label="COGS known"
            text="Yes: enter COGS to calculate ending inventory and turnover. No: enter inventory turnover to estimate COGS and ending inventory."
          />
        </label>
        <select
          id="ei-cogs-known"
          className={selectClass}
          value={input.cogsKnown}
          onChange={(e) => switchMode(e.target.value as CogsKnownMode)}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label htmlFor="ei-starting" className={labelClass}>
          Starting inventory
          <InfoTooltip
            label="Starting inventory"
            text="Monetary value of inventory held at the beginning of the accounting period, on the same cost basis as other inputs."
          />
        </label>
        <FieldShell error={errors.startingInventory}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ei-starting"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.startingInventory}
            onChange={(e) => set({ startingInventory: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.startingInventory)}
          />
        </FieldShell>
        {errors.startingInventory ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startingInventory}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ei-purchases" className={labelClass}>
          Net purchases
          <InfoTooltip
            label="Net purchases"
            text="Cost of inventory acquired during the period after returns, allowances, and discounts, including eligible freight-in where applicable. Net purchases = Gross purchases − returns − allowances − discounts (+ freight-in)."
          />
        </label>
        <FieldShell error={errors.netPurchases}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ei-purchases"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netPurchases}
            onChange={(e) => set({ netPurchases: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.netPurchases)}
          />
        </FieldShell>
        {errors.netPurchases ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netPurchases}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ei-cogs" className={labelClass}>
          Cost of goods sold
          <InfoTooltip
            label="Cost of goods sold"
            text="Cost attributed to inventory sold during the period; not sales revenue. When COGS is unknown, it is estimated from inventory turnover."
          />
        </label>
        <FieldShell error={errors.costOfGoodsSold} muted={!cogsKnown}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          {cogsKnown ? (
            <input
              id="ei-cogs"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.costOfGoodsSold}
              onChange={(e) => set({ costOfGoodsSold: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.costOfGoodsSold)}
            />
          ) : (
            <input
              id="ei-cogs"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedCostOfGoodsSold ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          )}
        </FieldShell>
        {errors.costOfGoodsSold ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfGoodsSold}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ei-ending" className={labelClass}>
          Ending inventory
          <InfoTooltip
            label="Ending inventory"
            text="Starting inventory + Net purchases − COGS. Negative results are not valid physical inventory balances under this simplified model."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ei-ending"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={
              result?.status === 'negativeEndingInventory'
                ? result.formattedEndingInventory
                : result?.status === 'valid' ||
                    result?.status === 'zeroAverageInventory'
                  ? result.formattedEndingInventory
                  : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="ei-turnover" className={labelClass}>
          Inventory turnover
          <InfoTooltip
            label="Inventory turnover"
            text="COGS ÷ Average inventory, where Average inventory = (Starting + Ending) ÷ 2. Dimensionless; no currency or percent. When COGS is unknown, enter this ratio to estimate COGS."
          />
        </label>
        <FieldShell error={errors.inventoryTurnover} muted={cogsKnown}>
          {cogsKnown ? (
            <input
              id="ei-turnover"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result?.formattedInventoryTurnover
                  ? `${result.formattedInventoryTurnover} times`
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          ) : (
            <input
              id="ei-turnover"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.inventoryTurnover}
              onChange={(e) => set({ inventoryTurnover: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.inventoryTurnover)}
            />
          )}
        </FieldShell>
        {errors.inventoryTurnover ? (
          <p className="mt-1 text-xs text-rose-600">{errors.inventoryTurnover}</p>
        ) : null}
        {!cogsKnown ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Enter times per reporting period (for example 2.25).
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
