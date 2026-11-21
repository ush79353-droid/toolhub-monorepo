'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  aprPercentToMoneyFactor,
  formatAutoLeaseMoneyFactor,
  formatAutoLeasePercent,
  moneyFactorToAprPercent,
} from './calculation';
import type {
  AutoLeaseFieldErrors,
  AutoLeaseInput,
  AutoLeaseMode,
  AutoLeaseRateType,
  AutoLeaseResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-2 pr-7 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

interface AutoLeaseFormProps {
  input: AutoLeaseInput;
  errors: AutoLeaseFieldErrors;
  result: AutoLeaseResult | null;
  onChange: (input: AutoLeaseInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function AutoLeaseForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: AutoLeaseFormProps) {
  const set = (patch: Partial<AutoLeaseInput>) => onChange({ ...input, ...patch });

  const setMode = (mode: AutoLeaseMode) => {
    if (mode === input.mode) return;
    if (mode === 'monthly-payment') {
      set({
        mode,
        monthlyPayment:
          input.monthlyPayment.trim() !== ''
            ? input.monthlyPayment
            : result
              ? String(Math.round(result.monthlyPayment * 100) / 100)
              : '',
      });
      return;
    }
    set({
      mode,
      autoPrice:
        input.autoPrice.trim() !== ''
          ? input.autoPrice
          : result
            ? String(Math.round(result.autoPrice * 100) / 100)
            : '50000',
    });
  };

  const setRateType = (rateType: AutoLeaseRateType) => {
    if (rateType === input.rateType) return;
    const cleaned = input.rateValue.trim().replace(/,/g, '');
    const current = Number(cleaned);
    if (!cleaned || !Number.isFinite(current) || current < 0) {
      set({
        rateType,
        rateValue: rateType === 'apr' ? '4.992' : '0.00208',
      });
      return;
    }
    if (rateType === 'apr') {
      const apr = moneyFactorToAprPercent(current);
      set({
        rateType,
        rateValue: apr === null ? '4.992' : formatAutoLeasePercent(apr),
      });
      return;
    }
    const mf = aprPercentToMoneyFactor(current);
    set({
      rateType,
      rateValue: mf === null ? '0.00208' : formatAutoLeaseMoneyFactor(mf),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-foreground/90">
        Modify the values and click Calculate. Amounts are in USD. Sales tax is applied to the
        monthly payment (common retail assumption; jurisdictions differ).
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
          className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          noValidate
          autoComplete="off"
        >
          <div className="flex rounded-lg border border-border bg-white p-1" role="tablist">
            {(
              [
                { value: 'total-price', label: 'Total Price' },
                { value: 'monthly-payment', label: 'Monthly Payment' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={input.mode === tab.value}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                  input.mode === tab.value
                    ? 'bg-primary text-white'
                    : 'text-accent hover:bg-muted/40'
                }`}
                onClick={() => setMode(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {input.mode === 'total-price' ? (
            <div>
              <label className={labelClass} htmlFor="auto-lease-auto-price">
                <span>Auto Price</span>
                <InfoTooltip
                  label="Auto Price"
                  text="Negotiated vehicle price before lease allowances. Used to build capitalized cost."
                />
              </label>
              <FieldShell error={errors.autoPrice}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="auto-lease-auto-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.autoPrice}
                  onChange={(e) => set({ autoPrice: e.target.value })}
                  aria-invalid={Boolean(errors.autoPrice)}
                />
              </FieldShell>
              {errors.autoPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.autoPrice}</p>
              ) : null}
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="auto-lease-monthly-payment">
                <span>Monthly Payment</span>
                <InfoTooltip
                  label="Monthly Payment"
                  text="Target tax-inclusive monthly lease payment. Solves for the maximum auto price."
                />
              </label>
              <FieldShell error={errors.monthlyPayment}>
                <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                  $
                </span>
                <input
                  id="auto-lease-monthly-payment"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.monthlyPayment}
                  onChange={(e) => set({ monthlyPayment: e.target.value })}
                  aria-invalid={Boolean(errors.monthlyPayment)}
                />
              </FieldShell>
              {errors.monthlyPayment ? (
                <p className="mt-1 text-xs text-rose-600">{errors.monthlyPayment}</p>
              ) : null}
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="auto-lease-term">
              <span>Lease Term</span>
            </label>
            <div className="flex items-center gap-2">
              <FieldShell error={errors.leaseTermMonths}>
                <input
                  id="auto-lease-term"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.leaseTermMonths}
                  onChange={(e) => set({ leaseTermMonths: e.target.value })}
                  aria-invalid={Boolean(errors.leaseTermMonths)}
                />
              </FieldShell>
              <span className="shrink-0 text-sm text-muted-foreground">months</span>
            </div>
            {errors.leaseTermMonths ? (
              <p className="mt-1 text-xs text-rose-600">{errors.leaseTermMonths}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="auto-lease-rate-type">
              <span>Interest Rate Type</span>
              <InfoTooltip
                label="Interest Rate Type"
                text="Money factor is the lease finance rate. APR converts approximately as money factor = APR% / 2400."
              />
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative w-full sm:w-[160px] shrink-0">
                <select
                  id="auto-lease-rate-type"
                  className={selectClass}
                  value={input.rateType}
                  onChange={(e) => setRateType(e.target.value as AutoLeaseRateType)}
                >
                  <option value="money-factor">Money Factor</option>
                  <option value="apr">APR</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <FieldShell error={errors.rateValue}>
                <input
                  id="auto-lease-rate-value"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.rateValue}
                  onChange={(e) => set({ rateValue: e.target.value })}
                  aria-label={input.rateType === 'apr' ? 'APR percent' : 'Money factor'}
                  aria-invalid={Boolean(errors.rateValue)}
                />
                {input.rateType === 'apr' ? (
                  <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden>
                    %
                  </span>
                ) : null}
              </FieldShell>
            </div>
            {errors.rateValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.rateValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="auto-lease-down">
              <span>Down Payment</span>
            </label>
            <FieldShell error={errors.downPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="auto-lease-down"
                className={inputClass}
                inputMode="decimal"
                value={input.downPayment}
                onChange={(e) => set({ downPayment: e.target.value })}
                aria-invalid={Boolean(errors.downPayment)}
              />
            </FieldShell>
            {errors.downPayment ? (
              <p className="mt-1 text-xs text-rose-600">{errors.downPayment}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="auto-lease-trade-in">
              <span>Trade-in Value</span>
              <InfoTooltip
                label="Trade-in Value"
                text="Allowance applied to reduce capitalized cost. It is not added again as an upfront cash cost."
              />
            </label>
            <FieldShell error={errors.tradeInValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="auto-lease-trade-in"
                className={inputClass}
                inputMode="decimal"
                value={input.tradeInValue}
                onChange={(e) => set({ tradeInValue: e.target.value })}
                aria-invalid={Boolean(errors.tradeInValue)}
              />
            </FieldShell>
            {errors.tradeInValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.tradeInValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="auto-lease-tax">
              <span>Sales Tax</span>
              <InfoTooltip
                label="Sales Tax"
                text="Applied to each monthly payment in this calculator. Some states tax capitalized cost or residual differently."
              />
            </label>
            <div className="flex items-center gap-2">
              <FieldShell error={errors.salesTaxPercent}>
                <input
                  id="auto-lease-tax"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesTaxPercent}
                  onChange={(e) => set({ salesTaxPercent: e.target.value })}
                  aria-invalid={Boolean(errors.salesTaxPercent)}
                />
              </FieldShell>
              <span className="shrink-0 text-sm text-muted-foreground">%</span>
            </div>
            {errors.salesTaxPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesTaxPercent}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="auto-lease-residual">
              <span>Residual Value</span>
              <InfoTooltip
                label="Residual Value"
                text="Estimated vehicle value at lease end. Higher residual usually lowers the monthly depreciation charge."
              />
            </label>
            <FieldShell error={errors.residualValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="auto-lease-residual"
                className={inputClass}
                inputMode="decimal"
                value={input.residualValue}
                onChange={(e) => set({ residualValue: e.target.value })}
                aria-invalid={Boolean(errors.residualValue)}
              />
            </FieldShell>
            {errors.residualValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.residualValue}</p>
            ) : null}
          </div>

          {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" className="h-10 rounded-xl px-4 text-xs font-semibold">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4 text-xs font-semibold"
              onClick={onClear}
            >
              Clear
            </Button>
          </div>
        </form>

        <AutoLeaseResultsPanel result={result} />
      </div>
    </div>
  );
}

function AutoLeaseResultsPanel({ result }: { result: AutoLeaseResult | null }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Enter lease details and click Calculate to see the monthly payment and cost breakdown.
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    {
      label: result.mode === 'monthly-payment' ? 'Max auto price' : 'Auto price',
      value: `$${result.formattedAutoPrice}`,
    },
    { label: 'Monthly payment', value: `$${result.formattedMonthlyPayment}` },
    { label: 'Capitalized cost', value: `$${result.formattedCapitalizedCost}` },
    { label: 'Monthly depreciation', value: `$${result.formattedMonthlyDepreciation}` },
    { label: 'Monthly finance charge', value: `$${result.formattedMonthlyFinanceCharge}` },
    { label: 'Base monthly (pre-tax)', value: `$${result.formattedBaseMonthlyPayment}` },
    { label: 'Monthly sales tax', value: `$${result.formattedMonthlySalesTax}` },
    { label: 'Total lease payments', value: `$${result.formattedTotalLeasePayments}` },
    { label: 'Total depreciation', value: `$${result.formattedTotalDepreciation}` },
    { label: 'Total finance charge', value: `$${result.formattedTotalFinanceCharge}` },
    { label: 'Total sales tax', value: `$${result.formattedTotalSalesTax}` },
    { label: 'Upfront (down payment)', value: `$${result.formattedUpfrontCost}` },
    { label: 'Total lease cost', value: `$${result.formattedTotalLeaseCost}` },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <div>
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Money factor {result.formattedMoneyFactor}
          {result.rateType === 'apr' ? ` (≈ ${result.formattedAprPercent}% APR)` : ''} ·{' '}
          {result.leaseTermMonths} months
        </p>
      </div>
      <div className="rounded-lg border border-border bg-brand-softTeal/30 px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">Primary answer</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
          ${result.formattedMonthlyPayment}
          <span className="ml-1 text-sm font-semibold text-muted-foreground">/mo</span>
        </p>
        {result.mode === 'monthly-payment' ? (
          <p className="mt-1 text-sm text-foreground/90">
            Max auto price ${result.formattedAutoPrice}
          </p>
        ) : null}
      </div>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 border-b border-border/70 pb-2 last:border-b-0 last:pb-0"
          >
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-accent">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Total lease cost = total monthly payments + down payment. Trade-in reduces capitalized cost
        and is not double-counted as cash due. Rounded values are for display only.
      </p>
    </div>
  );
}
