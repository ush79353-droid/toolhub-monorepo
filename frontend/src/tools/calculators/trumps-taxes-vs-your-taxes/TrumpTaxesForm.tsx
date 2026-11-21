'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { COMPARISON_ITEMS } from './comparison-items';
import type { TrumpsTaxesFieldErrors, TrumpsTaxesInput, TrumpsTaxesResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Disclosure({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? <div className="space-y-2 border-t border-border px-3.5 py-3">{children}</div> : null}
    </div>
  );
}

interface TrumpTaxesFormProps {
  input: TrumpsTaxesInput;
  errors: TrumpsTaxesFieldErrors;
  result: TrumpsTaxesResult | null;
  onChange: (input: TrumpsTaxesInput) => void;
  onClear: () => void;
}

export function TrumpTaxesForm({
  input,
  errors,
  result,
  onChange,
  onClear,
}: TrumpTaxesFormProps) {
  const set = (patch: Partial<TrumpsTaxesInput>) => onChange({ ...input, ...patch });

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        Historical illustration only. The default Trump figure ($750) reflects publicly reported
        federal income tax for <strong>2016 and 2017</strong>, not an established 2019 federal
        income tax payment. Your amount is an example entry — not a tax estimate for you.
      </p>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">Tax comparison</h3>

        <div>
          <label className={labelClass} htmlFor="trump-tax-user">
            <span>Your tax in 2019</span>
            <InfoTooltip
              label="Your tax in 2019"
              text="Example federal income tax amount you enter for comparison. Default matches the reference screenshot. This is not a filing estimator."
            />
          </label>
          <FieldShell error={errors.userTax}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="trump-tax-user"
              className={inputClass}
              inputMode="decimal"
              value={input.userTax}
              aria-invalid={Boolean(errors.userTax)}
              onChange={(e) => set({ userTax: e.target.value })}
            />
          </FieldShell>
          {errors.userTax ? <p className="mt-1 text-xs text-rose-600">{errors.userTax}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="trump-tax-trump">
            <span>Trump’s tax (reported historical)</span>
            <InfoTooltip
              label="Trump’s tax"
              text="Default $750 follows publicly reported federal income tax for 2016/2017. Editable for scenario exploration — not a verified 2019 liability."
            />
          </label>
          <FieldShell error={errors.trumpTax}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="trump-tax-trump"
              className={inputClass}
              inputMode="decimal"
              value={input.trumpTax}
              aria-invalid={Boolean(errors.trumpTax)}
              onChange={(e) => set({ trumpTax: e.target.value })}
            />
          </FieldShell>
          {errors.trumpTax ? (
            <p className="mt-1 text-xs text-rose-600">{errors.trumpTax}</p>
          ) : null}
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">You paid…</p>
          <div className="rounded-lg border border-border bg-white px-3 py-3">
            {result ? (
              <>
                <p className="text-2xl font-semibold tabular-nums text-accent">
                  {result.formattedRatio}
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    {result.comparisonPhrase}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{result.ratioLabel}</p>
                <p className="mt-2 text-sm text-foreground/90">
                  Difference:{' '}
                  <span className="font-semibold tabular-nums text-accent">
                    ${result.formattedDifference}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    ({result.formattedPercentageDifference}% vs Trump figure)
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid tax amounts to compare.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" className="h-11" onClick={onClear}>
            Clear / Reset
          </Button>
        </div>
      </form>

      <Disclosure
        title="If you paid as little as Trump (illustrative)"
        open={input.showLuxury}
        onToggle={() => set({ showLuxury: !input.showLuxury })}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          Quantities use the positive tax difference (your tax − Trump’s figure) divided by each
          editable unit price. Prices are illustrative assumptions for education — not verified
          retail quotes.
        </p>
        {result && result.availableForComparisons <= 0 ? (
          <p className="text-xs text-amber-800">
            No positive difference to allocate — your example tax is not higher than Trump’s
            figure.
          </p>
        ) : null}
        <ul className="space-y-2">
          {(result?.luxuryLines ?? []).map((line) => (
            <li
              key={line.id}
              className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              <span className="text-foreground/90">{line.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-accent">
                {line.formattedQuantity}
              </span>
            </li>
          ))}
        </ul>
      </Disclosure>

      <Disclosure
        title="If Trump paid the same taxes as you (illustrative)"
        open={input.showEssential}
        onToggle={() => set({ showEssential: !input.showEssential })}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          Same positive tax difference expressed as everyday essentials at illustrative unit
          prices. Not a policy claim or verified shopping list.
        </p>
        {result && result.availableForComparisons <= 0 ? (
          <p className="text-xs text-amber-800">
            No positive difference to allocate for these comparisons.
          </p>
        ) : null}
        <ul className="space-y-2">
          {(result?.essentialLines ?? []).map((line) => (
            <li
              key={line.id}
              className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              <span className="text-foreground/90">{line.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-accent">
                {line.formattedQuantity}
              </span>
            </li>
          ))}
        </ul>
      </Disclosure>

      <Disclosure
        title="Comparison unit prices (editable assumptions)"
        open={input.showPriceAssumptions}
        onToggle={() => set({ showPriceAssumptions: !input.showPriceAssumptions })}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          Change these USD unit prices to explore other assumptions. Defaults reproduce the
          reference screenshot quantities at $3,202 vs $750 and are not verified market prices.
        </p>
        {errors.unitPrices ? (
          <p className="text-xs text-rose-600">{errors.unitPrices}</p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {COMPARISON_ITEMS.map((item) => (
            <div key={item.id}>
              <label className={labelClass} htmlFor={`trump-price-${item.id}`}>
                <span>
                  {item.label}{' '}
                  <span className="font-normal text-muted-foreground">($ / {item.unitLabel})</span>
                </span>
              </label>
              <FieldShell>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id={`trump-price-${item.id}`}
                  className={inputClass}
                  inputMode="decimal"
                  value={input.unitPrices[item.id] ?? ''}
                  onChange={(e) =>
                    set({
                      unitPrices: { ...input.unitPrices, [item.id]: e.target.value },
                    })
                  }
                />
              </FieldShell>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{item.sourceNote}</p>
            </div>
          ))}
        </div>
      </Disclosure>
    </div>
  );
}
