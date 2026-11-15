'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  MONEY_FIELDS,
  PERCENT_FIELDS,
  type OmcDraft,
  type OmcField,
  type OmcFieldErrors,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  open = true,
  onToggle,
  children,
}: {
  title: string;
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  if (onToggle) {
    return (
      <details
        open={open}
        className="rounded-xl border border-border bg-muted/15"
        onToggle={(event) => {
          const nextOpen = (event.target as HTMLDetailsElement).open;
          if (nextOpen !== open) onToggle();
        }}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          {title}
        </summary>
        <div className="space-y-3.5 px-4 pb-4">{children}</div>
      </details>
    );
  }
  return (
    <details open className="rounded-xl border border-border bg-muted/15">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3.5 px-4 pb-4">{children}</div>
    </details>
  );
}

interface FieldDef {
  key: OmcField;
  label: string;
  tip?: string;
}

interface OnlineMarketingConversionFormProps {
  draft: OmcDraft;
  errors: OmcFieldErrors;
  onChange: (draft: OmcDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function OnlineMarketingConversionForm({
  draft,
  errors,
  onChange,
  onCurrencyChange,
  onReset,
}: OnlineMarketingConversionFormProps) {
  const symbol = getCurrencySymbol(draft.currency);

  const setField = (key: OmcField, value: string) => {
    const manual = { ...draft.manual };
    if (value.trim() === '') {
      delete manual[key];
    } else {
      manual[key] = true;
    }
    onChange({ ...draft, [key]: value, manual });
  };

  const renderField = ({ key, label, tip }: FieldDef) => {
    const isMoney = MONEY_FIELDS.has(key);
    const isPercent = PERCENT_FIELDS.has(key);
    const id = `omc-${key}`;
    return (
      <div key={key}>
        <label className={labelClass} htmlFor={id}>
          <span>{label}</span>
          {tip ? <InfoTooltip label={label} text={tip} /> : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors[key]}>
            {isMoney ? (
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
            ) : null}
            <input
              id={id}
              className={`${inputClass} ${isPercent ? 'pr-8' : ''}`}
              inputMode="decimal"
              value={draft[key]}
              aria-invalid={Boolean(errors[key])}
              onChange={(event) => setField(key, event.target.value)}
            />
            {isPercent ? (
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            ) : null}
          </FieldShell>
          {isMoney ? (
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id={`${id}-currency`}
                value={draft.currency}
                onChange={onCurrencyChange}
                aria-label={`${label} currency`}
              />
            </div>
          ) : null}
        </div>
        {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
      </div>
    );
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <Section title="Conversions">
        {renderField({ key: 'impressions', label: 'Impressions', tip: 'Ad views in the campaign period.' })}
        {renderField({
          key: 'ctr',
          label: 'Click-through-rate (CTR)',
          tip: 'Percent of impressions that become visits/clicks.',
        })}
        {renderField({ key: 'visits', label: 'Visits' })}
        {renderField({
          key: 'visitsToLeads',
          label: 'Visits to leads',
          tip: 'Percent of visits that become leads.',
        })}
        {renderField({ key: 'leads', label: 'Leads' })}
        {renderField({
          key: 'leadsToCustomers',
          label: 'Leads to customers',
          tip: 'Percent of leads that become customers.',
        })}
        {renderField({ key: 'customers', label: 'Customers' })}
      </Section>

      <Section title="Costs">
        {renderField({ key: 'totalCost', label: 'Total cost' })}
        {renderField({
          key: 'cpm',
          label: 'Cost per mille or thousand (CPM)',
          tip: 'Cost per 1,000 impressions.',
        })}
        {renderField({ key: 'cpc', label: 'Cost per click (CPC)' })}
        {renderField({ key: 'costPerLead', label: 'Cost per lead' })}
        {renderField({ key: 'costPerCustomer', label: 'Cost per customer' })}
      </Section>

      <Section title="Revenue">
        {renderField({ key: 'revenue', label: 'Revenue' })}
        {renderField({
          key: 'roi',
          label: 'Return on investment (ROI)',
          tip: '(Revenue − total cost) ÷ total cost × 100.',
        })}
        {renderField({ key: 'revenuePerClick', label: 'Revenue per click' })}
        {renderField({ key: 'revenuePerLead', label: 'Revenue per lead' })}
        {renderField({ key: 'revenuePerCustomer', label: 'Revenue per customer' })}
      </Section>

      <Section
        title="Lifetime value (LTV)"
        open={draft.ltvOpen}
        onToggle={() => onChange({ ...draft, ltvOpen: !draft.ltvOpen })}
      >
        {renderField({
          key: 'ordersPerCustomer',
          label: 'Number of orders per customer',
          tip: 'Average lifetime orders per acquired customer.',
        })}
        {renderField({
          key: 'customerLtv',
          label: 'Customer LTV',
          tip: 'Revenue per customer × orders per customer.',
        })}
        {renderField({
          key: 'totalLifetimeRevenue',
          label: 'Total revenue',
          tip: 'Campaign revenue × orders per customer (lifetime assumption).',
        })}
      </Section>

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
