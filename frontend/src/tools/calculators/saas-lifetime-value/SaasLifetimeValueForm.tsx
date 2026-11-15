'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SaasLifetimeValueFieldErrors,
  SaasLifetimeValueInput,
  SaasLifetimeValueResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(
  amount: number,
  currency: SaasLifetimeValueInput['currency'],
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface SaasLifetimeValueDraft {
  arpa: string;
  dontKnowArpa: boolean;
  recurringRevenue: string;
  numberOfAccounts: string;
  grossMarginPercent: string;
  churnPercent: string;
  accountExpansion: string;
  currency: SaasLifetimeValueInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(
  currency: SaasLifetimeValueInput['currency'] = 'PKR',
): SaasLifetimeValueDraft {
  return {
    arpa: '',
    dontKnowArpa: false,
    recurringRevenue: '',
    numberOfAccounts: '',
    grossMarginPercent: '100',
    churnPercent: '',
    accountExpansion: '0',
    currency,
  };
}

export function draftToInput(draft: SaasLifetimeValueDraft): SaasLifetimeValueInput {
  return {
    arpa: parseOptionalNumber(draft.arpa),
    dontKnowArpa: draft.dontKnowArpa,
    recurringRevenue: parseOptionalNumber(draft.recurringRevenue),
    numberOfAccounts: parseOptionalNumber(draft.numberOfAccounts),
    grossMarginPercent: parseOptionalNumber(draft.grossMarginPercent),
    churnPercent: parseOptionalNumber(draft.churnPercent),
    accountExpansion: parseOptionalNumber(draft.accountExpansion),
    currency: draft.currency,
  };
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function MoneyRow({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValueChange,
  onCurrencyChange,
  readOnly = false,
  displayValue,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  error?: string;
  symbol: string;
  currency: SaasLifetimeValueInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: SaasLifetimeValueInput['currency']) => void;
  readOnly?: boolean;
  displayValue?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="flex items-center gap-2">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          {readOnly ? (
            <output
              id={id}
              className={`${inputClass} flex items-center font-semibold text-primary`}
              aria-live="polite"
            >
              {displayValue ?? '—'}
            </output>
          ) : (
            <input
              id={id}
              inputMode="decimal"
              placeholder=""
              className={inputClass}
              value={value}
              onChange={(event) => onValueChange?.(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          )}
        </FieldShell>
        <div className="w-[120px] shrink-0 sm:w-[130px]">
          <CurrencySelect
            id={`${id}-currency`}
            aria-label={`${label} currency`}
            value={currency}
            onChange={onCurrencyChange}
          />
        </div>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PercentRow({
  id,
  label,
  tip,
  value,
  error,
  onValueChange,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="relative">
        <FieldShell error={error}>
          <input
            id={id}
            inputMode="decimal"
            placeholder=""
            className={`${inputClass} pr-8`}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
        </FieldShell>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
          %
        </span>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SaasLifetimeValueFormProps {
  draft: SaasLifetimeValueDraft;
  errors: SaasLifetimeValueFieldErrors;
  result: SaasLifetimeValueResult | null;
  onDraftChange: (draft: SaasLifetimeValueDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function SaasLifetimeValueForm({
  draft,
  errors,
  result,
  onDraftChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: SaasLifetimeValueFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<SaasLifetimeValueDraft>) => onDraftChange({ ...draft, ...patch });

  const ltvDisplay =
    !result
      ? '—'
      : result.customerLifetimeValue === null
        ? 'No finite estimate'
        : formatPlainMoney(result.customerLifetimeValue, result.currency);

  return (
    <form className="space-y-3.5" onSubmit={onSubmit} noValidate autoComplete="off">
      {!draft.dontKnowArpa ? (
        <MoneyRow
          id="saas-arpa"
          label="Average revenue per account (ARPA)"
          tip="Average recurring revenue per account for the same period as churn (e.g. monthly)."
          value={draft.arpa}
          error={errors.arpa}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(arpa) => set({ arpa })}
          onCurrencyChange={onCurrencyChange}
        />
      ) : null}

      <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          checked={draft.dontKnowArpa}
          onChange={(event) => set({ dontKnowArpa: event.target.checked })}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <span>I don&apos;t know the ARPA.</span>
      </label>

      {draft.dontKnowArpa ? (
        <div className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5">
          <MoneyRow
            id="saas-revenue"
            label="Recurring revenue"
            tip="Total recurring revenue for the period across all accounts."
            value={draft.recurringRevenue}
            error={errors.recurringRevenue}
            symbol={symbol}
            currency={draft.currency}
            onValueChange={(recurringRevenue) => set({ recurringRevenue })}
            onCurrencyChange={onCurrencyChange}
          />
          <div>
            <label className={labelClass} htmlFor="saas-accounts">
              <span>Number of accounts</span>
              <InfoTooltip
                label="Number of accounts"
                text="Paying accounts in the same period. Must be greater than zero."
              />
            </label>
            <FieldShell error={errors.numberOfAccounts}>
              <input
                id="saas-accounts"
                inputMode="decimal"
                className={inputClass}
                value={draft.numberOfAccounts}
                onChange={(event) => set({ numberOfAccounts: event.target.value })}
                aria-invalid={Boolean(errors.numberOfAccounts)}
              />
            </FieldShell>
            {errors.numberOfAccounts ? (
              <p className="mt-1 text-xs text-rose-600">{errors.numberOfAccounts}</p>
            ) : null}
          </div>
          {result?.derivedFromRevenue ? (
            <p className="text-xs text-muted-foreground">
              Derived ARPA: {symbol}
              {formatPlainMoney(result.arpa, result.currency)}
            </p>
          ) : null}
        </div>
      ) : null}

      <PercentRow
        id="saas-margin"
        label="Gross margin"
        tip="Gross margin percent of revenue kept after cost of goods/service (0–100)."
        value={draft.grossMarginPercent}
        error={errors.grossMarginPercent}
        onValueChange={(grossMarginPercent) => set({ grossMarginPercent })}
      />

      <PercentRow
        id="saas-churn"
        label="Churn"
        tip="Customer churn rate for the same period as ARPA. Zero churn means lifetime value has no finite estimate."
        value={draft.churnPercent}
        error={errors.churnPercent}
        onValueChange={(churnPercent) => set({ churnPercent })}
      />

      <MoneyRow
        id="saas-expansion"
        label="Account expansion"
        tip="Additional recurring revenue per account per period from upsells or expansion."
        value={draft.accountExpansion}
        error={errors.accountExpansion}
        symbol={symbol}
        currency={draft.currency}
        onValueChange={(accountExpansion) => set({ accountExpansion })}
        onCurrencyChange={onCurrencyChange}
      />

      <MoneyRow
        id="saas-ltv"
        label="Customer lifetime value (LTV)"
        tip="((ARPA + expansion) × gross margin fraction) ÷ churn fraction. Blank or “No finite estimate” when churn is zero."
        value=""
        symbol={symbol}
        currency={draft.currency}
        onCurrencyChange={onCurrencyChange}
        readOnly
        displayValue={ltvDisplay}
      />

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
