'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calculator, RotateCcw } from 'lucide-react';
import { formatCurrencyValue } from './calculation';
import {
  CURRENCY_OPTIONS,
  type AutoLoanFieldErrors,
  type AutoLoanInput,
  type CostInclusion,
  type DownPaymentMode,
  type SupportedCurrency,
  type TaxPolicy,
  type TermUnit,
} from './types';

export interface AutoLoanDraft {
  autoPrice: string;
  downPaymentValue: string;
  downPaymentMode: DownPaymentMode;
  loanTermValue: string;
  loanTermUnit: TermUnit;
  annualInterestRate: string;
  tradeInValue: string;
  tradeInOwed: string;
  salesTaxRate: string;
  taxPolicy: TaxPolicy;
  salesTaxInclusion: CostInclusion;
  additionalFees: string;
  feesInclusion: CostInclusion;
  startDate: string;
  currency: SupportedCurrency;
}

export function inputToDraft(input: AutoLoanInput): AutoLoanDraft {
  return {
    autoPrice: String(input.autoPrice),
    downPaymentValue: String(input.downPaymentValue),
    downPaymentMode: input.downPaymentMode,
    loanTermValue: String(input.loanTermValue),
    loanTermUnit: input.loanTermUnit,
    annualInterestRate: String(input.annualInterestRate),
    tradeInValue: String(input.tradeInValue),
    tradeInOwed: String(input.tradeInOwed),
    salesTaxRate: String(input.salesTaxRate),
    taxPolicy: input.taxPolicy,
    salesTaxInclusion: input.salesTaxInclusion,
    additionalFees: String(input.additionalFees),
    feesInclusion: input.feesInclusion,
    startDate: input.startDate,
    currency: input.currency,
  };
}

function parseDraftNumber(raw: string): number {
  const cleaned = raw.trim();
  if (cleaned === '') return NaN;
  return Number(cleaned);
}

export function draftToInput(draft: AutoLoanDraft): AutoLoanInput {
  return {
    autoPrice: parseDraftNumber(draft.autoPrice),
    downPaymentValue: parseDraftNumber(draft.downPaymentValue),
    downPaymentMode: draft.downPaymentMode,
    loanTermValue: parseDraftNumber(draft.loanTermValue),
    loanTermUnit: draft.loanTermUnit,
    annualInterestRate: parseDraftNumber(draft.annualInterestRate),
    tradeInValue: parseDraftNumber(draft.tradeInValue),
    tradeInOwed: parseDraftNumber(draft.tradeInOwed),
    salesTaxRate: parseDraftNumber(draft.salesTaxRate),
    taxPolicy: draft.taxPolicy,
    salesTaxInclusion: draft.salesTaxInclusion,
    additionalFees: parseDraftNumber(draft.additionalFees),
    feesInclusion: draft.feesInclusion,
    startDate: draft.startDate,
    currency: draft.currency,
  };
}

interface AutoLoanFormProps {
  draft: AutoLoanDraft;
  errors: AutoLoanFieldErrors;
  onDraftChange: (nextDraft: AutoLoanDraft) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
}

function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex shrink-0 rounded-lg border border-border bg-background p-0.5"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function AutoLoanForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AutoLoanFormProps) {
  const update = <K extends keyof AutoLoanDraft>(key: K, value: AutoLoanDraft[K]) => {
    onDraftChange({ ...draft, [key]: value });
  };

  const handleDownPaymentModeChange = (nextMode: DownPaymentMode) => {
    if (nextMode === draft.downPaymentMode) return;
    const price = parseDraftNumber(draft.autoPrice);
    const current = parseDraftNumber(draft.downPaymentValue);
    let converted = draft.downPaymentValue;

    if (Number.isFinite(price) && price > 0 && Number.isFinite(current) && current >= 0) {
      if (nextMode === 'percent') {
        converted = String(Number(((current / price) * 100).toFixed(2)));
      } else {
        converted = String(Number(((price * current) / 100).toFixed(2)));
      }
    }

    onDraftChange({
      ...draft,
      downPaymentMode: nextMode,
      downPaymentValue: converted,
    });
  };

  const handleTermUnitChange = (nextUnit: TermUnit) => {
    if (nextUnit === draft.loanTermUnit) return;
    const current = parseDraftNumber(draft.loanTermValue);
    let converted = draft.loanTermValue;

    if (Number.isFinite(current) && current > 0) {
      converted =
        nextUnit === 'years'
          ? String(Number((current / 12).toFixed(2)))
          : String(Math.round(current * 12));
    }

    onDraftChange({
      ...draft,
      loanTermUnit: nextUnit,
      loanTermValue: converted,
    });
  };

  const parsedPrice = parseDraftNumber(draft.autoPrice);
  const parsedDown = parseDraftNumber(draft.downPaymentValue);
  const downHint =
    Number.isFinite(parsedPrice) && parsedPrice > 0 && Number.isFinite(parsedDown) && parsedDown >= 0
      ? draft.downPaymentMode === 'percent'
        ? `Equals ${formatCurrencyValue((parsedPrice * parsedDown) / 100, draft.currency)} upfront`
        : `Equals ${((parsedDown / parsedPrice) * 100).toFixed(1)}% of vehicle price`
      : 'Cash paid at signing toward vehicle price.';

  const parsedTradeIn = parseDraftNumber(draft.tradeInValue);
  const parsedTradeOwed = parseDraftNumber(draft.tradeInOwed);
  const tradeEquity =
    Number.isFinite(parsedTradeIn) && Number.isFinite(parsedTradeOwed)
      ? parsedTradeIn - parsedTradeOwed
      : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Display Currency */}
      <div className="rounded-xl border border-border bg-background/70 p-3.5">
        <label htmlFor="auto-loan-currency" className="block text-xs font-bold text-accent">
          Display Currency
        </label>
        <Select
          id="auto-loan-currency"
          value={draft.currency}
          onChange={(e) => update('currency', e.target.value as SupportedCurrency)}
          className="mt-1.5 h-9 text-xs"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </Select>
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
          Selected currency changes formatting only; no exchange-rate conversion is applied.
        </p>
      </div>

      {/* Vehicle Price */}
      <div>
        <label htmlFor="auto-loan-price" className="block text-xs font-bold text-accent">
          Auto Price ({draft.currency})
        </label>
        <Input
          id="auto-loan-price"
          type="number"
          inputMode="decimal"
          min="1"
          step="any"
          value={draft.autoPrice}
          onChange={(e) => update('autoPrice', e.target.value)}
          aria-invalid={Boolean(errors.autoPrice)}
          className={`mt-1.5 ${errors.autoPrice ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
        />
        {errors.autoPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.autoPrice}</p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Agreed purchase price before tax, fees, down payment, and trade-in.
          </p>
        )}
      </div>

      {/* Down Payment */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="auto-loan-down-payment" className="text-xs font-bold text-accent">
            Down Payment
          </label>
          <SegmentedToggle
            label="Down payment mode"
            value={draft.downPaymentMode}
            options={[
              { value: 'amount', label: draft.currency },
              { value: 'percent', label: '%' },
            ]}
            onChange={handleDownPaymentModeChange}
          />
        </div>
        <Input
          id="auto-loan-down-payment"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={draft.downPaymentValue}
          onChange={(e) => update('downPaymentValue', e.target.value)}
          aria-invalid={Boolean(errors.downPaymentValue)}
          className={`mt-1.5 ${errors.downPaymentValue ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
        />
        {errors.downPaymentValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.downPaymentValue}</p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">{downHint}</p>
        )}
      </div>

      {/* Loan Term & Annual Interest Rate */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="auto-loan-term" className="text-xs font-bold text-accent">
              Loan Term
            </label>
            <SegmentedToggle
              label="Loan term unit"
              value={draft.loanTermUnit}
              options={[
                { value: 'months', label: 'Mo' },
                { value: 'years', label: 'Yr' },
              ]}
              onChange={handleTermUnitChange}
            />
          </div>
          <Input
            id="auto-loan-term"
            type="number"
            inputMode="decimal"
            min="1"
            step={draft.loanTermUnit === 'months' ? '1' : 'any'}
            value={draft.loanTermValue}
            onChange={(e) => update('loanTermValue', e.target.value)}
            aria-invalid={Boolean(errors.loanTermValue)}
            className={`mt-1.5 ${errors.loanTermValue ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
          />
          {errors.loanTermValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermValue}</p>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Up to 360 months (30 years).
            </p>
          )}
        </div>

        <div>
          <label htmlFor="auto-loan-apr" className="block text-xs font-bold text-accent leading-7">
            Interest Rate (APR %)
          </label>
          <Input
            id="auto-loan-apr"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.01"
            value={draft.annualInterestRate}
            onChange={(e) => update('annualInterestRate', e.target.value)}
            aria-invalid={Boolean(errors.annualInterestRate)}
            className={`mt-1.5 ${errors.annualInterestRate ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
          />
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
          ) : (
            <p className="mt-1 text-[11px] text-muted-foreground">Supports 0% promotional APR.</p>
          )}
        </div>
      </div>

      {/* Trade-in Section */}
      <div className="space-y-3 rounded-xl border border-border bg-muted/35 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-accent">Trade-In Details</span>
          {tradeEquity !== null && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                tradeEquity > 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : tradeEquity < 0
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-white text-muted-foreground'
              }`}
            >
              {tradeEquity > 0
                ? `+${formatCurrencyValue(tradeEquity, draft.currency)} equity`
                : tradeEquity < 0
                  ? `${formatCurrencyValue(tradeEquity, draft.currency)} negative equity`
                  : 'Even equity'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="auto-loan-trade-value" className="block text-xs font-semibold text-accent">
              Trade-in Value ({draft.currency})
            </label>
            <Input
              id="auto-loan-trade-value"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={draft.tradeInValue}
              onChange={(e) => update('tradeInValue', e.target.value)}
              aria-invalid={Boolean(errors.tradeInValue)}
              className={`mt-1 h-9 text-xs ${errors.tradeInValue ? 'border-rose-500' : ''}`}
            />
            {errors.tradeInValue && (
              <p className="mt-1 text-[11px] text-rose-600">{errors.tradeInValue}</p>
            )}
          </div>

          <div>
            <label htmlFor="auto-loan-trade-owed" className="block text-xs font-semibold text-accent">
              Amount Owed on Trade-in
            </label>
            <Input
              id="auto-loan-trade-owed"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={draft.tradeInOwed}
              onChange={(e) => update('tradeInOwed', e.target.value)}
              aria-invalid={Boolean(errors.tradeInOwed)}
              className={`mt-1 h-9 text-xs ${errors.tradeInOwed ? 'border-rose-500' : ''}`}
            />
            {errors.tradeInOwed && (
              <p className="mt-1 text-[11px] text-rose-600">{errors.tradeInOwed}</p>
            )}
          </div>
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Positive equity lowers financed principal; negative equity rolls into the new loan.
        </p>
      </div>

      {/* Sales Tax & Policy */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="auto-loan-tax-rate" className="text-xs font-bold text-accent">
            Sales Tax Rate (%)
          </label>
          <SegmentedToggle
            label="Sales tax inclusion"
            value={draft.salesTaxInclusion}
            options={[
              { value: 'finance', label: 'Finance tax' },
              { value: 'upfront', label: 'Pay upfront' },
            ]}
            onChange={(value) => update('salesTaxInclusion', value)}
          />
        </div>

        <Input
          id="auto-loan-tax-rate"
          type="number"
          inputMode="decimal"
          min="0"
          max="50"
          step="0.01"
          value={draft.salesTaxRate}
          onChange={(e) => update('salesTaxRate', e.target.value)}
          aria-invalid={Boolean(errors.salesTaxRate)}
          className={`h-9 text-xs ${errors.salesTaxRate ? 'border-rose-500' : ''}`}
        />
        {errors.salesTaxRate && (
          <p className="text-[11px] text-rose-600">{errors.salesTaxRate}</p>
        )}

        <div>
          <label htmlFor="auto-loan-tax-policy" className="block text-xs font-semibold text-accent">
            Sales Tax Basis
          </label>
          <Select
            id="auto-loan-tax-policy"
            value={draft.taxPolicy}
            onChange={(e) => update('taxPolicy', e.target.value as TaxPolicy)}
            className="mt-1 h-9 text-xs"
          >
            <option value="after-trade-in">Price minus trade-in value (trade-in credit)</option>
            <option value="full-price">Full vehicle price (no trade-in credit)</option>
          </Select>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Tax rules vary by jurisdiction; confirm whether your area taxes net price or full price.
          </p>
        </div>
      </div>

      {/* Additional Fees */}
      <div className="space-y-2 rounded-xl border border-border bg-white p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="auto-loan-fees" className="text-xs font-bold text-accent">
            Additional Fees ({draft.currency})
          </label>
          <SegmentedToggle
            label="Additional fees inclusion"
            value={draft.feesInclusion}
            options={[
              { value: 'finance', label: 'Finance fees' },
              { value: 'upfront', label: 'Pay upfront' },
            ]}
            onChange={(value) => update('feesInclusion', value)}
          />
        </div>
        <Input
          id="auto-loan-fees"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={draft.additionalFees}
          onChange={(e) => update('additionalFees', e.target.value)}
          aria-invalid={Boolean(errors.additionalFees)}
          className={`h-9 text-xs ${errors.additionalFees ? 'border-rose-500' : ''}`}
        />
        {errors.additionalFees ? (
          <p className="text-[11px] text-rose-600">{errors.additionalFees}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            Title, registration, documentation, and dealer charges.
          </p>
        )}
      </div>

      {/* Loan Start Date */}
      <div>
        <label htmlFor="auto-loan-start-date" className="block text-xs font-bold text-accent">
          Loan Start Date
        </label>
        <Input
          id="auto-loan-start-date"
          type="date"
          value={draft.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          aria-invalid={Boolean(errors.startDate)}
          className={`mt-1.5 ${errors.startDate ? 'border-rose-500' : ''}`}
        />
        {errors.startDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Used to project monthly payment dates and estimated payoff date.
          </p>
        )}
      </div>

      {errors.form && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800"
        >
          {errors.form}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          type="submit"
          className="flex-1 bg-primary text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculate
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}

