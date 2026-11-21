'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertMoneyPeriodDisplay } from './calculation';
import type {
  DownPaymentMode,
  DurationUnit,
  MoneyPeriod,
  RentalPropertyFieldErrors,
  RentalPropertyInput,
  RentalPropertyResult,
  SellingPriceMode,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-xs font-medium text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
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
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function PeriodSelect({
  id,
  value,
  onChange,
  ariaLabel,
}: {
  id: string;
  value: MoneyPeriod;
  onChange: (next: MoneyPeriod) => void;
  ariaLabel: string;
}) {
  return (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as MoneyPeriod)}
    >
      <option value="monthly">Monthly</option>
      <option value="annually">Annually</option>
    </select>
  );
}

function DurationSelect({
  id,
  value,
  onChange,
  ariaLabel,
}: {
  id: string;
  value: DurationUnit;
  onChange: (next: DurationUnit) => void;
  ariaLabel: string;
}) {
  return (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as DurationUnit)}
    >
      <option value="years">Years</option>
      <option value="months">Months</option>
    </select>
  );
}

interface RentalPropertyFormProps {
  input: RentalPropertyInput;
  errors: RentalPropertyFieldErrors;
  result: RentalPropertyResult | null;
  onChange: (input: RentalPropertyInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RentalPropertyForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: RentalPropertyFormProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(true);
  const [incomeOpen, setIncomeOpen] = useState(true);
  const [expensesOpen, setExpensesOpen] = useState(true);
  const [sellingOpen, setSellingOpen] = useState(true);
  const [returnsOpen, setReturnsOpen] = useState(true);
  const [extraCostsOpen, setExtraCostsOpen] = useState(false);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<RentalPropertyInput>) => {
    onChange({ ...input, ...patch });
  };

  const switchPeriod = (
    field: keyof RentalPropertyInput,
    periodField: keyof RentalPropertyInput,
    next: MoneyPeriod
  ) => {
    const currentPeriod = input[periodField] as MoneyPeriod;
    if (currentPeriod === next) return;
    const raw = String(input[field] ?? '').trim();
    if (!raw) {
      set({ [periodField]: next } as Partial<RentalPropertyInput>);
      return;
    }
    const num = Number(raw.replace(/,/g, ''));
    if (!Number.isFinite(num)) {
      set({ [periodField]: next } as Partial<RentalPropertyInput>);
      return;
    }
    const converted = convertMoneyPeriodDisplay(num, currentPeriod, next);
    set({
      [field]: String(converted),
      [periodField]: next,
    } as Partial<RentalPropertyInput>);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
 changes the symbol only; it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="rental-property-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Purchase"
        open={purchaseOpen}
        onToggle={() => setPurchaseOpen((v) => !v)}
      >
        <div>
          <label htmlFor="rp-purchase-price" className={labelClass}>
            <span>Purchase price</span>
            <InfoTooltip
              label="Purchase price"
              text="Total property purchase price used for financing, cap rate, and appreciation projections."
            />
          </label>
          <FieldShell error={errors.purchasePrice}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rp-purchase-price"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.purchasePrice}
              aria-invalid={errors.purchasePrice ? true : undefined}
              onChange={(e) => set({ purchasePrice: e.target.value })}
            />
          </FieldShell>
          {errors.purchasePrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.purchasePrice}</p>
          ) : null}
        </div>

        <div>
          <span className={labelClass}>
            <span>Down payment</span>
            <InfoTooltip
              label="Down payment"
              text="Cash paid at purchase. Use amount or percent of purchase price (example assumption often 20%). Cannot exceed the purchase price."
            />
          </span>
          <div className="mb-2 flex flex-wrap gap-3">
            {(
              [
                ['percentage', 'Percentage'],
                ['amount', 'Amount'],
              ] as const
            ).map(([mode, label]) => (
              <label
                key={mode}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="rp-dp-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.downPaymentMode === mode}
                  onChange={() =>
                    set({ downPaymentMode: mode as DownPaymentMode })
                  }
                />
                {label}
              </label>
            ))}
          </div>
          {input.downPaymentMode === 'percentage' ? (
            <>
              <FieldShell error={errors.downPaymentPercentage}>
                <input
                  id="rp-dp-pct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.downPaymentPercentage}
                  placeholder="e.g. 20"
                  aria-invalid={errors.downPaymentPercentage ? true : undefined}
                  onChange={(e) =>
                    set({ downPaymentPercentage: e.target.value })
                  }
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.downPaymentPercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.downPaymentPercentage}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <FieldShell error={errors.downPaymentAmount}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="rp-dp-amt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.downPaymentAmount}
                  aria-invalid={errors.downPaymentAmount ? true : undefined}
                  onChange={(e) => set({ downPaymentAmount: e.target.value })}
                />
              </FieldShell>
              {errors.downPaymentAmount ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.downPaymentAmount}
                </p>
              ) : null}
            </>
          )}
        </div>

        <div>
          <label htmlFor="rp-loan-amount" className={labelClass}>
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Purchase price minus down payment. Read-only."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rp-loan-amount"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedLoanAmount ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="rp-interest" className={labelClass}>
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Annual nominal mortgage interest rate. Zero interest uses a straight principal split."
            />
          </label>
          <FieldShell error={errors.interestRate}>
            <input
              id="rp-interest"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.interestRate}
              aria-invalid={errors.interestRate ? true : undefined}
              onChange={(e) => set({ interestRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rp-loan-term" className={labelClass}>
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Mortgage duration in years or months (example: 30 years). Converted to months for amortization."
            />
          </label>
          <FieldShell error={errors.loanTermValue}>
            <input
              id="rp-loan-term"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.loanTermValue}
              placeholder="e.g. 30"
              aria-invalid={errors.loanTermValue ? true : undefined}
              onChange={(e) => set({ loanTermValue: e.target.value })}
            />
            <DurationSelect
              id="rp-loan-term-unit"
              value={input.loanTermUnit}
              ariaLabel="Loan term unit"
              onChange={(loanTermUnit) => set({ loanTermUnit })}
            />
          </FieldShell>
          {errors.loanTermValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rp-total-paid" className={labelClass}>
            <span>Total paid</span>
            <InfoTooltip
              label="Total paid"
              text="Scheduled principal-and-interest over the full loan term (monthly payment × number of payments). Not the initial cash investment; excludes taxes, insurance, and down payment."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rp-total-paid"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedTotalMortgagePayments ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <CollapsibleSection
          title="Additional purchase costs"
          open={extraCostsOpen}
          onToggle={() => setExtraCostsOpen((v) => !v)}
        >
          {(
            [
              ['closingCosts', 'Closing costs', 'closingCosts'],
              ['renovationCosts', 'Initial renovations', 'renovationCosts'],
              ['otherInitialCosts', 'Other initial costs', 'otherInitialCosts'],
            ] as const
          ).map(([key, label, errKey]) => (
            <div key={key}>
              <label htmlFor={`rp-${key}`} className={labelClass}>
                {label}
              </label>
              <FieldShell error={errors[errKey]}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id={`rp-${key}`}
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input[key]}
                  aria-invalid={errors[errKey] ? true : undefined}
                  onChange={(e) => set({ [key]: e.target.value })}
                />
              </FieldShell>
              {errors[errKey] ? (
                <p className="mt-1 text-xs text-rose-600">{errors[errKey]}</p>
              ) : null}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Defaults of zero are explicit zero-cost assumptions. Financed
            purchase price is not counted as cash invested.
          </p>
        </CollapsibleSection>
      </CollapsibleSection>

      <CollapsibleSection
        title="Income"
        open={incomeOpen}
        onToggle={() => setIncomeOpen((v) => !v)}
      >
        <div>
          <label htmlFor="rp-rent" className={labelClass}>
            <span>Rent</span>
            <InfoTooltip
              label="Rent"
              text="Gross potential rental income before vacancy. Switching monthly/annual preserves the same annual rent."
            />
          </label>
          <FieldShell error={errors.rent}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rp-rent"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.rent}
              aria-invalid={errors.rent ? true : undefined}
              onChange={(e) => set({ rent: e.target.value })}
            />
            <PeriodSelect
              id="rp-rent-period"
              value={input.rentPeriod}
              ariaLabel="Rent period"
              onChange={(next) => switchPeriod('rent', 'rentPeriod', next)}
            />
          </FieldShell>
          {errors.rent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rent}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rp-vacancy" className={labelClass}>
            <span>Vacancy rate</span>
            <InfoTooltip
              label="Vacancy rate"
              text="Percent of gross rent lost to vacancy (0–100%). Effective rent = gross − vacancy loss."
            />
          </label>
          <FieldShell error={errors.vacancyRate}>
            <input
              id="rp-vacancy"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.vacancyRate}
              aria-invalid={errors.vacancyRate ? true : undefined}
              onChange={(e) => set({ vacancyRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.vacancyRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.vacancyRate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rp-mgmt" className={labelClass}>
            <span>Management fee</span>
            <InfoTooltip
              label="Management fee"
              text="Percent of effective (post-vacancy) rental income. Included once in operating expenses; do not also list it under Other costs."
            />
          </label>
          <FieldShell error={errors.managementFeeRate}>
            <input
              id="rp-mgmt"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.managementFeeRate}
              aria-invalid={errors.managementFeeRate ? true : undefined}
              onChange={(e) => set({ managementFeeRate: e.target.value })}
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.managementFeeRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.managementFeeRate}
            </p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Recurring expenses"
        open={expensesOpen}
        onToggle={() => setExpensesOpen((v) => !v)}
      >
        {(
          [
            [
              'propertyTax',
              'propertyTaxPeriod',
              'Property tax',
              'Annualized property tax. Switching period preserves the same yearly cost.',
            ],
            [
              'insurance',
              'insurancePeriod',
              'Insurance',
              'Recurring landlord/property insurance, annualized.',
            ],
            [
              'maintenance',
              'maintenancePeriod',
              'Maintenance/repairs',
              'Routine maintenance and ordinary repairs. Major capital improvements belong in initial renovations or a separate model.',
            ],
            [
              'hoaFee',
              'hoaFeePeriod',
              'HOA fee',
              'Homeowners association or similar recurring fees.',
            ],
            [
              'otherCosts',
              'otherCostsPeriod',
              'Other costs',
              'Owner-paid utilities, landscaping, admin, and similar operating charges. Do not include mortgage P&I.',
            ],
          ] as const
        ).map(([field, periodField, label, tip]) => (
          <div key={field}>
            <label htmlFor={`rp-${field}`} className={labelClass}>
              <span>{label}</span>
              <InfoTooltip label={label} text={tip} />
            </label>
            <FieldShell error={errors[field]}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id={`rp-${field}`}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input[field]}
                aria-invalid={errors[field] ? true : undefined}
                onChange={(e) => set({ [field]: e.target.value })}
              />
              <PeriodSelect
                id={`rp-${field}-period`}
                value={input[periodField]}
                ariaLabel={`${label} period`}
                onChange={(next) => switchPeriod(field, periodField, next)}
              />
            </FieldShell>
            {errors[field] ? (
              <p className="mt-1 text-xs text-rose-600">{errors[field]}</p>
            ) : null}
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection
        title="Selling the property"
        open={sellingOpen}
        onToggle={() => setSellingOpen((v) => !v)}
      >
        <div>
          <span className={labelClass}>Selling price</span>
          <div className="mb-2 flex flex-wrap gap-3">
            {(
              [
                ['appreciation', 'Estimate from appreciation'],
                ['manual', 'Enter expected selling price'],
              ] as const
            ).map(([mode, label]) => (
              <label
                key={mode}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="rp-sell-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.sellingPriceMode === mode}
                  onChange={() =>
                    set({ sellingPriceMode: mode as SellingPriceMode })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {input.sellingPriceMode === 'appreciation' ? (
          <div>
            <label htmlFor="rp-apprec" className={labelClass}>
              <span>Value appreciation</span>
              <InfoTooltip
                label="Value appreciation"
                text="Constant annual geometric appreciation assumption (% per year). Projection only; not a guaranteed sale price. Must be greater than −100%."
              />
            </label>
            <FieldShell error={errors.appreciationRate}>
              <input
                id="rp-apprec"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.appreciationRate}
                aria-invalid={errors.appreciationRate ? true : undefined}
                onChange={(e) => set({ appreciationRate: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%/year</span>
            </FieldShell>
            {errors.appreciationRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.appreciationRate}
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <label htmlFor="rp-manual-sell" className={labelClass}>
              Expected selling price
            </label>
            <FieldShell error={errors.manualSellingPrice}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="rp-manual-sell"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualSellingPrice}
                aria-invalid={errors.manualSellingPrice ? true : undefined}
                onChange={(e) => set({ manualSellingPrice: e.target.value })}
              />
            </FieldShell>
            {errors.manualSellingPrice ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.manualSellingPrice}
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label htmlFor="rp-hold" className={labelClass}>
            <span>Holding period</span>
            <InfoTooltip
              label="Holding period"
              text="How long you plan to hold before sale. Used for appreciation, loan balance at sale, cumulative cash flow, and total ROI."
            />
          </label>
          <FieldShell error={errors.holdingPeriodValue}>
            <input
              id="rp-hold"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.holdingPeriodValue}
              aria-invalid={errors.holdingPeriodValue ? true : undefined}
              onChange={(e) => set({ holdingPeriodValue: e.target.value })}
            />
            <DurationSelect
              id="rp-hold-unit"
              value={input.holdingPeriodUnit}
              ariaLabel="Holding period unit"
              onChange={(holdingPeriodUnit) => set({ holdingPeriodUnit })}
            />
          </FieldShell>
          {errors.holdingPeriodValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.holdingPeriodValue}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rp-sell-price-out" className={labelClass}>
            Selling price (projected)
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rp-sell-price-out"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result && result.holdingPeriodMonths > 0
                  ? result.formattedSellingPrice
                  : ''
              }
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="rp-sell-pct" className={labelClass}>
              <span>Selling costs %</span>
              <InfoTooltip
                label="Selling costs percent"
                text="Percent of selling price (e.g. agent commissions). Zero means an explicit zero-cost assumption."
              />
            </label>
            <FieldShell error={errors.sellingCostPercent}>
              <input
                id="rp-sell-pct"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.sellingCostPercent}
                aria-invalid={errors.sellingCostPercent ? true : undefined}
                onChange={(e) => set({ sellingCostPercent: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
          </div>
          <div>
            <label htmlFor="rp-sell-fixed" className={labelClass}>
              Fixed selling costs
            </label>
            <FieldShell error={errors.sellingCostFixed}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="rp-sell-fixed"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.sellingCostFixed}
                aria-invalid={errors.sellingCostFixed ? true : undefined}
                onChange={(e) => set({ sellingCostFixed: e.target.value })}
              />
            </FieldShell>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Cash flow and return on investment"
        open={returnsOpen}
        onToggle={() => setReturnsOpen((v) => !v)}
      >
        {(
          [
            [
              'Loan payment',
              result?.formattedMonthlyMortgagePayment,
              'Monthly mortgage principal and interest.',
            ],
            [
              'Other costs (annual OpEx)',
              result?.formattedAnnualOperatingExpenses,
              'Annualized operating expenses including management fee, excluding mortgage debt service.',
            ],
            [
              'Gross income (annual)',
              result?.formattedAnnualGrossRent,
              'Gross potential rent before vacancy.',
            ],
            [
              'Cash flow (annual)',
              result?.formattedAnnualCashFlow,
              'NOI minus annual debt service. Negative values are preserved.',
            ],
            [
              'ROI (holding period)',
              result?.formattedTotalRoi !== null && result?.formattedTotalRoi
                ? `${result.formattedTotalRoi}%`
                : result && result.holdingPeriodMonths > 0
                  ? 'Unavailable'
                  : '',
              'Total investment profit ÷ initial cash invested over the holding period (needs holding period).',
            ],
            [
              'Cash-on-cash return',
              result?.formattedCashOnCashReturn !== null &&
              result?.formattedCashOnCashReturn
                ? `${result.formattedCashOnCashReturn}%`
                : result
                  ? 'Unavailable'
                  : '',
              'First-year annual cash flow ÷ initial cash invested.',
            ],
            [
              'Cap rate',
              result?.formattedCapRate !== null && result?.formattedCapRate
                ? `${result.formattedCapRate}%`
                : result
                  ? 'Unavailable'
                  : '',
              'NOI ÷ purchase price. Debt service is excluded from NOI.',
            ],
          ] as const
        ).map(([label, value, tip]) => (
          <div key={label}>
            <label className={labelClass}>
              <span>{label}</span>
              <InfoTooltip label={label} text={tip} />
            </label>
            <FieldShell muted>
              {label.startsWith('Loan') ||
              label.startsWith('Other') ||
              label.startsWith('Gross') ||
              label.startsWith('Cash flow') ? (
                <span
                  className="pl-3 text-sm text-muted-foreground"
                  aria-hidden
                >
                  {symbol}
                </span>
              ) : null}
              <input
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default text-muted-foreground`}
                value={value ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        ))}

        {result && result.holdingPeriodMonths > 0 ? (
          <div className="rounded-lg border border-border bg-white/70 p-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              Net sale proceeds: {symbol}
              {result.formattedNetSaleProceeds} (sale − costs − loan balance{' '}
              {symbol}
              {result.formattedOutstandingLoanBalance})
            </p>
            <p className="mt-1">
              Cumulative operating cash flow:{' '}
              {symbol}
              {result.formattedCumulativeOperatingCashFlow} · Total profit:{' '}
              {symbol}
              {result.formattedTotalInvestmentProfit}
            </p>
            <p className="mt-1">
              This is a simplified pre-tax model. Location, condition, taxes, and
 market risk still matter; unit yield alone does not define a good
              investment.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter a holding period to project sale proceeds, loan payoff, and
            total investment ROI. Cap rate and cash-on-cash use first-year
            operating results.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
