'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateGrossProfit,
  calculateOperatingExpenses,
  formatEbtMoney,
} from './calculation';
import type { EbtFieldErrors, EbtInput, EbtResult } from './types';

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

function parseNonneg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

interface EbtFormProps {
  input: EbtInput;
  errors: EbtFieldErrors;
  result: EbtResult | null;
  onChange: (input: EbtInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EbtForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EbtFormProps) {
  const [grossOpen, setGrossOpen] = useState(true);
  const [opexOpen, setOpexOpen] = useState(true);
  const [otherOpen, setOtherOpen] = useState(true);
  const [ebtOpen, setEbtOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<EbtInput>) => {
    onChange({ ...input, ...patch });
  };

  let grossDisplay = result?.formattedGrossProfit ?? '';
  if (!grossDisplay) {
    const r = parseNonneg(input.revenue);
    const c = parseNonneg(input.costOfGoodsSold);
    if (r !== null && c !== null) {
      const gp = calculateGrossProfit(r, c);
      if (gp !== null) grossDisplay = formatEbtMoney(gp, input.currency);
    }
  }

  let opexDisplay = result?.formattedOperatingExpenses ?? '';
  if (!opexDisplay) {
    const s = parseNonneg(input.sellingGeneralAdministrative);
    const d = parseNonneg(input.depreciationAmortization);
    if (s !== null && d !== null) {
      const oe = calculateOperatingExpenses(s, d);
      if (oe !== null) opexDisplay = formatEbtMoney(oe, input.currency);
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for EBT amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures. Enter D&amp;A only if it is not already in COGS or
        SG&amp;A.
      </p>

      <CollapsibleSection
        title="Gross profit"
        open={grossOpen}
        onToggle={() => setGrossOpen((o) => !o)}
      >
        <div>
          <label htmlFor="ebt-revenue" className={labelClass}>
            Revenue
            <InfoTooltip
              label="Revenue"
              text="Income earned from selling products or providing services during the reporting period."
            />
          </label>
          <FieldShell error={errors.revenue}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-revenue"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.revenue}
              onChange={(e) => set({ revenue: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.revenue)}
            />
          </FieldShell>
          {errors.revenue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ebt-cogs" className={labelClass}>
            Cost of goods sold (COGS)
            <InfoTooltip
              label="Cost of goods sold"
              text="Cost attributable to goods or services sold during the reporting period."
            />
          </label>
          <FieldShell error={errors.costOfGoodsSold}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-cogs"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.costOfGoodsSold}
              onChange={(e) => set({ costOfGoodsSold: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.costOfGoodsSold)}
            />
          </FieldShell>
          {errors.costOfGoodsSold ? (
            <p className="mt-1 text-xs text-rose-600">{errors.costOfGoodsSold}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ebt-gp" className={labelClass}>
            Gross profit
            <InfoTooltip
              label="Gross profit"
              text="Revenue − COGS. Negative gross profit is valid when COGS exceeds revenue."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-gp"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={grossDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Operating expenses"
        open={opexOpen}
        onToggle={() => setOpexOpen((o) => !o)}
      >
        <div>
          <label htmlFor="ebt-sga" className={labelClass}>
            SG&amp;A
            <InfoTooltip
              label="SG&A"
              text="Selling, General, and Administrative expenses — marketing, admin salaries, office rent, and similar overhead."
            />
          </label>
          <FieldShell error={errors.sellingGeneralAdministrative}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-sga"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sellingGeneralAdministrative}
              onChange={(e) =>
                set({ sellingGeneralAdministrative: e.target.value })
              }
              placeholder="0"
              aria-invalid={Boolean(errors.sellingGeneralAdministrative)}
            />
          </FieldShell>
          {errors.sellingGeneralAdministrative ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.sellingGeneralAdministrative}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ebt-da" className={labelClass}>
            Depreciation and amortization (D&amp;A)
            <InfoTooltip
              label="Depreciation and amortization"
              text="Enter only D&A not already included in COGS or SG&A. Do not subtract the same amount twice."
            />
          </label>
          <FieldShell error={errors.depreciationAmortization}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-da"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.depreciationAmortization}
              onChange={(e) =>
                set({ depreciationAmortization: e.target.value })
              }
              placeholder="0"
              aria-invalid={Boolean(errors.depreciationAmortization)}
            />
          </FieldShell>
          {errors.depreciationAmortization ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.depreciationAmortization}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ebt-opex" className={labelClass}>
            Operating expenses
            <InfoTooltip
              label="Operating expenses"
              text="SG&A + D&A for this calculator’s simplified structure."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-opex"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={opexDisplay}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Other"
        open={otherOpen}
        onToggle={() => setOtherOpen((o) => !o)}
      >
        <div>
          <label htmlFor="ebt-interest" className={labelClass}>
            Interest expenses
            <InfoTooltip
              label="Interest expenses"
              text="Financing costs on debt and other interest-bearing obligations. Not principal repayments."
            />
          </label>
          <FieldShell error={errors.interestExpenses}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-interest"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.interestExpenses}
              onChange={(e) => set({ interestExpenses: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.interestExpenses)}
            />
          </FieldShell>
          {errors.interestExpenses ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestExpenses}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ebt-other" className={labelClass}>
            Other income
            <InfoTooltip
              label="Other income"
              text="Non-operating income or net other gains/losses. Negative values represent net other losses and reduce EBT."
            />
          </label>
          <FieldShell error={errors.otherIncome}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-other"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.otherIncome}
              onChange={(e) => set({ otherIncome: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.otherIncome)}
            />
          </FieldShell>
          {errors.otherIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.otherIncome}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="EBT"
        open={ebtOpen}
        onToggle={() => setEbtOpen((o) => !o)}
      >
        <div>
          <label htmlFor="ebt-result" className={labelClass}>
            Earnings before tax (EBT)
            <InfoTooltip
              label="Earnings before tax"
              text="Gross profit − Operating expenses − Interest + Other income. Excludes income tax expense."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ebt-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedEarningsBeforeTax ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>
    </form>
  );
}
