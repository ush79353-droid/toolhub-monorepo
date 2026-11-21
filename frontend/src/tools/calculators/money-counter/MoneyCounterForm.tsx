'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MONEY_COUNTER_CURRENCIES,
  getDenominationSet,
  isMoneyCounterCurrency,
  type MoneyCounterCurrency,
} from './denominations';
import type {
  MoneyCounterFieldErrors,
  MoneyCounterInput,
  MoneyCounterResult,
} from './types';
import { remapCountsForCurrency } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface MoneyCounterFormProps {
  input: MoneyCounterInput;
  errors: MoneyCounterFieldErrors;
  result: MoneyCounterResult | null;
  onChange: (input: MoneyCounterInput) => void;
}

export function MoneyCounterForm({
  input,
  errors,
  result,
  onChange,
}: MoneyCounterFormProps) {
  const set = (patch: Partial<MoneyCounterInput>) =>
    onChange({ ...input, ...patch });

  const setCurrency = (code: SupportedCurrency) => {
    if (!isMoneyCounterCurrency(code)) return;
    const currency = code as MoneyCounterCurrency;
    set({
      currency,
      counts: remapCountsForCurrency(input.counts, currency),
    });
  };

  const setCount = (id: string, value: string) => {
    set({ counts: { ...input.counts, [id]: value } });
  };

  const set_ = getDenominationSet(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter how many of each banknote (and optionally coin) you have. The
        currency selector changes the denomination list only — it does{' '}
        <span className="font-medium text-accent">not</span> convert amounts
        between currencies.
      </p>

      <div>
        <label htmlFor="money-counter-currency" className={labelClass}>
          Currency
          <InfoTooltip
            label="Currency"
            text="Switches the banknote and coin face values for that currency. No live exchange-rate conversion."
          />
        </label>
        <CurrencySelect
          id="money-counter-currency"
          value={input.currency}
          onChange={setCurrency}
          allowedCodes={MONEY_COUNTER_CURRENCIES}
          showDenominationNote
          aria-label="Currency"
        />
        {errors.currency ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currency}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.includeCoins}
          onChange={(e) => set({ includeCoins: e.target.checked })}
        />
        Include coins
      </label>

      <fieldset className="space-y-3">
        <legend className="text-[15px] font-semibold text-accent">
          Banknotes
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {set_.notes.map((d) => (
            <div key={d.id}>
              <label htmlFor={d.id} className={labelClass}>
                {d.label}
              </label>
              <FieldShell error={errors[d.id]}>
                <input
                  id={d.id}
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.counts[d.id] ?? ''}
                  onChange={(e) => setCount(d.id, e.target.value)}
                  placeholder="0"
                  aria-invalid={Boolean(errors[d.id])}
                />
              </FieldShell>
              {errors[d.id] ? (
                <p className="mt-1 text-xs text-rose-600">{errors[d.id]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>

      {input.includeCoins ? (
        <fieldset className="space-y-3">
          <legend className="text-[15px] font-semibold text-accent">
            Coins
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {set_.coins.map((d) => (
              <div key={d.id}>
                <label htmlFor={d.id} className={labelClass}>
                  {d.label}
                </label>
                <FieldShell error={errors[d.id]}>
                  <input
                    id={d.id}
                    type="text"
                    inputMode="numeric"
                    className={inputClass}
                    value={input.counts[d.id] ?? ''}
                    onChange={(e) => setCount(d.id, e.target.value)}
                    placeholder="0"
                    aria-invalid={Boolean(errors[d.id])}
                  />
                </FieldShell>
                {errors[d.id] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[d.id]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div>
        <p className={labelClass}>Total money</p>
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {result ? result.formattedTotal : '—'}
          </p>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.pieceCount} piece
              {result.pieceCount === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
        {errors.counts ? (
          <p className="mt-1 text-xs text-rose-600">{errors.counts}</p>
        ) : null}
      </div>
    </form>
  );
}
