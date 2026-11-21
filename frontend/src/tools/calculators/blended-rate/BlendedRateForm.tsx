'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MAX_BLENDED_LOANS,
  createEntryId,
  type BlendedRateEntry,
  type BlendedRateFieldErrors,
  type BlendedRateInput,
  type BlendedRateResult,
} from './types';

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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  onRemove,
  canRemove,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  canRemove?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={open}
          onClick={onToggle}
        >
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {canRemove && onRemove ? (
          <button
            type="button"
            className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-rose-700"
            aria-label={`Remove ${title}`}
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface BlendedRateFormProps {
  input: BlendedRateInput;
  errors: BlendedRateFieldErrors;
  result: BlendedRateResult | null;
  onChange: (input: BlendedRateInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function BlendedRateForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: BlendedRateFormProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const e of input.entries) map[e.id] = true;
    return map;
  });
  const symbol = getCurrencySymbol(input.currency);

  const updateEntry = (
    id: string,
    patch: Partial<Pick<BlendedRateEntry, 'balance' | 'rate'>>
  ) => {
    onChange({
      ...input,
      entries: input.entries.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    });
  };

  const addEntry = () => {
    if (input.entries.length >= MAX_BLENDED_LOANS) return;
    const id = createEntryId();
    onChange({
      ...input,
      entries: [...input.entries, { id, balance: '', rate: '' }],
    });
    setOpenIds((prev) => ({ ...prev, [id]: true }));
  };

  const removeEntry = (id: string) => {
    if (input.entries.length <= 1) return;
    onChange({
      ...input,
      entries: input.entries.filter((e) => e.id !== id),
    });
  };

  const atMax = input.entries.length >= MAX_BLENDED_LOANS;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        For each loan, mortgage, or other balance, enter the amount and its
        annual interest rate. The calculator will determine the combined
        balance and blended interest rate.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="br-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for blended rate balances"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX). The
        blended percentage depends on balances and rates, not the currency
        symbol.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the blended rate calculator
        </a>
      </p>

      {input.entries.map((entry, index) => {
        const entryErr = errors.entries?.[entry.id];
        const open = openIds[entry.id] !== false;
        return (
          <CollapsibleSection
            key={entry.id}
            title={`Amortization ${index + 1}`}
            open={open}
            onToggle={() =>
              setOpenIds((prev) => ({ ...prev, [entry.id]: !open }))
            }
            canRemove={input.entries.length > 1}
            onRemove={() => removeEntry(entry.id)}
          >
            <div>
              <label htmlFor={`br-bal-${entry.id}`} className={labelClass}>
                Balance
                <InfoTooltip
                  label="Balance"
                  text="Outstanding loan balance or principal for this rate."
                />
              </label>
              <FieldShell error={entryErr?.balance}>
                <span
                  className="pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
                <input
                  id={`br-bal-${entry.id}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={entry.balance}
                  onChange={(e) =>
                    updateEntry(entry.id, { balance: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(entryErr?.balance)}
                />
              </FieldShell>
              {entryErr?.balance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {entryErr.balance}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={`br-rate-${entry.id}`} className={labelClass}>
                Rate
                <InfoTooltip
                  label="Rate"
                  text="Annual interest rate applied to this balance (percent)."
                />
              </label>
              <FieldShell error={entryErr?.rate}>
                <input
                  id={`br-rate-${entry.id}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={entry.rate}
                  onChange={(e) =>
                    updateEntry(entry.id, { rate: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(entryErr?.rate)}
                />
                <span
                  className="pr-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  %
                </span>
              </FieldShell>
              {entryErr?.rate ? (
                <p className="mt-1 text-xs text-rose-600">{entryErr.rate}</p>
              ) : null}
            </div>
          </CollapsibleSection>
        );
      })}

      <button
        type="button"
        onClick={addEntry}
        disabled={atMax}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white text-sm font-semibold text-accent hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add another loan
      </button>
      {atMax ? (
        <p className="text-xs text-muted-foreground">
          Maximum of {MAX_BLENDED_LOANS} loans reached.
        </p>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
