'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type {
  CostOfDoingBusinessFieldErrors,
  CostOfDoingBusinessInput,
  CostOfDoingBusinessResult,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

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

interface CostOfDoingBusinessFormProps {
  input: CostOfDoingBusinessInput;
  errors: CostOfDoingBusinessFieldErrors;
  result: CostOfDoingBusinessResult | null;
  onChange: (input: CostOfDoingBusinessInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function CostOfDoingBusinessForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: CostOfDoingBusinessFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CostOfDoingBusinessInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof CostOfDoingBusinessInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<CostOfDoingBusinessInput>);
    };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div>
        <label className={labelClass} htmlFor="codb-annual-cost">
          Total annual cost
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.totalAnnualCost}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="codb-annual-cost"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.totalAnnualCost)}
              aria-invalid={Boolean(errors.totalAnnualCost)}
              onChange={onNumber('totalAnnualCost')}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="codb-annual-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
        </div>
        {errors.totalAnnualCost ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalAnnualCost}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="codb-days">
          Total billable days per year
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.billableDays}>
            <input
              id="codb-days"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.billableDays)}
              aria-invalid={Boolean(errors.billableDays)}
              onChange={onNumber('billableDays')}
            />
          </FieldShell>
          <span className={unitBadgeClass} aria-hidden="true">
            days
          </span>
        </div>
        {errors.billableDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.billableDays}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="codb-result">
          Cost of doing business
        </label>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="codb-result"
              className={`${inputClass} cursor-default font-semibold text-accent`}
              readOnly
              value={result?.costDisplay ?? ''}
              placeholder="—"
              aria-live="polite"
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="codb-result-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Cost of doing business currency"
            />
          </div>
        </div>
        {result ? (
          <p className="mt-1 text-xs text-muted-foreground">Per billable day</p>
        ) : null}
      </div>

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
