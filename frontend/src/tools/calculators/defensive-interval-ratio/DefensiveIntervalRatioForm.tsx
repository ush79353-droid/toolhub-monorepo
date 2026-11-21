'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DefensiveIntervalRatioFieldErrors,
  DefensiveIntervalRatioInput,
  DefensiveIntervalRatioResult,
  DirSolveTarget,
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

function Section({
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
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        {title}
        <span className="font-normal text-muted-foreground">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const SOLVE_LABELS: Record<DirSolveTarget, string> = {
  dir: 'Defensive interval ratio (days)',
  requiredAssets: 'Required defensive assets',
  maxDailyExpenditure: 'Maximum daily cash expenditure',
};

interface DefensiveIntervalRatioFormProps {
  input: DefensiveIntervalRatioInput;
  errors: DefensiveIntervalRatioFieldErrors;
  result: DefensiveIntervalRatioResult | null;
  onChange: (input: DefensiveIntervalRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function DefensiveIntervalRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: DefensiveIntervalRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DefensiveIntervalRatioInput>) =>
    onChange({ ...input, ...patch });
  const [openAssets, setOpenAssets] = useState(true);
  const [openSpend, setOpenSpend] = useState(true);
  const [openDir, setOpenDir] = useState(true);
  const solving = input.solveTarget;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        DIR = defensive assets ÷ average daily cash expenditure (365-day year).
        Defensive assets = cash + marketable securities + collectible receivables
; not inventory or all balance-sheet current assets. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="dir-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="dir-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="dir-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({ solveTarget: e.target.value as DirSolveTarget })
          }
        >
          {(Object.keys(SOLVE_LABELS) as DirSolveTarget[]).map((t) => (
            <option key={t} value={t}>
              {SOLVE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load Company Alpha example (160 days)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {solving === 'dir' ? (
        <>
          <Section
            title="Current Assets"
            open={openAssets}
            onToggle={() => setOpenAssets((v) => !v)}
          >
            <div>
              <label htmlFor="dir-cash" className={labelClass}>
                Cash and Cash Equivalents
                <InfoTooltip
                  label="Cash and Cash Equivalents"
                  text="Cash on hand, bank balances, and highly liquid cash equivalents available to pay the company's operating expenses."
                />
              </label>
              <FieldShell error={errors.cashAndCashEquivalents}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-cash"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cashAndCashEquivalents}
                  onChange={(e) =>
                    set({ cashAndCashEquivalents: e.target.value })
                  }
                  placeholder="10000000"
                />
              </FieldShell>
              {errors.cashAndCashEquivalents ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.cashAndCashEquivalents}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dir-ms" className={labelClass}>
                Marketable Securities
                <InfoTooltip
                  label="Marketable Securities"
                  text="Short-term, readily marketable investments that can be converted into cash, subject to liquidity and valuation considerations."
                />
              </label>
              <FieldShell error={errors.marketableSecurities}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-ms"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.marketableSecurities}
                  onChange={(e) =>
                    set({ marketableSecurities: e.target.value })
                  }
                  placeholder="5000000"
                />
              </FieldShell>
              {errors.marketableSecurities ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.marketableSecurities}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dir-ar" className={labelClass}>
                Accounts Receivable
                <InfoTooltip
                  label="Accounts Receivable"
                  text="Amounts owed by customers that are expected to be collected. For defensive interval calculations, use receivables reasonably expected to convert into cash."
                />
              </label>
              <FieldShell error={errors.accountsReceivable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-ar"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.accountsReceivable}
                  onChange={(e) => set({ accountsReceivable: e.target.value })}
                  placeholder="17000000"
                />
              </FieldShell>
              {errors.accountsReceivable ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.accountsReceivable}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dir-ca" className={labelClass}>
                Current Assets
                <InfoTooltip
                  label="Current Assets"
                  text="Subtotal of qualifying defensive assets (cash + marketable securities + collectible receivables). This is not total accounting current assets, which may also include inventory and prepaid expenses."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-ca"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.solveTarget === 'dir'
                      ? String(result.defensiveAssets)
                      : ''
                  }
                  placeholder="—"
                />
              </FieldShell>
            </div>
          </Section>

          <Section
            title="Average Daily Expenditure"
            open={openSpend}
            onToggle={() => setOpenSpend((v) => !v)}
          >
            <div>
              <label htmlFor="dir-oe" className={labelClass}>
                Annual Operating Expenses
                <InfoTooltip
                  label="Annual Operating Expenses"
                  text="The company's annual operating expenses before excluding non-cash charges. Ensure the selected figure is consistent with the spending definition used in the calculation."
                />
              </label>
              <FieldShell error={errors.annualOperatingExpenses}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-oe"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualOperatingExpenses}
                  onChange={(e) =>
                    set({ annualOperatingExpenses: e.target.value })
                  }
                  placeholder="110000000"
                />
                <span className="pr-3 text-xs text-muted-foreground">/year</span>
              </FieldShell>
              {errors.annualOperatingExpenses ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.annualOperatingExpenses}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dir-nce" className={labelClass}>
                Annual Non-Cash Charges
                <InfoTooltip
                  label="Annual Non-Cash Charges"
                  text="Non-cash expenses included in operating expenses, such as depreciation and amortization, that do not directly require current-period cash payments."
                />
              </label>
              <FieldShell error={errors.annualNonCashCharges}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-nce"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualNonCashCharges}
                  onChange={(e) =>
                    set({ annualNonCashCharges: e.target.value })
                  }
                  placeholder="37000000"
                />
                <span className="pr-3 text-xs text-muted-foreground">/year</span>
              </FieldShell>
              {errors.annualNonCashCharges ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.annualNonCashCharges}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dir-dce" className={labelClass}>
                Daily Cash Expenditure
                <InfoTooltip
                  label="Daily Cash Expenditure"
                  text="Average daily cash expenditure = (annual operating expenses − annual non-cash charges) ÷ 365. This calculator uses a 365-day year, not 360."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dir-dce"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.solveTarget === 'dir'
                      ? String(result.averageDailyCashExpenditure)
                      : ''
                  }
                  placeholder="—"
                />
                <span className="pr-3 text-xs text-muted-foreground">/day</span>
              </FieldShell>
            </div>
          </Section>

          <Section
            title="Defensive Interval Ratio"
            open={openDir}
            onToggle={() => setOpenDir((v) => !v)}
          >
            <div>
              <label htmlFor="dir-out" className={labelClass}>
                Defensive Interval Ratio
                <InfoTooltip
                  label="Defensive Interval Ratio"
                  text="Approximate days of average cash operating expenditure coverage from qualifying defensive assets: DIR = DA ÷ DCE."
                />
              </label>
              <FieldShell muted>
                <input
                  id="dir-out"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.solveTarget === 'dir'
                      ? String(result.defensiveIntervalDays)
                      : ''
                  }
                  placeholder="—"
                />
                <span className="pr-3 text-sm text-muted-foreground">days</span>
              </FieldShell>
            </div>
          </Section>
        </>
      ) : null}

      {solving === 'requiredAssets' ? (
        <div className="space-y-3 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            Reverse mode: DA = target days × daily cash expenditure.
          </p>
          <div>
            <label htmlFor="dir-target-a" className={labelClass}>
              Target defensive interval (days)
            </label>
            <FieldShell error={errors.targetDays}>
              <input
                id="dir-target-a"
                className={inputClass}
                inputMode="decimal"
                value={input.targetDays}
                onChange={(e) => set({ targetDays: e.target.value })}
                placeholder="90"
              />
              <span className="pr-3 text-sm text-muted-foreground">days</span>
            </FieldShell>
            {errors.targetDays ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetDays}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dir-dce-a" className={labelClass}>
              Average daily cash expenditure
            </label>
            <FieldShell error={errors.dailyCashExpenditure}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dir-dce-a"
                className={inputClass}
                inputMode="decimal"
                value={input.dailyCashExpenditure}
                onChange={(e) =>
                  set({ dailyCashExpenditure: e.target.value })
                }
                placeholder="50000"
              />
              <span className="pr-3 text-xs text-muted-foreground">/day</span>
            </FieldShell>
            {errors.dailyCashExpenditure ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.dailyCashExpenditure}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dir-req" className={labelClass}>
              Required defensive assets
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dir-req"
                className={inputClass}
                readOnly
                aria-readonly
                value={
                  result?.solveTarget === 'requiredAssets'
                    ? String(result.defensiveAssets)
                    : ''
                }
                placeholder="—"
              />
            </FieldShell>
          </div>
        </div>
      ) : null}

      {solving === 'maxDailyExpenditure' ? (
        <div className="space-y-3 rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            Reverse mode: DCE = defensive assets ÷ target days.
          </p>
          <div>
            <label htmlFor="dir-da-b" className={labelClass}>
              Available defensive assets
            </label>
            <FieldShell error={errors.defensiveAssetsDirect}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dir-da-b"
                className={inputClass}
                inputMode="decimal"
                value={input.defensiveAssetsDirect}
                onChange={(e) =>
                  set({ defensiveAssetsDirect: e.target.value })
                }
                placeholder="6000000"
              />
            </FieldShell>
            {errors.defensiveAssetsDirect ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.defensiveAssetsDirect}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dir-target-b" className={labelClass}>
              Target defensive interval (days)
            </label>
            <FieldShell error={errors.targetDays}>
              <input
                id="dir-target-b"
                className={inputClass}
                inputMode="decimal"
                value={input.targetDays}
                onChange={(e) => set({ targetDays: e.target.value })}
                placeholder="120"
              />
              <span className="pr-3 text-sm text-muted-foreground">days</span>
            </FieldShell>
            {errors.targetDays ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetDays}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dir-max-dce" className={labelClass}>
              Maximum daily cash expenditure
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dir-max-dce"
                className={inputClass}
                readOnly
                aria-readonly
                value={
                  result?.solveTarget === 'maxDailyExpenditure'
                    ? String(result.averageDailyCashExpenditure)
                    : ''
                }
                placeholder="—"
              />
              <span className="pr-3 text-xs text-muted-foreground">/day</span>
            </FieldShell>
          </div>
        </div>
      ) : null}
    </form>
  );
}
