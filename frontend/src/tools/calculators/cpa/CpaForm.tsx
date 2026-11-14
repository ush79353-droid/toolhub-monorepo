'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { CpaFieldErrors, CpaInput, CpaResult } from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const sectionClass = 'space-y-4 rounded-xl border border-border bg-muted/20 p-4';
const sectionTitleClass = 'text-[13px] font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

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

interface CpaFormProps {
  input: CpaInput;
  errors: CpaFieldErrors;
  result: CpaResult | null;
  onChange: (input: CpaInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function CpaForm({ input, errors, result, onChange, onSubmit, onReset }: CpaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CpaInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof CpaInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<CpaInput>);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-labelledby="cpa-spend-heading">
        <h3 id="cpa-spend-heading" className={sectionTitleClass}>
          Total ad spend
        </h3>

        <div>
          <label className={labelClass} htmlFor="cpa-clicks">
            Number of clicks
          </label>
          <FieldShell error={errors.numberOfClicks}>
            <input
              id="cpa-clicks"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.numberOfClicks)}
              aria-invalid={Boolean(errors.numberOfClicks)}
              onChange={onNumber('numberOfClicks')}
            />
          </FieldShell>
          {errors.numberOfClicks ? (
            <p className="mt-1 text-xs text-rose-600">{errors.numberOfClicks}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cpa-cpc">
            Average cost per click (CPC)
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.averageCpc}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cpa-cpc"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.averageCpc)}
                aria-invalid={Boolean(errors.averageCpc)}
                onChange={onNumber('averageCpc')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cpa-cpc-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.averageCpc ? (
            <p className="mt-1 text-xs text-rose-600">{errors.averageCpc}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cpa-ad-spend">
            Total ad spend
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cpa-ad-spend"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.adSpendDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cpa-ad-spend-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Total ad spend currency"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="cpa-result-heading">
        <h3 id="cpa-result-heading" className={sectionTitleClass}>
          Cost per acquisition
        </h3>

        <div>
          <label className={labelClass} htmlFor="cpa-conversions">
            Total attributed conversions
          </label>
          <FieldShell error={errors.totalConversions}>
            <input
              id="cpa-conversions"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.totalConversions)}
              aria-invalid={Boolean(errors.totalConversions)}
              onChange={onNumber('totalConversions')}
            />
          </FieldShell>
          {errors.totalConversions ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalConversions}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cpa-cpa">
            Cost per acquisition (CPA)
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cpa-cpa"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.cpaDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cpa-cpa-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="CPA currency"
              />
            </div>
          </div>
        </div>
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
