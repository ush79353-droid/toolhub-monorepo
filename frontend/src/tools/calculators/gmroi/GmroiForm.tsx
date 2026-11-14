'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { GmroiDraft, GmroiFieldErrors, GmroiResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface GmroiFormProps {
  draft: GmroiDraft;
  errors: GmroiFieldErrors;
  result: GmroiResult | null;
  onDraftChange: (draft: GmroiDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function GmroiForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: GmroiFormProps) {
  const symbol = getCurrencySymbol(draft.currency);

  const setMoney = (
    key: 'startingInventory' | 'finalInventory' | 'grossProfit',
    value: string
  ) => {
    onDraftChange({ ...draft, [key]: value });
  };

  const setAverage = (value: string) => {
    onDraftChange({
      ...draft,
      averageInventory: value,
      averageManual: value.trim() !== '',
    });
  };

  const moneyInput = (
    key: 'startingInventory' | 'finalInventory' | 'averageInventory' | 'grossProfit',
    id: string,
    label: string,
    tip?: string,
    opts?: { onChange: (value: string) => void; readOnly?: boolean }
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
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
            value={draft[key]}
            readOnly={opts?.readOnly}
            aria-invalid={Boolean(errors[key])}
            onChange={(event) => opts?.onChange(event.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={draft.currency}
            onChange={(currency) => onDraftChange({ ...draft, currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      {moneyInput('startingInventory', 'gmroi-start', 'Starting inventory cost', undefined, {
        onChange: (value) => setMoney('startingInventory', value),
      })}
      {moneyInput('finalInventory', 'gmroi-final', 'Final inventory cost', undefined, {
        onChange: (value) => setMoney('finalInventory', value),
      })}
      {moneyInput(
        'averageInventory',
        'gmroi-average',
        'Average inventory cost',
        'Defaults to (starting + final) ÷ 2. You can type a different average; clearing the field restores the auto value.',
        { onChange: setAverage }
      )}
      {moneyInput(
        'grossProfit',
        'gmroi-profit',
        'Gross profit',
        'Sales revenue minus cost of goods sold for the same period as the inventory figures.',
        { onChange: (value) => setMoney('grossProfit', value) }
      )}

      <div>
        <label htmlFor="gmroi-ratio" className={labelClass}>
          GMROI
          <InfoTooltip
            label="GMROI"
            text="Gross margin return on investment = gross profit ÷ average inventory cost."
          />
        </label>
        <div className="rounded-lg border border-border bg-muted/30">
          <input
            id="gmroi-ratio"
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={result?.gmroiDisplay ?? ''}
            placeholder="—"
            aria-live="polite"
          />
        </div>
      </div>

      <div>
        <label htmlFor="gmroi-percent" className={labelClass}>
          GMROI percentage
        </label>
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="gmroi-percent"
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            readOnly
            value={result?.gmroiPercentDisplay ?? ''}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
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
