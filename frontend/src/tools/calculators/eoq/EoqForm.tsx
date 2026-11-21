'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INVENTORY_UNITS,
  type EoqFieldErrors,
  type EoqInput,
  type EoqResult,
  type InventoryUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface EoqFormProps {
  input: EoqInput;
  errors: EoqFieldErrors;
  result: EoqResult | null;
  onChange: (input: EoqInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EoqForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EoqFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const unitLabel =
    INVENTORY_UNITS.find((u) => u.value === input.inventoryUnit)?.label ??
    'units';

  const set = (patch: Partial<EoqInput>) => {
    onChange({ ...input, ...patch });
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
          aria-label="Currency for order and holding costs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Order cost and holding cost share the selected currency (no FX
 conversion). Demand and EOQ use the inventory unit label; changing the
        unit does not convert quantities.
      </p>

      <div>
        <label htmlFor="eoq-demand" className={labelClass}>
          Yearly demand
          <InfoTooltip
            label="Yearly demand"
            text="Expected number of inventory units demanded over one year under the classical EOQ model."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.yearlyDemand}>
            <input
              id="eoq-demand"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.yearlyDemand}
              onChange={(e) => set({ yearlyDemand: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.yearlyDemand)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[7.5rem] shrink-0`}
            value={input.inventoryUnit}
            onChange={(e) =>
              set({ inventoryUnit: e.target.value as InventoryUnit })
            }
            aria-label="Inventory unit for demand and EOQ"
          >
            {INVENTORY_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.yearlyDemand ? (
          <p className="mt-1 text-xs text-rose-600">{errors.yearlyDemand}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="eoq-order-cost" className={labelClass}>
          Order cost
          <InfoTooltip
            label="Order cost"
            text="Fixed cost of placing and processing one replenishment order (processing, admin, fixed delivery/setup); not the purchase price of the goods."
          />
        </label>
        <FieldShell error={errors.orderCost}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="eoq-order-cost"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.orderCost}
            onChange={(e) => set({ orderCost: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.orderCost)}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            / per order
          </span>
        </FieldShell>
        {errors.orderCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.orderCost}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="eoq-holding" className={labelClass}>
          Yearly cost of holding
          <InfoTooltip
            label="Yearly cost of holding"
            text="Annual cost of holding one unit in stock (storage, insurance, financing, handling, obsolescence, shrinkage)."
          />
        </label>
        <FieldShell error={errors.annualHoldingCostPerUnit}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="eoq-holding"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.annualHoldingCostPerUnit}
            onChange={(e) => set({ annualHoldingCostPerUnit: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.annualHoldingCostPerUnit)}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            / unit / yr
          </span>
        </FieldShell>
        {errors.annualHoldingCostPerUnit ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualHoldingCostPerUnit}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="eoq-result" className={labelClass}>
          Economic order quantity (EOQ)
          <InfoTooltip
            label="Economic order quantity"
            text="EOQ = √(2 × Demand × Order cost ÷ Holding cost per unit). Result is in inventory units per order; not currency."
          />
        </label>
        <FieldShell muted>
          <input
            id="eoq-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={
              result
                ? `${result.formattedEconomicOrderQuantity} ${unitLabel}`
                : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>
    </form>
  );
}
