'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calculator, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { formatCurrencyValue } from './calculation';
import { InfoTooltip } from './InfoTooltip';
import type {
  AutoLoanFieldErrors,
  AutoLoanInput,
  CostInclusion,
  DownPaymentMode,
  SupportedCurrency,
  TaxPolicy,
  TermUnit,
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

const CURRENCY_UNITS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
  PKR: 'Rs',
  AED: 'AED',
};

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
      className="inline-flex h-7 shrink-0 items-center rounded-lg border border-border bg-background p-0.5"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-full rounded-md px-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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

interface UnitNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixUnit?: string;
  suffixUnit?: string;
  hasError?: boolean;
}

function UnitNumberInput({
  prefixUnit,
  suffixUnit,
  hasError = false,
  className = '',
  ...props
}: UnitNumberInputProps) {
  return (
    <div
      className={`flex h-11 w-full items-center overflow-hidden rounded-lg border bg-white text-sm transition-colors focus-within:ring-2 focus-within:ring-offset-1 ${
        hasError
          ? 'border-rose-500 focus-within:ring-rose-500'
          : 'border-border focus-within:ring-ring'
      } ${className}`}
    >
      {prefixUnit && (
        <span
          aria-hidden="true"
          className="flex h-full min-w-[40px] shrink-0 items-center justify-center border-r border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground sm:text-[13px]"
        >
          {prefixUnit}
        </span>
      )}
      <input
        {...props}
        type="number"
        inputMode="decimal"
        autoComplete="off"
        className="h-full w-full min-w-0 bg-transparent px-3 text-sm font-normal text-foreground tabular-nums placeholder:text-muted-foreground focus:outline-none"
      />
      {suffixUnit && (
        <span
          aria-hidden="true"
          className="flex h-full min-w-[40px] shrink-0 items-center justify-center border-l border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground sm:text-[13px]"
        >
          {suffixUnit}
        </span>
      )}
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
  const [showTaxAndFees, setShowTaxAndFees] = React.useState(false);
  const unitSymbol = CURRENCY_UNITS[draft.currency];
  const hasTaxOrFeesError = Boolean(errors.salesTaxRate || errors.additionalFees || errors.startDate);

  React.useEffect(() => {
    if (hasTaxOrFeesError) {
      setShowTaxAndFees(true);
    }
  }, [hasTaxOrFeesError]);

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
        ? `Down payment: ${formatCurrencyValue((parsedPrice * parsedDown) / 100, draft.currency)} upfront`
        : `Down payment: ${((parsedDown / parsedPrice) * 100).toFixed(1)}% of price`
      : 'Cash paid at signing toward vehicle price.';

  const parsedTradeIn = parseDraftNumber(draft.tradeInValue);
  const parsedTradeOwed = parseDraftNumber(draft.tradeInOwed);
  const tradeEquity =
    Number.isFinite(parsedTradeIn) && Number.isFinite(parsedTradeOwed)
      ? parsedTradeIn - parsedTradeOwed
      : null;

  const parsedTax = parseDraftNumber(draft.salesTaxRate);
  const parsedFees = parseDraftNumber(draft.additionalFees);
  const taxFeeSummary = `${Number.isFinite(parsedTax) ? parsedTax : 0}% tax · ${
    Number.isFinite(parsedFees) ? formatCurrencyValue(parsedFees, draft.currency) : unitSymbol + '0'
  } fees`;

  return (
    <form onSubmit={onSubmit} noValidate autoComplete="off" className="space-y-3.5">
      {/* Row 1: Auto Price & Down Payment */}
      <div>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div>
            <div className="mb-1.5 flex min-h-7 items-center gap-1.5">
              <label htmlFor="auto-loan-price" className="text-[13px] font-medium text-accent">
                Auto Price
              </label>
              <InfoTooltip
                label="Auto Price"
                text="Agreed purchase price of the vehicle before taxes, fees, down payment, and trade-in adjustments."
              />
            </div>
            <UnitNumberInput
              id="auto-loan-price"
              prefixUnit={unitSymbol}
              min="1"
              step="any"
              value={draft.autoPrice}
              onChange={(e) => update('autoPrice', e.target.value)}
              hasError={Boolean(errors.autoPrice)}
              aria-invalid={Boolean(errors.autoPrice)}
              aria-describedby={errors.autoPrice ? 'auto-loan-price-error' : undefined}
            />
            {errors.autoPrice && (
              <p id="auto-loan-price-error" className="mt-1 text-xs font-normal text-rose-600">
                {errors.autoPrice}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex min-h-7 items-center justify-between gap-1.5">
              <div className="flex items-center gap-1">
                <label
                  htmlFor="auto-loan-down-payment"
                  className="text-[13px] font-medium text-accent"
                >
                  Down Payment
                </label>
                <InfoTooltip
                  label="Down Payment"
                  text="Cash paid upfront toward the vehicle price. Higher down payments lower your financed principal and monthly interest."
                  align="right"
                />
              </div>
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
            <UnitNumberInput
              id="auto-loan-down-payment"
              prefixUnit={draft.downPaymentMode === 'amount' ? unitSymbol : undefined}
              suffixUnit={draft.downPaymentMode === 'percent' ? '%' : undefined}
              min="0"
              step="any"
              value={draft.downPaymentValue}
              onChange={(e) => update('downPaymentValue', e.target.value)}
              hasError={Boolean(errors.downPaymentValue)}
              aria-invalid={Boolean(errors.downPaymentValue)}
              aria-describedby={
                errors.downPaymentValue ? 'auto-loan-down-error' : 'auto-loan-down-hint'
              }
            />
            {errors.downPaymentValue && (
              <p id="auto-loan-down-error" className="mt-1 text-xs font-normal text-rose-600">
                {errors.downPaymentValue}
              </p>
            )}
          </div>
        </div>
        {!errors.downPaymentValue && (
          <p id="auto-loan-down-hint" className="mt-1.5 text-xs font-normal text-muted-foreground">
            {downHint}
          </p>
        )}
      </div>

      {/* Row 2: Loan Term & Interest Rate */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div>
          <div className="mb-1.5 flex min-h-7 items-center justify-between gap-1.5">
            <label htmlFor="auto-loan-term" className="text-[13px] font-medium text-accent">
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
          <UnitNumberInput
            id="auto-loan-term"
            suffixUnit={draft.loanTermUnit === 'months' ? 'mo' : 'yr'}
            min="1"
            step={draft.loanTermUnit === 'months' ? '1' : 'any'}
            value={draft.loanTermValue}
            onChange={(e) => update('loanTermValue', e.target.value)}
            hasError={Boolean(errors.loanTermValue)}
            aria-invalid={Boolean(errors.loanTermValue)}
            aria-describedby={errors.loanTermValue ? 'auto-loan-term-error' : undefined}
          />
          {errors.loanTermValue && (
            <p id="auto-loan-term-error" className="mt-1 text-xs font-normal text-rose-600">
              {errors.loanTermValue}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex min-h-7 items-center gap-1.5">
            <label htmlFor="auto-loan-apr" className="text-[13px] font-medium text-accent">
              Interest Rate (APR)
            </label>
            <InfoTooltip
              label="Annual Percentage Rate"
              text="Annual borrowing rate used to compute monthly compounding interest. Supports 0% promotional APR financing."
              align="right"
            />
          </div>
          <UnitNumberInput
            id="auto-loan-apr"
            suffixUnit="%"
            min="0"
            max="100"
            step="0.01"
            value={draft.annualInterestRate}
            onChange={(e) => update('annualInterestRate', e.target.value)}
            hasError={Boolean(errors.annualInterestRate)}
            aria-invalid={Boolean(errors.annualInterestRate)}
            aria-describedby={errors.annualInterestRate ? 'auto-loan-apr-error' : undefined}
          />
          {errors.annualInterestRate && (
            <p id="auto-loan-apr-error" className="mt-1 text-xs font-normal text-rose-600">
              {errors.annualInterestRate}
            </p>
          )}
        </div>
      </div>

      {/* Trade-In Section (Subtle Mint Surface) */}
      <div className="space-y-2.5 rounded-xl border border-border bg-brand-softTeal/50 p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-accent">Trade-In</span>
            <InfoTooltip
              label="Trade-in equity"
              text="Net trade-in equity equals trade-in value minus amount owed. Positive equity lowers your loan; negative equity adds to principal."
              align="left"
            />
          </div>
          {tradeEquity !== null && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums ${
                tradeEquity > 0
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : tradeEquity < 0
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : 'border-border bg-white text-muted-foreground'
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

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div>
            <div className="mb-1 flex min-h-6 items-center">
              <label
                htmlFor="auto-loan-trade-value"
                className="text-[13px] font-medium text-accent"
              >
                Trade-in Value
              </label>
            </div>
            <UnitNumberInput
              id="auto-loan-trade-value"
              prefixUnit={unitSymbol}
              min="0"
              step="any"
              value={draft.tradeInValue}
              onChange={(e) => update('tradeInValue', e.target.value)}
              hasError={Boolean(errors.tradeInValue)}
              aria-invalid={Boolean(errors.tradeInValue)}
            />
            {errors.tradeInValue && (
              <p className="mt-1 text-xs font-normal text-rose-600">{errors.tradeInValue}</p>
            )}
          </div>

          <div>
            <div className="mb-1 flex min-h-6 items-center">
              <label
                htmlFor="auto-loan-trade-owed"
                className="text-[13px] font-medium text-accent"
              >
                Amount Owed
              </label>
            </div>
            <UnitNumberInput
              id="auto-loan-trade-owed"
              prefixUnit={unitSymbol}
              min="0"
              step="any"
              value={draft.tradeInOwed}
              onChange={(e) => update('tradeInOwed', e.target.value)}
              hasError={Boolean(errors.tradeInOwed)}
              aria-invalid={Boolean(errors.tradeInOwed)}
            />
            {errors.tradeInOwed && (
              <p className="mt-1 text-xs font-normal text-rose-600">{errors.tradeInOwed}</p>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Sales Tax, Fees & Start Date */}
      <div className="rounded-xl border border-border bg-background/40">
        <button
          type="button"
          aria-expanded={showTaxAndFees}
          onClick={() => setShowTaxAndFees((prev) => !prev)}
          className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="min-w-0">
            <span className="block text-[13px] font-medium text-accent">
              Sales Tax, Fees &amp; Start Date
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground tabular-nums">
              {taxFeeSummary} • {draft.salesTaxInclusion === 'finance' ? 'Tax financed' : 'Tax upfront'}
            </span>
          </div>
          {showTaxAndFees ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {showTaxAndFees && (
          <div className="space-y-3.5 border-t border-border bg-white p-3.5">
            <div>
              <div className="mb-1.5 flex min-h-7 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="auto-loan-tax-rate"
                    className="text-[13px] font-medium text-accent"
                  >
                    Sales Tax
                  </label>
                  <InfoTooltip
                    label="Sales tax options"
                    text="Choose whether local sales tax is financed into your loan or paid upfront, and whether trade-in allowance reduces taxable vehicle price."
                    align="left"
                  />
                </div>
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

              <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-[124px_minmax(0,1fr)]">
                <div>
                  <UnitNumberInput
                    id="auto-loan-tax-rate"
                    suffixUnit="%"
                    min="0"
                    max="50"
                    step="0.01"
                    value={draft.salesTaxRate}
                    onChange={(e) => update('salesTaxRate', e.target.value)}
                    hasError={Boolean(errors.salesTaxRate)}
                    aria-invalid={Boolean(errors.salesTaxRate)}
                    aria-label="Sales tax rate percentage"
                  />
                  {errors.salesTaxRate && (
                    <p className="mt-1 text-xs font-normal text-rose-600">{errors.salesTaxRate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="auto-loan-tax-policy" className="sr-only">
                    Sales Tax Basis
                  </label>
                  <Select
                    id="auto-loan-tax-policy"
                    value={draft.taxPolicy}
                    onChange={(e) => update('taxPolicy', e.target.value as TaxPolicy)}
                    className="h-11 text-sm"
                  >
                    <option value="after-trade-in">Tax after trade-in</option>
                    <option value="full-price">Tax full price</option>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex min-h-7 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="auto-loan-fees" className="text-[13px] font-medium text-accent">
                    Additional Fees
                  </label>
                  <InfoTooltip
                    label="Additional fees"
                    text="Title, registration, documentation, and dealer charges. Roll into loan or pay upfront at signing."
                    align="left"
                  />
                </div>
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
              <UnitNumberInput
                id="auto-loan-fees"
                prefixUnit={unitSymbol}
                min="0"
                step="any"
                value={draft.additionalFees}
                onChange={(e) => update('additionalFees', e.target.value)}
                hasError={Boolean(errors.additionalFees)}
                aria-invalid={Boolean(errors.additionalFees)}
              />
              {errors.additionalFees && (
                <p className="mt-1 text-xs font-normal text-rose-600">{errors.additionalFees}</p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex min-h-7 items-center">
                <label
                  htmlFor="auto-loan-start-date"
                  className="text-[13px] font-medium text-accent"
                >
                  Loan Start Date
                </label>
              </div>
              <Input
                id="auto-loan-start-date"
                type="date"
                autoComplete="off"
                value={draft.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                aria-invalid={Boolean(errors.startDate)}
                className={`h-11 text-sm ${errors.startDate ? 'border-rose-500' : ''}`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs font-normal text-rose-600">{errors.startDate}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {errors.form && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-normal leading-relaxed text-rose-800"
        >
          {errors.form}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          <Calculator className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Calculate
        </Button>
        <Button type="button" variant="outline" onClick={onReset} className="h-11 font-medium">
          <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
      </div>
    </form>
  );
}
