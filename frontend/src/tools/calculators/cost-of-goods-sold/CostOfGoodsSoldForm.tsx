'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CostOfGoodsSoldFieldErrors,
  CostOfGoodsSoldInput,
  CostOfGoodsSoldResult,
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

interface CostOfGoodsSoldFormProps {
  input: CostOfGoodsSoldInput;
  errors: CostOfGoodsSoldFieldErrors;
  result: CostOfGoodsSoldResult | null;
  onChange: (input: CostOfGoodsSoldInput) => void;
  onReset: () => void;
}

export function CostOfGoodsSoldForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: CostOfGoodsSoldFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CostOfGoodsSoldInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof CostOfGoodsSoldInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<CostOfGoodsSoldInput>);
  };

  const moneyField = (
    key: 'beginningInventory' | 'purchases' | 'endingInventory',
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

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {moneyField(
        'beginningInventory',
        'cogs-beginning',
        'Beginning inventory',
        'Inventory value at the start of the period, in your chosen currency.'
      )}
      {moneyField(
        'purchases',
        'cogs-purchases',
        'Purchases',
        'Merchandise or materials purchased during the period (net of returns/allowances as applicable).'
      )}
      {moneyField(
        'endingInventory',
        'cogs-ending',
        'Ending inventory',
        'Inventory value remaining at the end of the period. Cannot exceed beginning inventory plus purchases.'
      )}

      <div>
        <label htmlFor="cogs-result" className={labelClass}>
          Cost of goods sold (COGS)
          <InfoTooltip
            label="Cost of goods sold (COGS)"
            text="Beginning inventory + purchases − ending inventory."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="cogs-result"
              className={`${inputClass} bg-muted/20 font-semibold`}
              readOnly
              value={result?.cogsDisplay ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cogs-result-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="COGS currency"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
