'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AreaUnit,
  CommercialLeaseFieldErrors,
  CommercialLeaseInput,
  CommercialLeaseResult,
  RatePeriod,
  RentPeriod,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function SectionCard({
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
    <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span className="text-[13px] font-semibold text-accent">{title}</span>
      </button>
      {open ? <div className="mt-3.5 space-y-3.5">{children}</div> : null}
    </fieldset>
  );
}

interface CommercialLeaseFormProps {
  input: CommercialLeaseInput;
  errors: CommercialLeaseFieldErrors;
  result: CommercialLeaseResult | null;
  conversionError: string | null;
  ratesWarning?: string | null;
  onChange: (input: CommercialLeaseInput) => void;
  onMoneyCurrencyChange: (
    field: 'baseCurrency' | 'opexCurrency' | 'totalRateCurrency' | 'rentCurrency' | 'feeCurrency',
    currency: SupportedCurrency
  ) => void;
}

export function CommercialLeaseForm({
  input,
  errors,
  result,
  conversionError,
  ratesWarning = null,
  onChange,
  onMoneyCurrencyChange,
}: CommercialLeaseFormProps) {
  const [agentOpen, setAgentOpen] = React.useState(true);
  const set = (patch: Partial<CommercialLeaseInput>) => onChange({ ...input, ...patch });

  const baseSymbol = getCurrencySymbol(input.baseCurrency);
  const opexSymbol = getCurrencySymbol(input.opexCurrency);
  const totalSymbol = getCurrencySymbol(input.totalRateCurrency);
  const rentSymbol = getCurrencySymbol(input.rentCurrency);
  const feeSymbol = getCurrencySymbol(input.feeCurrency);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Commercial Rent</legend>

        <div>
          <label className={labelClass} htmlFor="cl-area">
            <span>Area</span>
            <InfoTooltip
              label="Area"
              text="Leasable floor area. Choose m² or ft²; the engine converts to square metres before multiplying by the normalized rental rate."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.area}>
              <input
                id="cl-area"
                className={inputClass}
                inputMode="decimal"
                value={input.area}
                aria-invalid={Boolean(errors.area)}
                onChange={(e) => set({ area: e.target.value })}
              />
            </FieldShell>
            <select
              id="cl-area-unit"
              className={`${selectClass} w-[5.5rem]`}
              value={input.areaUnit}
              aria-label="Area unit"
              onChange={(e) => set({ areaUnit: e.target.value as AreaUnit })}
            >
              <option value="m2">m²</option>
              <option value="ft2">ft²</option>
            </select>
          </div>
          {errors.area ? <p className="mt-1 text-xs text-rose-600">{errors.area}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-base">
            <span>Base rental rate</span>
            <InfoTooltip
              label="Base rental rate"
              text="Landlord base rent per area per period. Changing currency converts this amount with live rates. Area unit and period are never FX-converted."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.baseRate}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {baseSymbol}
              </span>
              <input
                id="cl-base"
                className={`${inputClass} pl-1`}
                inputMode="decimal"
                value={input.baseRate}
                aria-invalid={Boolean(errors.baseRate)}
                onChange={(e) => set({ baseRate: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="cl-base-currency"
              value={input.baseCurrency}
              onChange={(c) => onMoneyCurrencyChange('baseCurrency', c)}
              aria-label="Base rental rate currency"
              className="w-[7.5rem] shrink-0"
            />
            <select
              id="cl-base-area"
              className={`${selectClass} w-[5.5rem]`}
              value={input.baseAreaUnit}
              aria-label="Base rental rate area unit"
              onChange={(e) => set({ baseAreaUnit: e.target.value as AreaUnit })}
            >
              <option value="m2">m²</option>
              <option value="ft2">ft²</option>
            </select>
            <select
              id="cl-base-period"
              className={`${selectClass} w-[4.5rem]`}
              value={input.basePeriod}
              aria-label="Base rental rate period"
              onChange={(e) => set({ basePeriod: e.target.value as RatePeriod })}
            >
              <option value="yr">yr</option>
              <option value="mo">mo</option>
            </select>
          </div>
          {errors.baseRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.baseRate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-opex">
            <span>Operating expenses</span>
            <InfoTooltip
              label="Operating expenses"
              text="Additional expenses charged per area per period (for example CAM). Added once to the base rate. Zero is allowed."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.opex}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {opexSymbol}
              </span>
              <input
                id="cl-opex"
                className={`${inputClass} pl-1`}
                inputMode="decimal"
                value={input.opex}
                aria-invalid={Boolean(errors.opex)}
                onChange={(e) => set({ opex: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="cl-opex-currency"
              value={input.opexCurrency}
              onChange={(c) => onMoneyCurrencyChange('opexCurrency', c)}
              aria-label="Operating expenses currency"
              className="w-[7.5rem] shrink-0"
            />
            <select
              id="cl-opex-area"
              className={`${selectClass} w-[5.5rem]`}
              value={input.opexAreaUnit}
              aria-label="Operating expenses area unit"
              onChange={(e) => set({ opexAreaUnit: e.target.value as AreaUnit })}
            >
              <option value="m2">m²</option>
              <option value="ft2">ft²</option>
            </select>
            <select
              id="cl-opex-period"
              className={`${selectClass} w-[4.5rem]`}
              value={input.opexPeriod}
              aria-label="Operating expenses period"
              onChange={(e) => set({ opexPeriod: e.target.value as RatePeriod })}
            >
              <option value="yr">yr</option>
              <option value="mo">mo</option>
            </select>
          </div>
          {errors.opex ? <p className="mt-1 text-xs text-rose-600">{errors.opex}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-total-rate">
            <span>Total rental rate</span>
            <InfoTooltip
              label="Total rental rate"
              text="Base rental rate plus operating expenses, shown in the selected currency, area unit, and period."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalSymbol}
              </span>
              <input
                id="cl-total-rate"
                className={`${inputClass} pl-1`}
                readOnly
                tabIndex={-1}
                value={result?.formattedTotalRate ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="cl-total-rate-currency"
              value={input.totalRateCurrency}
              onChange={(c) => onMoneyCurrencyChange('totalRateCurrency', c)}
              aria-label="Total rental rate currency"
              className="w-[7.5rem] shrink-0"
            />
            <select
              id="cl-total-rate-area"
              className={`${selectClass} w-[5.5rem]`}
              value={input.totalRateAreaUnit}
              aria-label="Total rental rate area unit"
              onChange={(e) => set({ totalRateAreaUnit: e.target.value as AreaUnit })}
            >
              <option value="m2">m²</option>
              <option value="ft2">ft²</option>
            </select>
            <select
              id="cl-total-rate-period"
              className={`${selectClass} w-[4.5rem]`}
              value={input.totalRatePeriod}
              aria-label="Total rental rate period"
              onChange={(e) => set({ totalRatePeriod: e.target.value as RatePeriod })}
            >
              <option value="yr">yr</option>
              <option value="mo">mo</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-rent">
            <span>Rent</span>
            <InfoTooltip
              label="Rent"
              text="Total rent for the selected period: annual rent = total rate × area; monthly = annual ÷ 12. Currency converts the displayed amount."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {rentSymbol}
              </span>
              <input
                id="cl-rent"
                className={`${inputClass} pl-1`}
                readOnly
                tabIndex={-1}
                value={result?.formattedRent ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="cl-rent-currency"
              value={input.rentCurrency}
              onChange={(c) => onMoneyCurrencyChange('rentCurrency', c)}
              aria-label="Rent currency"
              className="w-[7.5rem] shrink-0"
            />
            <select
              id="cl-rent-period"
              className={`${selectClass} w-[4.5rem]`}
              value={input.rentPeriod}
              aria-label="Rent period"
              onChange={(e) => set({ rentPeriod: e.target.value as RentPeriod })}
            >
              <option value="yr">yr</option>
              <option value="mo">mo</option>
            </select>
          </div>
        </div>
      </fieldset>

      <SectionCard
        title="Rental agent’s fee"
        open={agentOpen}
        onToggle={() => setAgentOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="cl-agent-pct">
            <span>The agent takes</span>
            <InfoTooltip
              label="Agent percentage"
              text="Commission percent of the equivalent years of annual rent. Zero is allowed. Never FX-converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.agentPercent}>
              <input
                id="cl-agent-pct"
                className={inputClass}
                inputMode="decimal"
                value={input.agentPercent}
                aria-invalid={Boolean(errors.agentPercent)}
                onChange={(e) => set({ agentPercent: e.target.value })}
              />
            </FieldShell>
            <span className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {errors.agentPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.agentPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-agent-years">
            <span>of the equivalent of</span>
            <InfoTooltip
              label="Equivalent years of rent"
              text="Number of years of annual rent used as the commission base (for example 2 years of rent)."
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FieldShell error={errors.agentYears}>
              <input
                id="cl-agent-years"
                className={inputClass}
                inputMode="decimal"
                value={input.agentYears}
                aria-invalid={Boolean(errors.agentYears)}
                onChange={(e) => set({ agentYears: e.target.value })}
              />
            </FieldShell>
            <span className="flex h-11 items-center rounded-lg border border-border bg-muted/30 px-3 text-sm text-muted-foreground">
              yrs
            </span>
            <span className="text-sm text-muted-foreground">rent</span>
          </div>
          {errors.agentYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.agentYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cl-fee">
            <span>Total fee</span>
            <InfoTooltip
              label="Total fee"
              text="Annual rent × equivalent years × agent % ÷ 100, shown in the selected currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {feeSymbol}
              </span>
              <input
                id="cl-fee"
                className={`${inputClass} pl-1`}
                readOnly
                tabIndex={-1}
                value={result?.formattedFee ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="cl-fee-currency"
              value={input.feeCurrency}
              onChange={(c) => onMoneyCurrencyChange('feeCurrency', c)}
              aria-label="Total fee currency"
              className="w-[7.5rem] shrink-0"
            />
          </div>
        </div>
      </SectionCard>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
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
