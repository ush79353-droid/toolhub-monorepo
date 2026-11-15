'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CpmCampaignDraft, CpmField } from './types';

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

interface CpmCampaignFieldsProps {
  idPrefix: string;
  draft: CpmCampaignDraft;
  errors: Partial<Record<CpmField | 'form', string>>;
  onChange: (draft: CpmCampaignDraft) => void;
}

export function CpmCampaignFields({
  idPrefix,
  draft,
  errors,
  onChange,
}: CpmCampaignFieldsProps) {
  const symbol = getCurrencySymbol(draft.currency);

  const setField = (field: CpmField, value: string) => {
    const manual = { ...draft.manual };
    if (value.trim() === '') {
      delete manual[field];
    } else {
      manual[field] = true;
    }
    onChange({ ...draft, [field]: value, manual });
  };

  const moneyRow = (field: CpmField, id: string, label: string, tip?: string) => (
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
            onChange={(currency) => onChange({ ...draft, currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[field] ? <p className="mt-1 text-xs text-rose-600">{errors[field]}</p> : null}
    </div>
  );

  return (
    <div className="space-y-4">
      {moneyRow('totalCost', `${idPrefix}-cost`, 'Total cost of a campaign')}
      {moneyRow(
        'cpm',
        `${idPrefix}-cpm`,
        'Cost per 1000 impressions (CPM)',
        'Cost of reaching one thousand impressions. Enter any two of cost, CPM, and impressions to solve the third.'
      )}
      <div>
        <label htmlFor={`${idPrefix}-impressions`} className={labelClass}>
          Number of impressions
        </label>
        <FieldShell error={errors.impressions}>
          <input
            id={`${idPrefix}-impressions`}
            className={inputClass}
            inputMode="decimal"
            value={draft.impressions}
            aria-invalid={Boolean(errors.impressions)}
            onChange={(event) => setField('impressions', event.target.value)}
          />
        </FieldShell>
        {errors.impressions ? (
          <p className="mt-1 text-xs text-rose-600">{errors.impressions}</p>
        ) : null}
      </div>
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </div>
  );
}
