'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PvgoFieldErrors, PvgoInput, PvgoResult } from './types';

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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface PvgoFormProps {
  input: PvgoInput;
  errors: PvgoFieldErrors;
  result: PvgoResult | null;
  onChange: (input: PvgoInput) => void;
  onReset: () => void;
}

export function PvgoForm({ input, errors, result, onChange, onReset }: PvgoFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PvgoInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof PvgoInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<PvgoInput>);
    };

  const moneyInput = (
    key: 'earnings' | 'sharePrice',
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

  const moneyOutput = (id: string, label: string, tip: string, display: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <ReadOnlyShell>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="pvgo-eps-heading">
        <h3 id="pvgo-eps-heading" className={sectionTitleClass}>
          EPS
        </h3>

        {moneyInput(
          'earnings',
          'pvgo-earnings',
          'Earnings',
          'Total earnings attributable to common shareholders. Currency labels amounts only.'
        )}

        <div>
          <label htmlFor="pvgo-shares" className={labelClass}>
            Number of shares outstanding
            <InfoTooltip
              label="Number of shares outstanding"
              text="Common shares used for EPS. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.sharesOutstanding}>
            <input
              id="pvgo-shares"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.sharesOutstanding)}
              aria-invalid={Boolean(errors.sharesOutstanding)}
              onChange={onNumber('sharesOutstanding')}
            />
          </FieldShell>
          {errors.sharesOutstanding ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sharesOutstanding}</p>
          ) : null}
        </div>

        {moneyOutput(
          'pvgo-eps',
          'Earnings per share (EPS)',
          'Earnings ÷ shares outstanding.',
          result?.epsDisplay ?? ''
        )}
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="pvgo-main-heading"
      >
        <h3 id="pvgo-main-heading" className={sectionTitleClass}>
          PVGO
        </h3>

        {moneyInput(
          'sharePrice',
          'pvgo-share-price',
          'Share price',
          'Current market price per share in the selected currency.'
        )}

        <div>
          <label htmlFor="pvgo-cost-equity" className={labelClass}>
            Cost of equity
            <InfoTooltip
              label="Cost of equity"
              text="Required return on equity as a percent. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.costOfEquityPercent}>
            <input
              id="pvgo-cost-equity"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={numberOrBlank(input.costOfEquityPercent)}
              aria-invalid={Boolean(errors.costOfEquityPercent)}
              onChange={onNumber('costOfEquityPercent')}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.costOfEquityPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.costOfEquityPercent}</p>
          ) : null}
        </div>

        {moneyOutput(
          'pvgo-result',
          'Present value of growth opportunities (PVGO)',
          'Share price − (EPS ÷ cost of equity). May be negative if the market prices no-growth value above the share price.',
          result?.pvgoDisplay ?? ''
        )}
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
