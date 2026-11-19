'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CarLeaseResults } from './CarLeaseResults';
import type { CarLeaseFieldErrors, CarLeaseInput, CarLeaseResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

function SectionHeader({
  id,
  title,
  open,
  onToggle,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      id={id}
      className="flex w-full items-center justify-between gap-2 text-left"
      aria-expanded={open}
      onClick={onToggle}
    >
      <h3 className="text-[15px] font-semibold text-accent">{title}</h3>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
          open ? 'rotate-180' : ''
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

interface MoneyFieldProps {
  id: string;
  label: string;
  tooltip?: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  currencyLabel: string;
}

function MoneyField({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  onValueChange,
  onCurrencyChange,
  currencyLabel,
}: MoneyFieldProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyLabel}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface CarLeaseFormProps {
  input: CarLeaseInput;
  errors: CarLeaseFieldErrors;
  result: CarLeaseResult | null;
  onChange: (input: CarLeaseInput) => void;
  onMoneyCurrencyChange: (
    field:
      | 'msrpCurrency'
      | 'negotiatedPriceCurrency'
      | 'dealerFeeCurrency'
      | 'registrationFeeCurrency'
      | 'downPaymentCurrency'
      | 'tradeInValueCurrency'
      | 'otherReductionsCurrency',
    next: SupportedCurrency
  ) => void;
  onResultCurrencyChange: (
    field:
      | 'netCapCostCurrency'
      | 'residualValueCurrency'
      | 'monthlyDepreciationCurrency'
      | 'monthlyLeaseFeeCurrency'
      | 'monthlyBasePaymentCurrency'
      | 'monthlySalesTaxCurrency'
      | 'monthlyLeasePaymentCurrency',
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function CarLeaseForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  onResultCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: CarLeaseFormProps) {
  const set = (patch: Partial<CarLeaseInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <SectionHeader
          id="car-lease-basic-toggle"
          title="Basic Information"
          open={input.basicOpen}
          onToggle={() => set({ basicOpen: !input.basicOpen })}
        />
        {input.basicOpen ? (
          <div className="space-y-3.5 pt-1">
            <MoneyField
              id="car-lease-msrp"
              label="MSRP"
              tooltip="Manufacturer’s suggested retail price. Residual value is based on this amount."
              value={input.msrp}
              currency={input.msrpCurrency}
              error={errors.msrp}
              onValueChange={(msrp) => set({ msrp })}
              onCurrencyChange={(next) => onMoneyCurrencyChange('msrpCurrency', next)}
              currencyLabel="MSRP currency"
            />
            <MoneyField
              id="car-lease-negotiated"
              label="Negotiated selling price"
              tooltip="Agreed vehicle price before fees and reductions. Lease math runs in this currency."
              value={input.negotiatedPrice}
              currency={input.negotiatedPriceCurrency}
              error={errors.negotiatedPrice}
              onValueChange={(negotiatedPrice) => set({ negotiatedPrice })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('negotiatedPriceCurrency', next)
              }
              currencyLabel="Negotiated selling price currency"
            />
            <div>
              <label className={labelClass} htmlFor="car-lease-term">
                <span>Lease term</span>
              </label>
              <FieldShell error={errors.leaseTermMonths}>
                <input
                  id="car-lease-term"
                  className={`${inputClass} pr-12`}
                  inputMode="numeric"
                  value={input.leaseTermMonths}
                  aria-invalid={Boolean(errors.leaseTermMonths)}
                  onChange={(e) => set({ leaseTermMonths: e.target.value })}
                />
                <span
                  className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  mos
                </span>
              </FieldShell>
              {errors.leaseTermMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.leaseTermMonths}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="car-lease-tax">
                <span>Sales tax</span>
              </label>
              <FieldShell error={errors.salesTaxPercent}>
                <input
                  id="car-lease-tax"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.salesTaxPercent}
                  aria-invalid={Boolean(errors.salesTaxPercent)}
                  onChange={(e) => set({ salesTaxPercent: e.target.value })}
                />
                <span
                  className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  %
                </span>
              </FieldShell>
              {errors.salesTaxPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salesTaxPercent}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="car-lease-residual-factor">
                <span>Residual factor</span>
                <InfoTooltip
                  label="Residual factor"
                  text="Expected residual value as a percent of MSRP at lease end."
                />
              </label>
              <FieldShell error={errors.residualFactorPercent}>
                <input
                  id="car-lease-residual-factor"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.residualFactorPercent}
                  aria-invalid={Boolean(errors.residualFactorPercent)}
                  onChange={(e) => set({ residualFactorPercent: e.target.value })}
                />
                <span
                  className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  %
                </span>
              </FieldShell>
              {errors.residualFactorPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.residualFactorPercent}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="car-lease-money-factor">
                <span>Money factor</span>
                <InfoTooltip
                  label="Money factor"
                  text="Lease finance rate expressed as a money factor (not an APR %). Approximate APR ≈ money factor × 2400."
                />
              </label>
              <FieldShell error={errors.moneyFactor}>
                <input
                  id="car-lease-money-factor"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.moneyFactor}
                  aria-invalid={Boolean(errors.moneyFactor)}
                  onChange={(e) => set({ moneyFactor: e.target.value })}
                />
              </FieldShell>
              {errors.moneyFactor ? (
                <p className="mt-1 text-xs text-rose-600">{errors.moneyFactor}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <SectionHeader
          id="car-lease-additional-toggle"
          title="Additional Information"
          open={input.additionalOpen}
          onToggle={() => set({ additionalOpen: !input.additionalOpen })}
        />
        {input.additionalOpen ? (
          <div className="space-y-3.5 pt-1">
            <MoneyField
              id="car-lease-dealer-fee"
              label="Dealer fee"
              value={input.dealerFee}
              currency={input.dealerFeeCurrency}
              error={errors.dealerFee}
              onValueChange={(dealerFee) => set({ dealerFee })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('dealerFeeCurrency', next)
              }
              currencyLabel="Dealer fee currency"
            />
            <MoneyField
              id="car-lease-registration-fee"
              label="Registration fee"
              value={input.registrationFee}
              currency={input.registrationFeeCurrency}
              error={errors.registrationFee}
              onValueChange={(registrationFee) => set({ registrationFee })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('registrationFeeCurrency', next)
              }
              currencyLabel="Registration fee currency"
            />
            <MoneyField
              id="car-lease-down"
              label="Down payment"
              value={input.downPayment}
              currency={input.downPaymentCurrency}
              error={errors.downPayment}
              onValueChange={(downPayment) => set({ downPayment })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('downPaymentCurrency', next)
              }
              currencyLabel="Down payment currency"
            />
            <MoneyField
              id="car-lease-trade-in"
              label="Trade-in value"
              value={input.tradeInValue}
              currency={input.tradeInValueCurrency}
              error={errors.tradeInValue}
              onValueChange={(tradeInValue) => set({ tradeInValue })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('tradeInValueCurrency', next)
              }
              currencyLabel="Trade-in value currency"
            />
            <MoneyField
              id="car-lease-other"
              label="Other reductions"
              value={input.otherReductions}
              currency={input.otherReductionsCurrency}
              error={errors.otherReductions}
              onValueChange={(otherReductions) => set({ otherReductions })}
              onCurrencyChange={(next) =>
                onMoneyCurrencyChange('otherReductionsCurrency', next)
              }
              currencyLabel="Other reductions currency"
            />
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <SectionHeader
          id="car-lease-results-toggle"
          title="Results"
          open={input.resultsOpen}
          onToggle={() => set({ resultsOpen: !input.resultsOpen })}
        />
        {input.resultsOpen ? (
          <div className="pt-1">
            <CarLeaseResults
              input={input}
              result={result}
              errors={errors}
              onCurrencyChange={onResultCurrencyChange}
            />
          </div>
        ) : null}
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
    </form>
  );
}
