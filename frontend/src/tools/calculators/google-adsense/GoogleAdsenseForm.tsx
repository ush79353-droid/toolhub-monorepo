'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GoogleAdsenseFieldErrors,
  GoogleAdsenseInput,
  GoogleAdsenseResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
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

interface GoogleAdsenseFormProps {
  input: GoogleAdsenseInput;
  errors: GoogleAdsenseFieldErrors;
  result: GoogleAdsenseResult | null;
  onChange: (input: GoogleAdsenseInput) => void;
  onReset: () => void;
}

export function GoogleAdsenseForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: GoogleAdsenseFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<GoogleAdsenseInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof GoogleAdsenseInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<GoogleAdsenseInput>);
    };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="adsense-impressions-heading">
        <h3 id="adsense-impressions-heading" className={sectionTitleClass}>
          Ad impressions
        </h3>

        <div>
          <label htmlFor="adsense-pageviews" className={labelClass}>
            Number of pageviews
            <InfoTooltip
              label="Number of pageviews"
              text="Daily pageviews for the site or page."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.pageviews}>
              <input
                id="adsense-pageviews"
                className={`${inputClass} pr-16`}
                inputMode="decimal"
                value={numberOrBlank(input.pageviews)}
                aria-invalid={Boolean(errors.pageviews)}
                onChange={onNumber('pageviews')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                / day
              </span>
            </FieldShell>
          </div>
          {errors.pageviews ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pageviews}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="adsense-ads-per-page" className={labelClass}>
            Number of ads per page
            <InfoTooltip
              label="Number of ads per page"
              text="Average AdSense ad units shown per pageview."
            />
          </label>
          <FieldShell error={errors.adsPerPage}>
            <input
              id="adsense-ads-per-page"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.adsPerPage)}
              aria-invalid={Boolean(errors.adsPerPage)}
              onChange={onNumber('adsPerPage')}
            />
          </FieldShell>
          {errors.adsPerPage ? (
            <p className="mt-1 text-xs text-rose-600">{errors.adsPerPage}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="adsense-impressions" className={labelClass}>
            Ad impressions
            <InfoTooltip
              label="Ad impressions"
              text="Pageviews × ads per page."
            />
          </label>
          <div className="relative">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
              <input
                id="adsense-impressions"
                className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
                readOnly
                value={result?.impressionsDisplay ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                / day
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="adsense-clicks-heading">
        <h3 id="adsense-clicks-heading" className={sectionTitleClass}>
          Number of clicks
        </h3>

        <div>
          <label htmlFor="adsense-ctr" className={labelClass}>
            Click-through rate (CTR)
            <InfoTooltip
              label="Click-through rate (CTR)"
              text="Percent of impressions that result in a click (0–100)."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.ctrPercent}>
              <input
                id="adsense-ctr"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={numberOrBlank(input.ctrPercent)}
                aria-invalid={Boolean(errors.ctrPercent)}
                onChange={onNumber('ctrPercent')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </FieldShell>
          </div>
          {errors.ctrPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ctrPercent}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="adsense-clicks" className={labelClass}>
            Number of clicks
            <InfoTooltip
              label="Number of clicks"
              text="Ad impressions × (CTR ÷ 100)."
            />
          </label>
          <div className="relative">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
              <input
                id="adsense-clicks"
                className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
                readOnly
                value={result?.clicksDisplay ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                / day
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="adsense-revenue-heading"
      >
        <h3 id="adsense-revenue-heading" className={sectionTitleClass}>
          Google AdSense revenue
        </h3>

        <div>
          <label htmlFor="adsense-cpc" className={labelClass}>
            Cost per click (CPC)
            <InfoTooltip
              label="Cost per click (CPC)"
              text="Average earnings per click. Currency labels amounts only; it does not convert."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cpc}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="adsense-cpc"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.cpc)}
                aria-invalid={Boolean(errors.cpc)}
                onChange={onNumber('cpc')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="adsense-cpc-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Cost per click currency"
              />
            </div>
          </div>
          {errors.cpc ? <p className="mt-1 text-xs text-rose-600">{errors.cpc}</p> : null}
        </div>

        <div>
          <label htmlFor="adsense-revenue" className={labelClass}>
            Google AdSense revenue
            <InfoTooltip
              label="Google AdSense revenue"
              text="Number of clicks × CPC, shown per day."
            />
          </label>
          <div className="flex gap-2">
            <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="adsense-revenue"
                className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
                readOnly
                value={result?.revenueDisplay ?? ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                / day
              </span>
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="adsense-revenue-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
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
