'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertTimeUnitDisplay } from './calculation';
import type {
  ActualCashValueFieldErrors,
  ActualCashValueInput,
  ActualCashValueResult,
  TimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-xs font-medium text-accent outline-none';

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

interface ActualCashValueFormProps {
  input: ActualCashValueInput;
  errors: ActualCashValueFieldErrors;
  result: ActualCashValueResult | null;
  onChange: (input: ActualCashValueInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ActualCashValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ActualCashValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<ActualCashValueInput>) => {
    onChange({ ...input, ...patch });
  };

  const switchUnit = (
    field: 'expectedLife' | 'currentAge',
    unitField: 'expectedLifeUnit' | 'currentAgeUnit',
    next: TimeUnit
  ) => {
    const currentUnit = input[unitField];
    if (currentUnit === next) return;
    const raw = input[field].trim();
    if (!raw) {
      set({ [unitField]: next } as Partial<ActualCashValueInput>);
      return;
    }
    const num = Number(raw.replace(/,/g, ''));
    if (!Number.isFinite(num)) {
      set({ [unitField]: next } as Partial<ActualCashValueInput>);
      return;
    }
    const converted = convertTimeUnitDisplay(num, currentUnit, next);
    set({
      [field]: String(converted),
      [unitField]: next,
    } as Partial<ActualCashValueInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
 changes the symbol only; it does not convert values. This uses a
          simplified zero-salvage straight-line model based on purchase price,
          not current replacement cost.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="acv-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <div>
        <label htmlFor="acv-price" className={labelClass}>
          <span>Purchase price</span>
          <InfoTooltip
            label="Purchase price"
            text="Original purchase price used as the starting basis in this simplified depreciation model. Not the same as current replacement cost."
          />
        </label>
        <FieldShell error={errors.purchasePrice}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="acv-price"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.purchasePrice}
            aria-invalid={errors.purchasePrice ? true : undefined}
            onChange={(e) => set({ purchasePrice: e.target.value })}
          />
        </FieldShell>
        {errors.purchasePrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="acv-life" className={labelClass}>
          <span>Expected life of the item</span>
          <InfoTooltip
            label="Expected life of the item"
            text="Total useful life assumed for straight-line depreciation. Switching years/months preserves the same duration."
          />
        </label>
        <FieldShell error={errors.expectedLife}>
          <input
            id="acv-life"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.expectedLife}
            aria-invalid={errors.expectedLife ? true : undefined}
            onChange={(e) => set({ expectedLife: e.target.value })}
          />
          <select
            className={selectClass}
            value={input.expectedLifeUnit}
            aria-label="Expected life unit"
            onChange={(e) =>
              switchUnit(
                'expectedLife',
                'expectedLifeUnit',
                e.target.value as TimeUnit
              )
            }
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </FieldShell>
        {errors.expectedLife ? (
          <p className="mt-1 text-xs text-rose-600">{errors.expectedLife}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="acv-age" className={labelClass}>
          <span>Current life of the item</span>
          <InfoTooltip
            label="Current life of the item"
            text="Current age since purchase or placed-in-service date, depending on your assumption. Age beyond expected life floors ACV at zero in this model."
          />
        </label>
        <p className="mb-1.5 text-xs text-muted-foreground">
          Current age of the item
        </p>
        <FieldShell error={errors.currentAge}>
          <input
            id="acv-age"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.currentAge}
            aria-invalid={errors.currentAge ? true : undefined}
            onChange={(e) => set({ currentAge: e.target.value })}
          />
          <select
            className={selectClass}
            value={input.currentAgeUnit}
            aria-label="Current age unit"
            onChange={(e) =>
              switchUnit(
                'currentAge',
                'currentAgeUnit',
                e.target.value as TimeUnit
              )
            }
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </FieldShell>
        {errors.currentAge ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="acv-result" className={labelClass}>
          <span>Actual cash value</span>
          <InfoTooltip
            label="Actual cash value"
            text="ACV = Purchase price × max(0, 1 − age / expected life). Simplified estimate: not an insurer settlement, appraisal, or guaranteed resale value."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="acv-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={result?.formattedActualCashValue ?? ''}
            aria-live="polite"
          />
        </FieldShell>
        {result?.beyondUsefulLife ? (
          <p className="mt-1 text-xs text-amber-700" role="status">
            Current age exceeds expected life, so this zero-salvage model
            assigns ACV of zero. The item may still have market or insurance
            value.
          </p>
        ) : null}
      </div>
    </form>
  );
}
