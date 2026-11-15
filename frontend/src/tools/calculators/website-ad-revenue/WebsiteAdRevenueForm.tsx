'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WebsiteAdRevenueFieldErrors,
  WebsiteAdRevenueInput,
  WebsiteAdRevenueResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
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

interface WebsiteAdRevenueFormProps {
  input: WebsiteAdRevenueInput;
  errors: WebsiteAdRevenueFieldErrors;
  result: WebsiteAdRevenueResult | null;
  onChange: (input: WebsiteAdRevenueInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function WebsiteAdRevenueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: WebsiteAdRevenueFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<WebsiteAdRevenueInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof WebsiteAdRevenueInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<WebsiteAdRevenueInput>);
    };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="ad-revenue-traffic-heading">
        <h3 id="ad-revenue-traffic-heading" className="text-sm font-semibold text-accent">
          Traffic & revenue
        </h3>

        <div>
          <label htmlFor="ad-revenue-visits" className={labelClass}>
            Visits
            <InfoTooltip label="Visits" text="Number of visits for the period you are estimating." />
          </label>
          <FieldShell error={errors.visits}>
            <input
              id="ad-revenue-visits"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.visits)}
              aria-invalid={Boolean(errors.visits)}
              onChange={onNumber('visits')}
            />
          </FieldShell>
          {errors.visits ? <p className="mt-1 text-xs text-rose-600">{errors.visits}</p> : null}
        </div>

        <div>
          <label htmlFor="ad-revenue-pv-per-visit" className={labelClass}>
            Page views per visit
            <InfoTooltip
              label="Page views per visit"
              text="Average pages viewed in each visit."
            />
          </label>
          <FieldShell error={errors.pageViewsPerVisit}>
            <input
              id="ad-revenue-pv-per-visit"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.pageViewsPerVisit)}
              aria-invalid={Boolean(errors.pageViewsPerVisit)}
              onChange={onNumber('pageViewsPerVisit')}
            />
          </FieldShell>
          {errors.pageViewsPerVisit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pageViewsPerVisit}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ad-revenue-page-views" className={labelClass}>
            Page views
            <InfoTooltip
              label="Page views"
              text="Visits × page views per visit."
            />
          </label>
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
            <input
              id="ad-revenue-page-views"
              className={`${inputClass} cursor-default font-semibold text-accent`}
              readOnly
              value={result?.pageViewsDisplay ?? ''}
              aria-live="polite"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ad-revenue-page-rpm" className={labelClass}>
            Page RPM
            <InfoTooltip
              label="Page RPM"
              text="Revenue per 1,000 page views. Changing currency converts RPM and estimated revenue; traffic counts stay the same."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.pageRpm}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="ad-revenue-page-rpm"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.pageRpm)}
                aria-invalid={Boolean(errors.pageRpm)}
                onChange={onNumber('pageRpm')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ad-revenue-page-rpm-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Page RPM currency"
              />
            </div>
          </div>
          {errors.pageRpm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pageRpm}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ad-revenue-revenue" className={labelClass}>
            Revenue
            <InfoTooltip
              label="Revenue"
              text="(Page views ÷ 1,000) × page RPM."
            />
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="ad-revenue-revenue"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.revenueDisplay ?? ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ad-revenue-revenue-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Revenue currency"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
