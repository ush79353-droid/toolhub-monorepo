'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { PERIOD_LABELS, type AffoFieldErrors, type AffoInput, type AffoResult, type ReportingPeriod } from './types';
import { parseOptionalNumber } from './validation';

export interface AffoDraft {
  currency: AffoInput['currency'];
  period: ReportingPeriod;
  netIncome: string;
  realEstateDepreciation: string;
  propertySaleLosses: string;
  propertySaleGains: string;
  interestIncome: string;
  straightLineRentAdjustment: string;
  recurringMaintenanceCapex: string;
  maintenanceAdjustment: string;
  noncashCompensation: string;
  debtIssuanceAmortization: string;
  leaseAmortizationAdjustment: string;
  dilutedShares: string;
  dividends: string;
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function formatAmount(value: number | null): string {
  return value === null ? '' : String(value);
}

export function inputToDraft(input: AffoInput): AffoDraft {
  return {
    currency: input.currency,
    period: input.period,
    netIncome: formatAmount(input.netIncome),
    realEstateDepreciation: formatAmount(input.realEstateDepreciation),
    propertySaleLosses: formatAmount(input.propertySaleLosses),
    propertySaleGains: formatAmount(input.propertySaleGains),
    interestIncome: formatAmount(input.interestIncome),
    straightLineRentAdjustment: formatAmount(input.straightLineRentAdjustment),
    recurringMaintenanceCapex: formatAmount(input.recurringMaintenanceCapex),
    maintenanceAdjustment: formatAmount(input.maintenanceAdjustment),
    noncashCompensation: formatAmount(input.noncashCompensation),
    debtIssuanceAmortization: formatAmount(input.debtIssuanceAmortization),
    leaseAmortizationAdjustment: formatAmount(input.leaseAmortizationAdjustment),
    dilutedShares: formatAmount(input.dilutedShares),
    dividends: formatAmount(input.dividends),
  };
}

export function draftToInput(draft: AffoDraft): AffoInput {
  const money = (raw: string) => parseOptionalNumber(raw) ?? Number.NaN;
  const optional = (raw: string) => {
    const parsed = parseOptionalNumber(raw);
    return parsed === null ? null : parsed;
  };
  return {
    currency: draft.currency,
    period: draft.period,
    netIncome: money(draft.netIncome),
    realEstateDepreciation: money(draft.realEstateDepreciation),
    propertySaleLosses: money(draft.propertySaleLosses),
    propertySaleGains: money(draft.propertySaleGains),
    interestIncome: money(draft.interestIncome),
    straightLineRentAdjustment: money(draft.straightLineRentAdjustment),
    recurringMaintenanceCapex: money(draft.recurringMaintenanceCapex),
    maintenanceAdjustment: money(draft.maintenanceAdjustment),
    noncashCompensation: money(draft.noncashCompensation),
    debtIssuanceAmortization: money(draft.debtIssuanceAmortization),
    leaseAmortizationAdjustment: money(draft.leaseAmortizationAdjustment),
    dilutedShares: optional(draft.dilutedShares),
    dividends: optional(draft.dividends),
  };
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div className={`flex h-11 items-center rounded-lg border bg-white ${error ? 'border-rose-400' : 'border-border'}`}>
      {children}
    </div>
  );
}

function MoneyField({
  id,
  label,
  tooltip,
  value,
  error,
  symbol,
  onChange,
  placeholder = '0',
}: {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
          {symbol}
        </span>
        <input
          id={id}
          inputMode="decimal"
          placeholder={placeholder}
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </FieldShell>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CalculatedLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-white px-3 py-2.5 sm:col-span-2">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

interface AffoFormProps {
  draft: AffoDraft;
  errors: AffoFieldErrors;
  result: AffoResult | null;
  onDraftChange: (draft: AffoDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function AFFOForm({ draft, errors, result, onDraftChange, onSubmit, onReset }: AffoFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<AffoDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className={labelClass} htmlFor="affo-period">
          Reporting period
          <InfoTooltip
            label="Reporting period"
            text="Every amount on this screen uses the same period. Choosing monthly does not multiply an annual figure, and choosing annual does not divide a monthly one."
          />
        </label>
        <select
          id="affo-period"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
          value={draft.period}
          onChange={(event) => set({ period: event.target.value as ReportingPeriod })}
        >
          {(Object.keys(PERIOD_LABELS) as ReportingPeriod[]).map((period) => (
            <option key={period} value={period}>
              {PERIOD_LABELS[period]}
            </option>
          ))}
        </select>
        {errors.period ? <p className="mt-1 text-xs text-rose-600">{errors.period}</p> : null}
      </div>

      <details open className="rounded-xl border border-border bg-muted/30">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">Funds from operations (FFO)</summary>
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
          <MoneyField
            id="affo-net-income"
            label="Net income"
            tooltip="The period's net income. Enter a loss as a negative number. Interest income that is already in this figure is not adjusted again."
            value={draft.netIncome}
            error={errors.netIncome}
            symbol={symbol}
            onChange={(netIncome) => set({ netIncome })}
          />
          <MoneyField
            id="affo-da"
            label="Eligible real-estate depreciation and amortization"
            tooltip="Add back only depreciation and amortization of real estate assets. Do not dump every depreciation account into this field. Corporate or non-real-estate charges stay out unless your reconciliation specifically includes them."
            value={draft.realEstateDepreciation}
            error={errors.realEstateDepreciation}
            symbol={symbol}
            onChange={(realEstateDepreciation) => set({ realEstateDepreciation })}
          />
          <MoneyField
            id="affo-gains"
            label="Eligible gains on property sales"
            tooltip="Gains on sales of real estate that you are removing from FFO. Do not enter gains on unrelated assets. A positive number is subtracted."
            value={draft.propertySaleGains}
            error={errors.propertySaleGains}
            symbol={symbol}
            onChange={(propertySaleGains) => set({ propertySaleGains })}
          />
          <MoneyField
            id="affo-losses"
            label="Eligible losses on property sales"
            tooltip="Losses on sales of real estate that you are adding back. A positive number increases FFO. Unrelated losses stay out."
            value={draft.propertySaleLosses}
            error={errors.propertySaleLosses}
            symbol={symbol}
            onChange={(propertySaleLosses) => set({ propertySaleLosses })}
          />
          <MoneyField
            id="affo-interest"
            label="Interest income"
            tooltip="Recorded for context only. If net income already includes this interest, the calculator does not add or subtract it again. It is not a standard FFO removal."
            value={draft.interestIncome}
            error={errors.interestIncome}
            symbol={symbol}
            onChange={(interestIncome) => set({ interestIncome })}
          />
          <CalculatedLine
            label="Simplified FFO"
            value={result ? formatCurrencyValue(result.ffo, result.currency) : '—'}
          />
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/30">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          Adjusted funds from operations (AFFO)
        </summary>
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
          <MoneyField
            id="affo-straight-line"
            label="Straight-line rent adjustment (noncash income in FFO)"
            tooltip="The noncash straight-line rent already included in net income and FFO. A positive number is subtracted. This is not the cash increase from a new lease year, and contractual rent increases are not removed automatically."
            value={draft.straightLineRentAdjustment}
            error={errors.straightLineRentAdjustment}
            symbol={symbol}
            onChange={(straightLineRentAdjustment) => set({ straightLineRentAdjustment })}
          />
          <MoneyField
            id="affo-capex"
            label="Recurring maintenance capital expenditures"
            tooltip="Recurring spending that keeps existing properties operating, often called maintenance capex. Leave out acquisitions, developments, and other growth projects. A positive number is deducted."
            value={draft.recurringMaintenanceCapex}
            error={errors.recurringMaintenanceCapex}
            symbol={symbol}
            onChange={(recurringMaintenanceCapex) => set({ recurringMaintenanceCapex })}
          />
          <MoneyField
            id="affo-maintenance"
            label="Incremental maintenance adjustment not already in FFO"
            tooltip="Use this only for a qualifying maintenance amount that is not already inside net income and FFO. Routine repairs that already reduced net income must stay at zero here or they will be deducted twice."
            value={draft.maintenanceAdjustment}
            error={errors.maintenanceAdjustment}
            symbol={symbol}
            onChange={(maintenanceAdjustment) => set({ maintenanceAdjustment })}
          />
          <CalculatedLine
            label="Simplified AFFO"
            value={result ? formatCurrencyValue(result.affo, result.currency) : '—'}
          />
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/30">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">Optional adjustments, per share, and payout</summary>
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
          <MoneyField
            id="affo-comp"
            label="Noncash compensation add-back"
            tooltip="Stock-based or other noncash pay already expensed in net income. A positive number is added. Leave at zero if you are not making this adjustment."
            value={draft.noncashCompensation}
            error={errors.noncashCompensation}
            symbol={symbol}
            onChange={(noncashCompensation) => set({ noncashCompensation })}
          />
          <MoneyField
            id="affo-debt"
            label="Debt issuance cost amortization add-back"
            tooltip="Noncash amortization of debt issuance costs already inside net income. A positive number is added. Not every REIT adds this item."
            value={draft.debtIssuanceAmortization}
            error={errors.debtIssuanceAmortization}
            symbol={symbol}
            onChange={(debtIssuanceAmortization) => set({ debtIssuanceAmortization })}
          />
          <MoneyField
            id="affo-lease"
            label="Above/below-market lease amortization (signed)"
            tooltip="A signed recurring noncash lease item. Positive adds an expense add-back. Negative removes noncash income. Policies differ, so enter only the amount your reconciliation supports."
            value={draft.leaseAmortizationAdjustment}
            error={errors.leaseAmortizationAdjustment}
            symbol={symbol}
            onChange={(leaseAmortizationAdjustment) => set({ leaseAmortizationAdjustment })}
          />
          <div>
            <label className={labelClass} htmlFor="affo-shares">
              Diluted shares
              <InfoTooltip
                label="Diluted shares"
                text="Optional. Per-share FFO and AFFO are left blank until this count is greater than zero. The count must match the same reporting period as the dollar amounts."
              />
            </label>
            <FieldShell error={errors.dilutedShares}>
              <input
                id="affo-shares"
                inputMode="decimal"
                placeholder="Optional"
                className={inputClass}
                value={draft.dilutedShares}
                onChange={(event) => set({ dilutedShares: event.target.value })}
                aria-invalid={Boolean(errors.dilutedShares)}
              />
            </FieldShell>
            {errors.dilutedShares ? <p className="mt-1 text-xs text-rose-600">{errors.dilutedShares}</p> : null}
          </div>
          <MoneyField
            id="affo-dividends"
            label="Dividends for this period"
            tooltip="Optional. The payout ratio is dividends divided by simplified AFFO for this same period. It is blank when AFFO is zero. It is not a measure of cash available to distribute."
            value={draft.dividends}
            error={errors.dividends}
            symbol={symbol}
            onChange={(dividends) => set({ dividends })}
            placeholder="Optional"
          />
        </div>
      </details>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" className="h-11 flex-1 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
