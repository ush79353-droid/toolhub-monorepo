'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { PpmDraft, PpmField } from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

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

interface PreAndPostMoneyValuationFormProps {
  draft: PpmDraft;
  errors: Partial<Record<PpmField | 'form', string>>;
  onDraftChange: (draft: PpmDraft) => void;
  onReset: () => void;
}

export function PreAndPostMoneyValuationForm({
  draft,
  errors,
  onDraftChange,
  onReset,
}: PreAndPostMoneyValuationFormProps) {
  const symbol = getCurrencySymbol(draft.currency);

  const setField = (field: PpmField, value: string) => {
    const manual = { ...draft.manual };
    if (value.trim() === '') {
      delete manual[field];
    } else {
      manual[field] = true;
    }
    onDraftChange({ ...draft, [field]: value, manual });
  };

  const setCurrency = (currency: PpmDraft['currency']) => {
    onDraftChange({ ...draft, currency });
  };

  const moneyRow = (field: PpmField, id: string, label: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[field]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={draft[field]}
            aria-invalid={Boolean(errors[field])}
            onChange={(event) => setField(field, event.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={draft.currency}
            onChange={setCurrency}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[field] ? <p className="mt-1 text-xs text-rose-600">{errors[field]}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {moneyRow('investment', 'ppm-investment', 'Investment')}

      <div>
        <label htmlFor="ppm-equity" className={labelClass}>
          Investor&apos;s equity
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.equity}>
            <input
              id="ppm-equity"
              className={inputClass}
              inputMode="decimal"
              value={draft.equity}
              aria-invalid={Boolean(errors.equity)}
              onChange={(event) => setField('equity', event.target.value)}
            />
          </FieldShell>
          <span className={unitClass} aria-hidden="true">
            %
          </span>
        </div>
        {errors.equity ? <p className="mt-1 text-xs text-rose-600">{errors.equity}</p> : null}
      </div>

      {moneyRow('preMoney', 'ppm-pre', 'Pre-money valuation')}
      {moneyRow('postMoney', 'ppm-post', 'Post-money valuation')}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
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
