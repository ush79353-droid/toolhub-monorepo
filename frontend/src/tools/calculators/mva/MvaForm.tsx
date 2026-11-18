'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { MvaFieldErrors, MvaInput, MvaResult } from './types';

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

interface MvaFormProps {
  input: MvaInput;
  errors: MvaFieldErrors;
  result: MvaResult | null;
  onChange: (input: MvaInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function MvaForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: MvaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MvaInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof MvaInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<MvaInput>);
    };

  const moneyInput = (
    key: 'currentSharePrice' | 'capitalInvested',
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
            onChange={onCurrencyChange}
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
            onChange={onCurrencyChange}
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
      <section className={sectionClass} aria-labelledby="mva-market-value-heading">
        <h3 id="mva-market-value-heading" className={sectionTitleClass}>
          Current market value
        </h3>

        {moneyInput(
          'currentSharePrice',
          'mva-share-price',
          'Current share price',
          'Market price per share. Currency labels amounts only; it does not convert.'
        )}

        <div>
          <label htmlFor="mva-shares" className={labelClass}>
            Shares outstanding
            <InfoTooltip
              label="Shares outstanding"
              text="Total common shares outstanding. Must be a whole non-negative number."
            />
          </label>
          <FieldShell error={errors.sharesOutstanding}>
            <input
              id="mva-shares"
              className={inputClass}
              inputMode="numeric"
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
          'mva-current-market-value',
          'Current market value',
          'Current share price × shares outstanding.',
          result?.currentMarketValueDisplay ?? ''
        )}
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="mva-main-heading"
      >
        <h3 id="mva-main-heading" className={sectionTitleClass}>
          MVA
        </h3>

        {moneyInput(
          'capitalInvested',
          'mva-capital-invested',
          'Capital invested',
          'Total capital invested in the business, in the selected currency.'
        )}

        {moneyOutput(
          'mva-result',
          'Market value added (MVA)',
          'Current market value − capital invested. Positive means market value exceeds invested capital.',
          result?.mvaDisplay ?? ''
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
