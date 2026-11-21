'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CltvFieldErrors,
  CltvInput,
  CltvResult,
  ReportingPeriodKind,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'text-sm font-semibold text-accent';

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

interface CltvFormProps {
  input: CltvInput;
  errors: CltvFieldErrors;
  result: CltvResult | null;
  onChange: (input: CltvInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CltvForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CltvFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CltvInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        CLTV = APV × annual purchase frequency × lifespan. Default result is
 revenue-based and undiscounted; not net profit. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="cltv-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($50 · 5/yr · 3 years → $750 CLTV)
      </button>

      <h3 className={sectionClass}>Average Customer Value</h3>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useBusinessData}
          onChange={(e) => set({ useBusinessData: e.target.checked })}
        />
        Determine total revenue, number of customers and purchases
      </label>

      {input.useBusinessData ? (
        <>
          <div>
            <label htmlFor="cltv-revenue" className={labelClass}>
              Total revenue
            </label>
            <FieldShell error={errors.totalRevenue}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cltv-revenue"
                className={inputClass}
                inputMode="decimal"
                value={input.totalRevenue}
                onChange={(e) => set({ totalRevenue: e.target.value })}
                placeholder="5000000"
              />
            </FieldShell>
            {errors.totalRevenue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cltv-purchases" className={labelClass}>
              Total number of purchases
            </label>
            <FieldShell error={errors.totalPurchases}>
              <input
                id="cltv-purchases"
                className={inputClass}
                inputMode="decimal"
                value={input.totalPurchases}
                onChange={(e) => set({ totalPurchases: e.target.value })}
                placeholder="100000"
              />
            </FieldShell>
            {errors.totalPurchases ? (
              <p className="mt-1 text-xs text-rose-600">{errors.totalPurchases}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cltv-customers" className={labelClass}>
              Number of customers
            </label>
            <FieldShell error={errors.numberOfCustomers}>
              <input
                id="cltv-customers"
                className={inputClass}
                inputMode="decimal"
                value={input.numberOfCustomers}
                onChange={(e) => set({ numberOfCustomers: e.target.value })}
                placeholder="20000"
              />
            </FieldShell>
            {errors.numberOfCustomers ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.numberOfCustomers}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cltv-period" className={labelClass}>
              Reporting period
              <InfoTooltip
                label="Reporting period"
                text="All business totals must cover the same period. Frequency is annualized before computing CLTV."
              />
            </label>
            <select
              id="cltv-period"
              className={selectClass}
              value={input.reportingPeriod}
              onChange={(e) =>
                set({
                  reportingPeriod: e.target.value as ReportingPeriodKind,
                })
              }
            >
              <option value="annual">Annually</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom (months)</option>
            </select>
          </div>
          {input.reportingPeriod === 'custom' ? (
            <div>
              <label htmlFor="cltv-months" className={labelClass}>
                Period length (months)
              </label>
              <FieldShell error={errors.customPeriodMonths}>
                <input
                  id="cltv-months"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.customPeriodMonths}
                  onChange={(e) =>
                    set({ customPeriodMonths: e.target.value })
                  }
                  placeholder="12"
                />
              </FieldShell>
              {errors.customPeriodMonths ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.customPeriodMonths}
                </p>
              ) : null}
            </div>
          ) : null}
          <div>
            <label htmlFor="cltv-apv-out" className={labelClass}>
              Average purchase value
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cltv-apv-out"
                className={inputClass}
                readOnly
                value={
                  result
                    ? result.averagePurchaseValue.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : ''
                }
                placeholder="—"
              />
            </FieldShell>
          </div>
          <div>
            <label htmlFor="cltv-apf-out" className={labelClass}>
              Average purchase frequency (annual)
            </label>
            <FieldShell muted>
              <input
                id="cltv-apf-out"
                className={inputClass}
                readOnly
                value={result?.formattedApf ?? ''}
                placeholder="—"
              />
              <span className="pr-3 text-xs text-muted-foreground">/yr</span>
            </FieldShell>
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="cltv-apv" className={labelClass}>
              Average purchase value
              <InfoTooltip
                label="Average purchase value"
                text="Typical revenue per purchase (or order) for an average customer."
              />
            </label>
            <FieldShell error={errors.averagePurchaseValue}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cltv-apv"
                className={inputClass}
                inputMode="decimal"
                value={input.averagePurchaseValue}
                onChange={(e) =>
                  set({ averagePurchaseValue: e.target.value })
                }
                placeholder="50"
              />
            </FieldShell>
            {errors.averagePurchaseValue ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.averagePurchaseValue}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cltv-apf" className={labelClass}>
              Average purchase frequency
              <InfoTooltip
                label="Average purchase frequency"
                text="Purchases per customer per year."
              />
            </label>
            <FieldShell error={errors.averagePurchaseFrequency}>
              <input
                id="cltv-apf"
                className={inputClass}
                inputMode="decimal"
                value={input.averagePurchaseFrequency}
                onChange={(e) =>
                  set({ averagePurchaseFrequency: e.target.value })
                }
                placeholder="5"
              />
              <span className="pr-3 text-xs text-muted-foreground">
                /customer/yr
              </span>
            </FieldShell>
            {errors.averagePurchaseFrequency ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.averagePurchaseFrequency}
              </p>
            ) : null}
          </div>
        </>
      )}

      <div>
        <label htmlFor="cltv-acv" className={labelClass}>
          Average customer value
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="cltv-acv"
            className={inputClass}
            readOnly
            value={
              result
                ? result.averageCustomerValue.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })
                : ''
            }
            placeholder="—"
          />
          <span className="pr-3 text-xs text-muted-foreground">
            /customer/yr
          </span>
        </FieldShell>
      </div>

      <h3 className={`${sectionClass} pt-1`}>
        Customer Lifetime Value (CLTV)
      </h3>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useChurnLifespan}
          onChange={(e) => set({ useChurnLifespan: e.target.checked })}
        />
        Estimate lifespan from annual churn (≈ 1 ÷ churn)
      </label>
      {input.useChurnLifespan ? (
        <div>
          <label htmlFor="cltv-churn" className={labelClass}>
            Annual churn rate
          </label>
          <FieldShell error={errors.annualChurnRate}>
            <input
              id="cltv-churn"
              className={inputClass}
              inputMode="decimal"
              value={input.annualChurnRate}
              onChange={(e) => set({ annualChurnRate: e.target.value })}
              placeholder="20"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.annualChurnRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualChurnRate}</p>
          ) : null}
          {result?.estimatedLifespanFromChurn != null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Approximate lifespan ≈{' '}
              {result.estimatedLifespanFromChurn.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}{' '}
              years (constant-hazard model).
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="cltv-life" className={labelClass}>
          Average customer lifespan
          <InfoTooltip
            label="Average customer lifespan"
            text="Expected years an average customer remains active. Override the churn estimate by entering a value here."
          />
        </label>
        <FieldShell error={errors.averageCustomerLifespan}>
          <input
            id="cltv-life"
            className={inputClass}
            inputMode="decimal"
            value={input.averageCustomerLifespan}
            onChange={(e) =>
              set({ averageCustomerLifespan: e.target.value })
            }
            placeholder="3"
          />
          <span className="pr-3 text-sm text-muted-foreground">years</span>
        </FieldShell>
        {errors.averageCustomerLifespan ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.averageCustomerLifespan}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cltv-out" className={labelClass}>
          CLTV (revenue)
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="cltv-out"
            className={inputClass}
            readOnly
            value={
              result
                ? result.revenueCLTV.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ''
            }
            placeholder="—"
          />
          <span className="pr-3 text-xs text-muted-foreground">/customer</span>
        </FieldShell>
      </div>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useGrossMargin}
          onChange={(e) => set({ useGrossMargin: e.target.checked })}
        />
        Calculate CLTV using gross profit margin
      </label>
      {input.useGrossMargin ? (
        <div>
          <label htmlFor="cltv-margin" className={labelClass}>
            Gross profit margin
          </label>
          <FieldShell error={errors.grossProfitMargin}>
            <input
              id="cltv-margin"
              className={inputClass}
              inputMode="decimal"
              value={input.grossProfitMargin}
              onChange={(e) => set({ grossProfitMargin: e.target.value })}
              placeholder="40"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.grossProfitMargin ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.grossProfitMargin}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useCac}
          onChange={(e) => set({ useCac: e.target.checked })}
        />
        Compare with customer acquisition cost (CAC)
      </label>
      {input.useCac ? (
        <div>
          <label htmlFor="cltv-cac" className={labelClass}>
            Customer acquisition cost
          </label>
          <FieldShell error={errors.customerAcquisitionCost}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="cltv-cac"
              className={inputClass}
              inputMode="decimal"
              value={input.customerAcquisitionCost}
              onChange={(e) =>
                set({ customerAcquisitionCost: e.target.value })
              }
              placeholder="100"
            />
          </FieldShell>
          {errors.customerAcquisitionCost ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.customerAcquisitionCost}
            </p>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useDiscounted}
          onChange={(e) => set({ useDiscounted: e.target.checked })}
        />
        Discounted CLTV (constant annual contribution)
      </label>
      {input.useDiscounted ? (
        <div>
          <label htmlFor="cltv-discount" className={labelClass}>
            Annual discount rate
            <InfoTooltip
              label="Discount rate"
              text="Discounts whole years of constant annual contribution (ACV, or ACV×margin if margin is enabled). Distinct from basic undiscounted CLTV."
            />
          </label>
          <FieldShell error={errors.discountRate}>
            <input
              id="cltv-discount"
              className={inputClass}
              inputMode="decimal"
              value={input.discountRate}
              onChange={(e) => set({ discountRate: e.target.value })}
              placeholder="10"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.discountRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountRate}</p>
          ) : null}
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
