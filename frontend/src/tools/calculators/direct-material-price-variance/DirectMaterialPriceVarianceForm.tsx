'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { statusLabel } from './calculation';
import type {
  DirectMaterialPriceVarianceFieldErrors,
  DirectMaterialPriceVarianceInput,
  DirectMaterialPriceVarianceResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface DirectMaterialPriceVarianceFormProps {
  input: DirectMaterialPriceVarianceInput;
  errors: DirectMaterialPriceVarianceFieldErrors;
  result: DirectMaterialPriceVarianceResult | null;
  onChange: (input: DirectMaterialPriceVarianceInput) => void;
  onReset: () => void;
}

export function DirectMaterialPriceVarianceForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: DirectMaterialPriceVarianceFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DirectMaterialPriceVarianceInput>) =>
    onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof DirectMaterialPriceVarianceInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<DirectMaterialPriceVarianceInput>);
    };

  const moneyField = (
    key: 'standardRate' | 'actualRate',
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
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const statusClass =
    result?.status === 'favorable'
      ? 'text-emerald-700'
      : result?.status === 'unfavorable'
        ? 'text-rose-700'
        : 'text-muted-foreground';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {moneyField(
        'standardRate',
        'dmpv-standard',
        'Standard rate',
        'Budgeted or standard price per unit of direct material.'
      )}
      {moneyField(
        'actualRate',
        'dmpv-actual',
        'Actual rate',
        'Actual price paid per unit of direct material.'
      )}

      <div>
        <label htmlFor="dmpv-quantity" className={labelClass}>
          Quantity
          <InfoTooltip
            label="Quantity"
            text="Quantity of material purchased (or used for the price variance base), in units."
          />
        </label>
        <FieldShell error={errors.quantity}>
          <input
            id="dmpv-quantity"
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input.quantity)}
            aria-invalid={Boolean(errors.quantity)}
            onChange={onNumber('quantity')}
          />
        </FieldShell>
        {errors.quantity ? <p className="mt-1 text-xs text-rose-600">{errors.quantity}</p> : null}
      </div>

      <div>
        <label htmlFor="dmpv-variance" className={labelClass}>
          Direct materials price variance
          <InfoTooltip
            label="Direct materials price variance"
            text="(Actual rate − Standard rate) × Quantity. Positive is unfavorable; negative is favorable."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="dmpv-variance"
              className={`${inputClass} bg-muted/20 font-semibold`}
              readOnly
              value={result?.varianceDisplay ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="dmpv-variance-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Variance currency"
            />
          </div>
        </div>
        {result ? (
          <p className={`mt-1.5 text-xs font-medium ${statusClass}`}>{statusLabel(result.status)}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
