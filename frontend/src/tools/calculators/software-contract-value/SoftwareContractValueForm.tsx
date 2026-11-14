'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencyFractionDigits, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SoftwareContractValueFieldErrors,
  SoftwareContractValueInput,
  SoftwareContractValueResult,
} from './types';
import { parseOptionalNumber } from './validation';

function formatPlainMoney(
  amount: number,
  currency: SoftwareContractValueInput['currency'],
): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export interface SoftwareContractValueDraft {
  retailPrice: string;
  seats: string;
  discountPercent: string;
  durationYears: string;
  durationMonths: string;
  currency: SoftwareContractValueInput['currency'];
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-[13px] font-semibold tracking-tight text-accent';

export function emptyDraft(
  currency: SoftwareContractValueInput['currency'] = 'PKR',
): SoftwareContractValueDraft {
  return {
    retailPrice: '',
    seats: '',
    discountPercent: '',
    durationYears: '',
    durationMonths: '',
    currency,
  };
}

export function draftToInput(draft: SoftwareContractValueDraft): SoftwareContractValueInput {
  return {
    retailPrice: parseOptionalNumber(draft.retailPrice),
    seats: parseOptionalNumber(draft.seats),
    discountPercent: parseOptionalNumber(draft.discountPercent),
    durationYears: parseOptionalNumber(draft.durationYears),
    durationMonths: parseOptionalNumber(draft.durationMonths),
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
  currency: SoftwareContractValueInput['currency'];
  onValueChange?: (value: string) => void;
  onCurrencyChange: (currency: SoftwareContractValueInput['currency']) => void;
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

interface SoftwareContractValueFormProps {
  draft: SoftwareContractValueDraft;
  errors: SoftwareContractValueFieldErrors;
  result: SoftwareContractValueResult | null;
  onDraftChange: (draft: SoftwareContractValueDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function SoftwareContractValueForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: SoftwareContractValueFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<SoftwareContractValueDraft>) =>
    onDraftChange({ ...draft, ...patch });
  const setCurrency = (currency: SoftwareContractValueDraft['currency']) => set({ currency });

  const moneyOut = (value: number | undefined) =>
    value === undefined ? '—' : formatPlainMoney(value, draft.currency);

  const durationError = errors.durationYears || errors.durationMonths;

  return (
    <form className="space-y-3.5" onSubmit={onSubmit} noValidate autoComplete="off">
      <section className={sectionClass} aria-labelledby="scv-pricing-heading">
        <h3 id="scv-pricing-heading" className={sectionTitleClass}>
          Pricing inputs
        </h3>

        <MoneyRow
          id="scv-retail-price"
          label="Retail price"
          tip="Monthly list price per seat before discount. Currency changes the symbol only."
          value={draft.retailPrice}
          error={errors.retailPrice}
          symbol={symbol}
          currency={draft.currency}
          onValueChange={(retailPrice) => set({ retailPrice })}
          onCurrencyChange={setCurrency}
        />

        <div>
          <label className={labelClass} htmlFor="scv-seats">
            <span>Seats</span>
            <InfoTooltip label="Seats" text="Number of licenses or users on the contract. Must be greater than zero." />
          </label>
          <FieldShell error={errors.seats}>
            <input
              id="scv-seats"
              inputMode="decimal"
              className={inputClass}
              value={draft.seats}
              onChange={(event) => set({ seats: event.target.value })}
              aria-invalid={Boolean(errors.seats)}
            />
          </FieldShell>
          {errors.seats ? <p className="mt-1 text-xs text-rose-600">{errors.seats}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="scv-discount">
            <span>Discount</span>
            <InfoTooltip label="Discount" text="Percentage off retail price per seat (0–100)." />
          </label>
          <div className="relative">
            <FieldShell error={errors.discountPercent}>
              <input
                id="scv-discount"
                inputMode="decimal"
                className={`${inputClass} pr-8`}
                value={draft.discountPercent}
                onChange={(event) => set({ discountPercent: event.target.value })}
                aria-invalid={Boolean(errors.discountPercent)}
              />
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
              %
            </span>
          </div>
          {errors.discountPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountPercent}</p>
          ) : null}
        </div>

        <MoneyRow
          id="scv-discount-amount"
          label="Discount amount"
          tip="Retail price × discount ÷ 100. Shown per seat for the same period as retail price."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={moneyOut(result?.discountAmount)}
        />

        <div>
          <label className={labelClass} htmlFor="scv-duration-years">
            <span>Contract duration</span>
            <InfoTooltip
              label="Contract duration"
              text="Total months = (years × 12) + months. At least one month overall is required."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <FieldShell error={errors.durationYears}>
                <input
                  id="scv-duration-years"
                  inputMode="numeric"
                  className={`${inputClass} pr-10`}
                  value={draft.durationYears}
                  placeholder="0"
                  aria-invalid={Boolean(errors.durationYears)}
                  onChange={(event) => set({ durationYears: event.target.value })}
                />
              </FieldShell>
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                yrs
              </span>
            </div>
            <div className="relative">
              <FieldShell error={errors.durationMonths}>
                <input
                  id="scv-duration-months"
                  inputMode="numeric"
                  className={`${inputClass} pr-10`}
                  value={draft.durationMonths}
                  placeholder="0"
                  aria-invalid={Boolean(errors.durationMonths)}
                  onChange={(event) => set({ durationMonths: event.target.value })}
                />
              </FieldShell>
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                mos
              </span>
            </div>
          </div>
          {durationError ? <p className="mt-1 text-xs text-rose-600">{durationError}</p> : null}
        </div>
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="scv-costs-heading"
      >
        <h3 id="scv-costs-heading" className={sectionTitleClass}>
          Software contract costs
        </h3>

        <MoneyRow
          id="scv-discounted-price"
          label="Discounted price"
          tip="Retail price minus discount amount (per seat / month)."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={moneyOut(result?.discountedPrice)}
        />
        <MoneyRow
          id="scv-monthly-cost"
          label="Monthly cost"
          tip="Discounted price × seats."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={moneyOut(result?.monthlyCost)}
        />
        <MoneyRow
          id="scv-annual-cost"
          label="Annual cost"
          tip="Monthly cost × 12."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={moneyOut(result?.annualCost)}
        />
        <MoneyRow
          id="scv-contract-value"
          label="Contract value"
          tip="Monthly cost × total contract months."
          value=""
          symbol={symbol}
          currency={draft.currency}
          onCurrencyChange={setCurrency}
          readOnly
          displayValue={moneyOut(result?.contractValue)}
        />
      </section>

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
