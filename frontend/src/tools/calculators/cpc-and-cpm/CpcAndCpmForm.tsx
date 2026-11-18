'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CpcCpmDraft, CpcCpmField } from './types';

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

interface CpcAndCpmFormProps {
  draft: CpcCpmDraft;
  errors: Partial<Record<CpcCpmField | 'form', string>>;
  onDraftChange: (draft: CpcCpmDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function CpcAndCpmForm({
  draft,
  errors,
  onDraftChange,
  onCurrencyChange,
  onReset,
}: CpcAndCpmFormProps) {
  const symbol = getCurrencySymbol(draft.currency);

  const setField = (field: CpcCpmField, value: string) => {
    const manual = { ...draft.manual };
    if (value.trim() === '') {
      delete manual[field];
    } else {
      manual[field] = true;
    }
    onDraftChange({ ...draft, [field]: value, manual });
  };

  const moneyRow = (
    field: CpcCpmField,
    id: string,
    label: string,
    tip?: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
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
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[field] ? <p className="mt-1 text-xs text-rose-600">{errors[field]}</p> : null}
    </div>
  );

  const plainRow = (
    field: CpcCpmField,
    id: string,
    label: string,
    tip?: string,
    suffix?: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="relative">
        <FieldShell error={errors[field]}>
          <input
            id={id}
            className={`${inputClass} ${suffix ? 'pr-10' : ''}`}
            inputMode="decimal"
            value={draft[field]}
            aria-invalid={Boolean(errors[field])}
            onChange={(event) => setField(field, event.target.value)}
          />
        </FieldShell>
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
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
      {plainRow('impressions', 'cpc-impressions', 'Impressions')}
      {moneyRow(
        'cpc',
        'cpc-cpc',
        'Cost per click (CPC)',
        'Average amount paid for each click.'
      )}
      {plainRow(
        'ctr',
        'cpc-ctr',
        'Click-through rate (CTR)',
        'Clicks divided by impressions, as a percent.',
        '%'
      )}
      {plainRow('clicks', 'cpc-clicks', 'Clicks')}
      {moneyRow('totalCost', 'cpc-total', 'Total cost')}
      {moneyRow(
        'cpm',
        'cpc-cpm',
        'Cost per mille (CPM)',
        'Cost per 1,000 impressions (mille).'
      )}

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
