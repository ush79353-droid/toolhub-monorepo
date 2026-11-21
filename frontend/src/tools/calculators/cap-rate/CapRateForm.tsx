'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertIncomePeriodDisplay } from './calculation';
import type {
  CapRateFieldErrors,
  CapRateInput,
  CapRateResult,
  IncomePeriod,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function formatIncomeDisplay(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e8) / 1e8;
  return String(rounded);
}

interface CapRateFormProps {
  input: CapRateInput;
  errors: CapRateFieldErrors;
  result: CapRateResult | null;
  onChange: (input: CapRateInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CapRateForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: CapRateFormProps) {
  const [propertyOpen, setPropertyOpen] = useState(true);
  const [valueOpen, setValueOpen] = useState(false);
  const [requiredOpen, setRequiredOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<CapRateInput>) => {
    onChange({ ...input, ...patch });
  };

  const setIncomePeriod = (next: IncomePeriod) => {
    if (next === input.incomePeriod) return;
    const grossRaw = input.grossRentalIncome.trim().replace(/,/g, '');
    const otherRaw = input.otherIncome.trim().replace(/,/g, '');
    const grossNum = grossRaw === '' ? Number.NaN : Number(grossRaw);
    const otherNum = otherRaw === '' ? Number.NaN : Number(otherRaw);
    set({
      incomePeriod: next,
      grossRentalIncome: Number.isFinite(grossNum)
        ? formatIncomeDisplay(
            convertIncomePeriodDisplay(grossNum, input.incomePeriod, next)
          )
        : input.grossRentalIncome,
      otherIncome: Number.isFinite(otherNum)
        ? formatIncomeDisplay(
            convertIncomePeriodDisplay(otherNum, input.incomePeriod, next)
          )
        : input.otherIncome,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="cap-rate-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <CollapsibleSection
        title="Property information"
        open={propertyOpen}
        onToggle={() => setPropertyOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="cap-property-value">
            <span>Property value</span>
            <InfoTooltip
              label="Property value"
              text="Market value or acquisition price used for the capitalization rate. Must be greater than zero."
            />
          </label>
          <FieldShell error={errors.propertyValue}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-property-value"
              className={inputClass}
              inputMode="decimal"
              value={input.propertyValue}
              aria-invalid={Boolean(errors.propertyValue)}
              onChange={(e) => set({ propertyValue: e.target.value })}
            />
          </FieldShell>
          {errors.propertyValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.propertyValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-gross-rental">
            <span>Gross rental income</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.grossRentalIncome}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {symbol}
              </span>
              <input
                id="cap-gross-rental"
                className={inputClass}
                inputMode="decimal"
                value={input.grossRentalIncome}
                aria-invalid={Boolean(errors.grossRentalIncome)}
                onChange={(e) => set({ grossRentalIncome: e.target.value })}
              />
            </FieldShell>
            <select
              id="cap-income-period"
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent"
              value={input.incomePeriod}
              aria-label="Rental income period"
              onChange={(e) =>
                setIncomePeriod(e.target.value as IncomePeriod)
              }
            >
              <option value="annually">Annually</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          {errors.grossRentalIncome ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.grossRentalIncome}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-other-income">
            <span>Other property income</span>
            <InfoTooltip
              label="Other income"
              text="Optional parking, laundry, storage, or other recurring property income. Blank counts as zero when other income fields are complete."
            />
          </label>
          <FieldShell error={errors.otherIncome}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-other-income"
              className={inputClass}
              inputMode="decimal"
              value={input.otherIncome}
              aria-invalid={Boolean(errors.otherIncome)}
              onChange={(e) => set({ otherIncome: e.target.value })}
            />
          </FieldShell>
          {errors.otherIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.otherIncome}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-vacancy">
            <span>Vacancy and collection loss</span>
            <InfoTooltip
              label="Vacancy"
              text="Share of potential gross income not collected because of vacancy or unpaid rent."
            />
          </label>
          <FieldShell error={errors.vacancyRate}>
            <input
              id="cap-vacancy"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.vacancyRate}
              aria-invalid={Boolean(errors.vacancyRate)}
              onChange={(e) => set({ vacancyRate: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.vacancyRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.vacancyRate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-opex">
            <span>Annual operating expenses</span>
            <InfoTooltip
              label="Operating expenses"
              text="Management, repairs, insurance, taxes, owner-paid utilities, and similar operating costs. Do not include mortgage payments, interest, or depreciation."
            />
          </label>
          <FieldShell error={errors.operatingExpenses}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-opex"
              className={inputClass}
              inputMode="decimal"
              value={input.operatingExpenses}
              aria-invalid={Boolean(errors.operatingExpenses)}
              onChange={(e) => set({ operatingExpenses: e.target.value })}
            />
          </FieldShell>
          {errors.operatingExpenses ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.operatingExpenses}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-noi">
            <span>Net operating income (NOI)</span>
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-noi"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedNoi ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="cap-rate-out">
            <span>Capitalization rate</span>
          </label>
          <FieldShell muted>
            <input
              id="cap-rate-out"
              className={`${inputClass} pr-8 text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedCapRate ?? ''}
              aria-live="polite"
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {result?.formattedNoi && result.formattedCapRate === null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Enter a property value greater than zero to compute cap rate.
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
          Cap rate compares annual NOI with property value. A higher rate means
          more income relative to price, but it is not a full investment
          verdict — risk, location, and growth still matter.
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Property value from cap rate"
        open={valueOpen}
        onToggle={() => setValueOpen((v) => !v)}
      >
        <p className="text-xs text-muted-foreground">
          Independent reverse valuation. Inputs here do not overwrite Property
          information above.
        </p>
        <div>
          <label className={labelClass} htmlFor="cap-reverse-noi">
            <span>Annual net operating income</span>
          </label>
          <FieldShell error={errors.reverseNoi}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-reverse-noi"
              className={inputClass}
              inputMode="decimal"
              value={input.reverseNoi}
              aria-invalid={Boolean(errors.reverseNoi)}
              onChange={(e) => set({ reverseNoi: e.target.value })}
            />
          </FieldShell>
          {errors.reverseNoi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.reverseNoi}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cap-reverse-rate">
            <span>Expected capitalization rate</span>
          </label>
          <FieldShell error={errors.reverseCapRate}>
            <input
              id="cap-reverse-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.reverseCapRate}
              aria-invalid={Boolean(errors.reverseCapRate)}
              onChange={(e) => set({ reverseCapRate: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.reverseCapRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.reverseCapRate}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cap-est-value">
            <span>Estimated property value</span>
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-est-value"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedEstimatedPropertyValue ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Required net operating income"
        open={requiredOpen}
        onToggle={() => setRequiredOpen((v) => !v)}
      >
        <p className="text-xs text-muted-foreground">
          Independent income-target path. Separate from the primary and reverse
          sections.
        </p>
        <div>
          <label className={labelClass} htmlFor="cap-req-pv">
            <span>Property value</span>
          </label>
          <FieldShell error={errors.requiredPropertyValue}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-req-pv"
              className={inputClass}
              inputMode="decimal"
              value={input.requiredPropertyValue}
              aria-invalid={Boolean(errors.requiredPropertyValue)}
              onChange={(e) => set({ requiredPropertyValue: e.target.value })}
            />
          </FieldShell>
          {errors.requiredPropertyValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.requiredPropertyValue}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cap-target-rate">
            <span>Target cap rate</span>
          </label>
          <FieldShell error={errors.targetCapRate}>
            <input
              id="cap-target-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.targetCapRate}
              aria-invalid={Boolean(errors.targetCapRate)}
              onChange={(e) => set({ targetCapRate: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.targetCapRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetCapRate}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="cap-req-noi">
            <span>Required annual NOI</span>
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {symbol}
            </span>
            <input
              id="cap-req-noi"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedRequiredAnnualNoi ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
        {result?.formattedRequiredMonthlyNoi ? (
          <div>
            <label className={labelClass} htmlFor="cap-req-noi-mo">
              <span>Required monthly NOI</span>
            </label>
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {symbol}
              </span>
              <input
                id="cap-req-noi-mo"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result.formattedRequiredMonthlyNoi}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        ) : null}
      </CollapsibleSection>

      <CollapsibleSection
        title="Additional settings"
        open={settingsOpen}
        onToggle={() => setSettingsOpen((v) => !v)}
      >
        <p className="text-sm text-muted-foreground">
          Cap rate uses annual NOI. Mortgage payments, interest, and
          depreciation are excluded from operating expenses. Display currency
          and income period are controlled above.
        </p>
      </CollapsibleSection>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
