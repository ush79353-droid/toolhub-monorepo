'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { calculateNetBorrowingFromDebtBalances, formatFcfeMoney } from './calculation';
import {
  FCFE_METHOD_OPTIONS,
  type FcfeFieldErrors,
  type FcfeInput,
  type FcfeMethod,
  type FcfeResult,
  type NetBorrowingSource,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface FcfeFormProps {
  input: FcfeInput;
  errors: FcfeFieldErrors;
  result: FcfeResult | null;
  onChange: (input: FcfeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function FcfeForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: FcfeFormProps) {
  const [methodOpen, setMethodOpen] = useState(true);
  const [borrowOpen, setBorrowOpen] = useState(true);
  const [adjOpen, setAdjOpen] = useState(true);
  const [resultOpen, setResultOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const method = input.method;

  const needsInterestTax =
    method === 'ebitda' || method === 'ebit' || method === 'fcff';
  const needsDaWc =
    method === 'netIncome' || method === 'ebitda' || method === 'ebit';
  const needsCapex = method !== 'fcff';
  const debtMode = input.netBorrowingSource === 'debtBalances';

  const set = (patch: Partial<FcfeInput>) => {
    onChange({ ...input, ...patch });
  };

  let netBorrowingDisplay = result?.formattedNetBorrowing ?? '';
  if (!netBorrowingDisplay && debtMode) {
    const b = parseNonneg(input.beginningTotalDebt);
    const e = parseNonneg(input.endingTotalDebt);
    if (b !== null && e !== null) {
      const nb = calculateNetBorrowingFromDebtBalances(b, e);
      if (nb !== null) netBorrowingDisplay = formatFcfeMoney(nb, input.currency);
    }
  } else if (!netBorrowingDisplay && !debtMode) {
    // show typed direct value formatted lightly via raw
    netBorrowingDisplay = input.directNetBorrowing;
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
          aria-label="Currency for FCFE amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures.
      </p>

      <CollapsibleSection
        title="Calculation method"
        open={methodOpen}
        onToggle={() => setMethodOpen((o) => !o)}
      >
        <fieldset>
          <legend className={`${labelClass} mb-2`}>Calculate using</legend>
          <div className="space-y-2" role="radiogroup" aria-label="FCFE method">
            {FCFE_METHOD_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="fcfe-method"
                  className="mt-1"
                  checked={method === opt.value}
                  onChange={() => set({ method: opt.value as FcfeMethod })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {method === 'netIncome' ? (
          <div>
            <label htmlFor="fcfe-ni" className={labelClass}>
              Net income
              <InfoTooltip
                label="Net income"
                text="After-tax earnings attributable to equity holders for the period. Already reflects interest and taxes."
              />
            </label>
            <FieldShell error={errors.netIncome}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-ni"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.netIncome}
                onChange={(e) => set({ netIncome: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.netIncome)}
              />
            </FieldShell>
            {errors.netIncome ? (
              <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
            ) : null}
          </div>
        ) : null}

        {method === 'ebitda' ? (
          <div>
            <label htmlFor="fcfe-ebitda" className={labelClass}>
              EBITDA
              <InfoTooltip
                label="EBITDA"
                text="Earnings before interest, taxes, depreciation, and amortization."
              />
            </label>
            <FieldShell error={errors.ebitda}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-ebitda"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.ebitda}
                onChange={(e) => set({ ebitda: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.ebitda)}
              />
            </FieldShell>
            {errors.ebitda ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ebitda}</p>
            ) : null}
          </div>
        ) : null}

        {method === 'ebit' ? (
          <div>
            <label htmlFor="fcfe-ebit" className={labelClass}>
              EBIT
              <InfoTooltip
                label="EBIT"
                text="Earnings before interest and taxes (operating profit under the selected presentation)."
              />
            </label>
            <FieldShell error={errors.ebit}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-ebit"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.ebit}
                onChange={(e) => set({ ebit: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.ebit)}
              />
            </FieldShell>
            {errors.ebit ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ebit}</p>
            ) : null}
          </div>
        ) : null}

        {method === 'cfo' ? (
          <div>
            <label htmlFor="fcfe-cfo" className={labelClass}>
              Operating cash flow (CFO)
              <InfoTooltip
                label="Operating cash flow"
                text="Cash flow from operations on an after-interest basis for the same period. D&A and ΔNWC are already included."
              />
            </label>
            <FieldShell error={errors.operatingCashFlow}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-cfo"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.operatingCashFlow}
                onChange={(e) => set({ operatingCashFlow: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.operatingCashFlow)}
              />
            </FieldShell>
            {errors.operatingCashFlow ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.operatingCashFlow}
              </p>
            ) : null}
          </div>
        ) : null}

        {method === 'fcff' ? (
          <div>
            <label htmlFor="fcfe-fcff" className={labelClass}>
              Free cash flow to firm (FCFF)
              <InfoTooltip
                label="FCFF"
                text="Unlevered free cash flow to all capital providers. CapEx and ΔNWC are already reflected."
              />
            </label>
            <FieldShell error={errors.freeCashFlowToFirm}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-fcff"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.freeCashFlowToFirm}
                onChange={(e) => set({ freeCashFlowToFirm: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.freeCashFlowToFirm)}
              />
            </FieldShell>
            {errors.freeCashFlowToFirm ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.freeCashFlowToFirm}
              </p>
            ) : null}
          </div>
        ) : null}

        {needsInterestTax ? (
          <>
            <div>
              <label htmlFor="fcfe-interest" className={labelClass}>
                Interest expense
                <InfoTooltip
                  label="Interest expense"
                  text="Relevant interest expense for the period. Deducted once before tax in EBIT/EBITDA modes; after-tax interest is removed from FCFF."
                />
              </label>
              <FieldShell error={errors.interestExpense}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-interest"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.interestExpense}
                  onChange={(e) => set({ interestExpense: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.interestExpense)}
                />
              </FieldShell>
              {errors.interestExpense ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.interestExpense}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="fcfe-tax" className={labelClass}>
                Effective income tax rate
                <InfoTooltip
                  label="Effective income tax rate"
                  text="Simplified effective tax rate as a percent from 0 to 100. Pretax losses do not invent a tax refund."
                />
              </label>
              <FieldShell error={errors.effectiveTaxRate}>
                <input
                  id="fcfe-tax"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.effectiveTaxRate}
                  onChange={(e) => set({ effectiveTaxRate: e.target.value })}
                  placeholder="25"
                  aria-invalid={Boolean(errors.effectiveTaxRate)}
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.effectiveTaxRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.effectiveTaxRate}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </CollapsibleSection>

      <CollapsibleSection
        title="Net borrowing"
        open={borrowOpen}
        onToggle={() => setBorrowOpen((o) => !o)}
      >
        <div>
          <label htmlFor="fcfe-nb-source" className={labelClass}>
            Net borrowing source
          </label>
          <select
            id="fcfe-nb-source"
            className={selectClass}
            value={input.netBorrowingSource}
            onChange={(e) =>
              set({
                netBorrowingSource: e.target.value as NetBorrowingSource,
              })
            }
          >
            <option value="debtBalances">
              Calculate from beginning and ending debt
            </option>
            <option value="direct">Enter net borrowing directly</option>
          </select>
        </div>

        {debtMode ? (
          <>
            <div>
              <label htmlFor="fcfe-begin-debt" className={labelClass}>
                Beginning total debt
                <InfoTooltip
                  label="Beginning total debt"
                  text="Outstanding interest-bearing debt at the start of the period."
                />
              </label>
              <FieldShell error={errors.beginningTotalDebt}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-begin-debt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningTotalDebt}
                  onChange={(e) => set({ beginningTotalDebt: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.beginningTotalDebt)}
                />
              </FieldShell>
              {errors.beginningTotalDebt ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.beginningTotalDebt}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="fcfe-end-debt" className={labelClass}>
                Ending total debt
                <InfoTooltip
                  label="Ending total debt"
                  text="Outstanding interest-bearing debt at the end of the period. Balance changes may differ from cash net borrowing due to FX, acquisitions, or noncash items."
                />
              </label>
              <FieldShell error={errors.endingTotalDebt}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-end-debt"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingTotalDebt}
                  onChange={(e) => set({ endingTotalDebt: e.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors.endingTotalDebt)}
                />
              </FieldShell>
              {errors.endingTotalDebt ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.endingTotalDebt}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="fcfe-direct-nb" className={labelClass}>
              Net borrowing
              <InfoTooltip
                label="Net borrowing"
                text="Debt issued minus debt repaid. Positive increases FCFE; negative decreases FCFE."
              />
            </label>
            <FieldShell error={errors.directNetBorrowing}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-direct-nb"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.directNetBorrowing}
                onChange={(e) => set({ directNetBorrowing: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.directNetBorrowing)}
              />
            </FieldShell>
            {errors.directNetBorrowing ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.directNetBorrowing}
              </p>
            ) : null}
          </div>
        )}

        {debtMode ? (
          <div>
            <label htmlFor="fcfe-nb" className={labelClass}>
              Net borrowing
              <InfoTooltip
                label="Net borrowing"
                text="Ending debt − Beginning debt (simplified). Prefer cash debt issued − repaid when available."
              />
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="fcfe-nb"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default text-muted-foreground`}
                value={netBorrowingDisplay}
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        ) : null}
      </CollapsibleSection>

      {(needsDaWc || needsCapex) && (
        <CollapsibleSection
          title="Adjustments"
          open={adjOpen}
          onToggle={() => setAdjOpen((o) => !o)}
        >
          {needsDaWc ? (
            <div>
              <label htmlFor="fcfe-da" className={labelClass}>
                Depreciation and amortization
                <InfoTooltip
                  label="Depreciation and amortization"
                  text="Noncash D&A deducted from the income measure — added back in NI/EBIT/EBITDA modes. Not used again in CFO/FCFF modes."
                />
              </label>
              <FieldShell error={errors.depreciationAmortization}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-da"
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
          ) : null}

          {needsCapex ? (
            <div>
              <label htmlFor="fcfe-capex" className={labelClass}>
                Fixed capital investment
                <InfoTooltip
                  label="Fixed capital investment"
                  text="Capital expenditures (CapEx). Positive outflows reduce FCFE. Not subtracted again in FCFF mode."
                />
              </label>
              <FieldShell error={errors.fixedCapitalInvestment}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-capex"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.fixedCapitalInvestment}
                  onChange={(e) =>
                    set({ fixedCapitalInvestment: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.fixedCapitalInvestment)}
                />
              </FieldShell>
              {errors.fixedCapitalInvestment ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.fixedCapitalInvestment}
                </p>
              ) : null}
            </div>
          ) : null}

          {needsDaWc ? (
            <div>
              <label htmlFor="fcfe-wc" className={labelClass}>
                Working capital investment
                <InfoTooltip
                  label="Working capital investment"
                  text="Change in noncash operating working capital. Positive reduces FCFE; negative increases FCFE. Already in CFO/FCFF."
                />
              </label>
              <FieldShell error={errors.workingCapitalInvestment}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="fcfe-wc"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.workingCapitalInvestment}
                  onChange={(e) =>
                    set({ workingCapitalInvestment: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.workingCapitalInvestment)}
                />
              </FieldShell>
              {errors.workingCapitalInvestment ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.workingCapitalInvestment}
                </p>
              ) : null}
            </div>
          ) : null}

          {input.method === 'fcff' ? (
            <p className="text-xs text-muted-foreground">
              CapEx and working capital investment are already reflected in FCFF —
              only interest, tax rate, and net borrowing are applied here.
            </p>
          ) : null}
          {input.method === 'cfo' ? (
            <p className="text-xs text-muted-foreground">
              D&amp;A and working capital changes are already in CFO. Only CapEx and
              net borrowing are applied.
            </p>
          ) : null}
        </CollapsibleSection>
      )}

      <CollapsibleSection
        title="Result"
        open={resultOpen}
        onToggle={() => setResultOpen((o) => !o)}
      >
        <div>
          <label htmlFor="fcfe-result" className={labelClass}>
            Free cash flow to equity (FCFE)
            <InfoTooltip
              label="Free cash flow to equity"
              text="Residual cash flow potentially available to equity holders after reinvestment and net borrowing under the selected method."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="fcfe-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedFreeCashFlowToEquity ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>
    </form>
  );
}
