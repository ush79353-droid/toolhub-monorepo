'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HighLowMethodFieldErrors,
  HighLowMethodInput,
  HighLowMethodResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface HighLowMethodFormProps {
  input: HighLowMethodInput;
  errors: HighLowMethodFieldErrors;
  result: HighLowMethodResult | null;
  onChange: (input: HighLowMethodInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function HighLowMethodForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: HighLowMethodFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<HighLowMethodInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof HighLowMethodInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<HighLowMethodInput>);
  };

  const moneyField = (
    key: 'highCost' | 'lowCost',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
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
    key: 'highVolume' | 'lowVolume' | 'unitsX',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
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

  const resultMoney = (id: string, label: string, value: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={value}
            placeholder="—"
            aria-live="polite"
          />
        </div>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-labelledby="hlm-inputs-heading">
        <h3 id="hlm-inputs-heading" className="text-[13px] font-semibold text-accent">
          Initial costs and units
        </h3>
        {moneyField(
          'highCost',
          'hlm-high-cost',
          'High cost',
          'Total cost at the highest activity level in the data set.'
        )}
        {qtyField(
          'highVolume',
          'hlm-high-vol',
          'High unit volume',
          'Activity level (units) that pairs with the high cost. Must exceed low unit volume.'
        )}
        {moneyField(
          'lowCost',
          'hlm-low-cost',
          'Low cost',
          'Total cost at the lowest activity level in the data set.'
        )}
        {qtyField(
          'lowVolume',
          'hlm-low-vol',
          'Low unit volume',
          'Activity level (units) that pairs with the low cost.'
        )}
        {qtyField(
          'unitsX',
          'hlm-units-x',
          'Number of units (x)',
          'Activity level used to estimate total cost after fixed and variable costs are separated.'
        )}
      </section>

      <section className={sectionClass} aria-labelledby="hlm-results-heading">
        <h3 id="hlm-results-heading" className="text-[13px] font-semibold text-accent">
          Results
        </h3>
        {resultMoney('hlm-vc', 'Variable cost per unit', result?.variableDisplay ?? '')}
        {resultMoney('hlm-fc', 'Total fixed cost', result?.fixedDisplay ?? '')}
        {resultMoney('hlm-tc', 'Total cost', result?.totalDisplay ?? '')}
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
