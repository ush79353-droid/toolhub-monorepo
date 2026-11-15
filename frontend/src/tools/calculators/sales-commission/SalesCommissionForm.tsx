'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  COMMISSION_BASES,
  COMMISSION_BASE_LABELS,
  showsDerivedThreshold,
  usesBasePayTarget,
  usesGrossMarginTarget,
  usesManualQuota,
  type CommissionBase,
  type SalesCommissionFieldErrors,
  type SalesCommissionInput,
  type SalesCommissionResult,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SalesCommissionDraft {
  revenue: string;
  cogs: string;
  sellingExpenses: string;
  discountRatePercent: string;
  baseSalary: string;
  commissionRatePercent: string;
  commissionBase: CommissionBase;
  salesQuota: string;
  basePayTargetPercent: string;
  grossMarginTargetPercent: string;
  currency: SalesCommissionInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function formatAmount(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

export function inputToDraft(input: SalesCommissionInput): SalesCommissionDraft {
  return {
    revenue: formatAmount(input.revenue),
    cogs: formatAmount(input.cogs),
    sellingExpenses: formatAmount(input.sellingExpenses),
    discountRatePercent: formatAmount(input.discountRatePercent),
    baseSalary: formatAmount(input.baseSalary),
    commissionRatePercent: formatAmount(input.commissionRatePercent),
    commissionBase: input.commissionBase,
    salesQuota: formatAmount(input.salesQuota),
    basePayTargetPercent: formatAmount(input.basePayTargetPercent),
    grossMarginTargetPercent: formatAmount(input.grossMarginTargetPercent),
    currency: input.currency,
  };
}

export function draftToInput(draft: SalesCommissionDraft): SalesCommissionInput {
  return {
    revenue: parseOptionalNumber(draft.revenue),
    cogs: parseOptionalNumber(draft.cogs),
    sellingExpenses: parseOptionalNumber(draft.sellingExpenses),
    discountRatePercent: parseOptionalNumber(draft.discountRatePercent),
    baseSalary: parseOptionalNumber(draft.baseSalary),
    commissionRatePercent: parseOptionalNumber(draft.commissionRatePercent),
    commissionBase: draft.commissionBase,
    salesQuota: parseOptionalNumber(draft.salesQuota),
    basePayTargetPercent: parseOptionalNumber(draft.basePayTargetPercent),
    grossMarginTargetPercent: parseOptionalNumber(draft.grossMarginTargetPercent),
    currency: draft.currency,
  };
}

interface SalesCommissionFormProps {
  draft: SalesCommissionDraft;
  errors: SalesCommissionFieldErrors;
  result: SalesCommissionResult | null;
  onDraftChange: (draft: SalesCommissionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function SalesCommissionForm({
  draft,
  errors,
  result,
  onDraftChange,
  onSubmit,
  onReset,
}: SalesCommissionFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const money = (value: number | null | undefined) =>
    value === null || value === undefined || !Number.isFinite(value)
      ? '—'
      : formatCurrencyValue(value, draft.currency);
  const pct = (value: number | null | undefined) =>
    value === null || value === undefined || !Number.isFinite(value) ? '—' : `${value}%`;
  const patch = (next: Partial<SalesCommissionDraft>) => onDraftChange({ ...draft, ...next });
  const show = result?.defined ? result : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Section title="Gross profit elements">
        <Field
          id="sc-revenue"
          label="Gross sales or revenue"
          prefix={symbol}
          value={draft.revenue}
          error={errors.revenue}
          onChange={(revenue) => patch({ revenue })}
        />
        <Field
          id="sc-cogs"
          label="Cost of goods sold (COGS)"
          prefix={symbol}
          value={draft.cogs}
          error={errors.cogs}
          onChange={(cogs) => patch({ cogs })}
        />
        <Readout label="Gross profit" value={money(show?.grossProfit)} />
      </Section>

      <Section title="Sales related costs">
        <Field
          id="sc-selling"
          label="Selling expenses"
          prefix={symbol}
          value={draft.sellingExpenses}
          error={errors.sellingExpenses}
          onChange={(sellingExpenses) => patch({ sellingExpenses })}
        />
        <Field
          id="sc-discount-rate"
          label="Discount rate"
          suffix="%"
          value={draft.discountRatePercent}
          error={errors.discountRatePercent}
          onChange={(discountRatePercent) => patch({ discountRatePercent })}
        />
        <Readout label="Discount" value={money(show?.discount)} />
      </Section>

      <Section title="Labor cost elements">
        <Field
          id="sc-base-salary"
          label="Base salary"
          prefix={symbol}
          value={draft.baseSalary}
          error={errors.baseSalary}
          onChange={(baseSalary) => patch({ baseSalary })}
        />
        <Field
          id="sc-commission-rate"
          label="Commission rate"
          suffix="%"
          value={draft.commissionRatePercent}
          error={errors.commissionRatePercent}
          onChange={(commissionRatePercent) => patch({ commissionRatePercent })}
        />
        <div>
          <label className={labelClass} htmlFor="sc-commission-base">
            Commission based on…
          </label>
          <FieldShell error={errors.commissionBase}>
            <select
              id="sc-commission-base"
              className={`${inputClass} pr-8`}
              value={draft.commissionBase}
              onChange={(event) =>
                patch({ commissionBase: event.target.value as CommissionBase })
              }
            >
              {COMMISSION_BASES.map((key) => (
                <option key={key} value={key}>
                  {COMMISSION_BASE_LABELS[key]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.commissionBase ? (
            <p className="mt-1 text-xs text-rose-600">{errors.commissionBase}</p>
          ) : null}
        </div>

        {usesManualQuota(draft.commissionBase) ? (
          <Field
            id="sc-quota"
            label="Sales threshold"
            prefix={symbol}
            value={draft.salesQuota}
            error={errors.salesQuota}
            onChange={(salesQuota) => patch({ salesQuota })}
          />
        ) : null}

        {usesBasePayTarget(draft.commissionBase) ? (
          <Field
            id="sc-base-pay-target"
            label="Base pay target"
            suffix="%"
            value={draft.basePayTargetPercent}
            error={errors.basePayTargetPercent}
            onChange={(basePayTargetPercent) => patch({ basePayTargetPercent })}
          />
        ) : null}

        {usesGrossMarginTarget(draft.commissionBase) ? (
          <Field
            id="sc-margin-target"
            label="Gross margin target"
            suffix="%"
            value={draft.grossMarginTargetPercent}
            error={errors.grossMarginTargetPercent}
            onChange={(grossMarginTargetPercent) => patch({ grossMarginTargetPercent })}
          />
        ) : null}

        {showsDerivedThreshold(draft.commissionBase) && !usesManualQuota(draft.commissionBase) ? (
          <Readout label="Sales threshold" value={money(show?.salesThreshold)} />
        ) : null}

        <Readout label="Commission base" value={money(show?.commissionBaseAmount)} />
        <Readout label="Commission" value={money(show?.commission)} />
        <Readout label="Total labor cost or OTE" value={money(show?.totalLaborCost)} />
      </Section>

      <Section title="Operational profit elements">
        <Readout label="Operational cost" value={money(show?.operationalCost)} />
        <Readout label="Operational profit" value={money(show?.operationalProfit)} />
        <Readout label="Gross sales margin" value={money(show?.grossSalesMargin)} />
      </Section>

      <Section title="Further metrics">
        <Readout
          label="Operational margin (sales margin)"
          value={pct(show?.operationalMarginPercent)}
        />
        <Readout label="Gross margin rate" value={pct(show?.grossMarginRatePercent)} />
        <Readout label="Labor cost to sales" value={pct(show?.laborCostToSalesPercent)} />
      </Section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-border bg-muted/20 p-3.5">
      <legend className="px-1 text-[13px] font-semibold text-accent">{title}</legend>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-primary/15 bg-brand-softTeal/50 px-3 py-2.5">
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  prefix,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <FieldShell error={error}>
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
        {suffix ? (
          <span className="pr-3 text-xs text-muted-foreground" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </FieldShell>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
        error ? 'border-rose-500' : 'border-border'
      } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
    >
      {children}
    </div>
  );
}
