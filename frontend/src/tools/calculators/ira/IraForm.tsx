'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { IRA_RULE_YEAR, iraAnnualLimitUsd } from './ira-limits';
import type { IraFieldErrors, IraInput, IraResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
        )}
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-4 py-3">{children}</div>
      ) : null}
    </div>
  );
}

interface IraFormProps {
  input: IraInput;
  errors: IraFieldErrors;
  result: IraResult | null;
  ratesStale: boolean;
  onChange: (input: IraInput) => void;
  onLoadExample: () => void;
}

export function IraForm({
  input,
  errors,
  result,
  ratesStale,
  onChange,
  onLoadExample,
}: IraFormProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tradOpen, setTradOpen] = useState(true);
  const [rothOpen, setRothOpen] = useState(true);

  const set = (patch: Partial<IraInput>) => onChange({ ...input, ...patch });

  const age = Number(input.currentAge);
  const limitHint = Number.isFinite(age)
    ? `IRS TY${IRA_RULE_YEAR} limit ≈ $${iraAnnualLimitUsd(age).toLocaleString('en-US')} USD (age ${Math.floor(age)})`
    : `IRS TY${IRA_RULE_YEAR} IRA limit applies in USD`;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Compare Traditional/SEP/SIMPLE-style deductible contributions with Roth
        after-tax contributions. Growth uses end-of-year deposits; withdrawals
        are level amortizations. Money fields convert with stored FX rates.{' '}
        {limitHint}. Estimates only — not tax advice.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (30→65 · 35y contrib · 7% · $7,500)
      </button>

      {ratesStale ? (
        <p className="text-xs text-amber-700">
          Exchange rates are older than 48 hours; conversions still use the
          stored map.
        </p>
      ) : null}
      {errors.conversion ? (
        <p className="text-xs text-rose-600">{errors.conversion}</p>
      ) : null}

      <SectionCard
        title="Your details"
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="ira-age" className={labelClass}>
              Current age
            </label>
            <FieldShell error={errors.currentAge}>
              <input
                id="ira-age"
                className={inputClass}
                inputMode="decimal"
                value={input.currentAge}
                onChange={(e) => set({ currentAge: e.target.value })}
                placeholder="30"
              />
              <span className="pr-3 text-sm text-muted-foreground">years</span>
            </FieldShell>
            {errors.currentAge ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ira-retire" className={labelClass}>
              Retirement age
            </label>
            <FieldShell error={errors.retirementAge}>
              <input
                id="ira-retire"
                className={inputClass}
                inputMode="decimal"
                value={input.retirementAge}
                onChange={(e) => set({ retirementAge: e.target.value })}
                placeholder="65"
              />
              <span className="pr-3 text-sm text-muted-foreground">years</span>
            </FieldShell>
            {errors.retirementAge ? (
              <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ira-wd" className={labelClass}>
              Years of withdrawal
              <InfoTooltip
                label="Years of withdrawal"
                text="Number of years over which the projected balance is drawn with a constant annual withdrawal while the remaining balance continues to earn the stated return."
              />
            </label>
            <FieldShell error={errors.withdrawalYears}>
              <input
                id="ira-wd"
                className={inputClass}
                inputMode="decimal"
                value={input.withdrawalYears}
                onChange={(e) => set({ withdrawalYears: e.target.value })}
                placeholder="20"
              />
              <span className="pr-3 text-sm text-muted-foreground">years</span>
            </FieldShell>
            {errors.withdrawalYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.withdrawalYears}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ira-cy" className={labelClass}>
              Contribution years
            </label>
            <FieldShell error={errors.contributionYears}>
              <input
                id="ira-cy"
                className={inputClass}
                inputMode="decimal"
                value={input.contributionYears}
                onChange={(e) => set({ contributionYears: e.target.value })}
                placeholder="35"
              />
              <span className="pr-3 text-sm text-muted-foreground">years</span>
            </FieldShell>
            {errors.contributionYears ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.contributionYears}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ira-tc" className={labelClass}>
              Tax bracket during contribution
            </label>
            <FieldShell error={errors.taxBracketContributionPercent}>
              <input
                id="ira-tc"
                className={inputClass}
                inputMode="decimal"
                value={input.taxBracketContributionPercent}
                onChange={(e) =>
                  set({ taxBracketContributionPercent: e.target.value })
                }
                placeholder="24"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.taxBracketContributionPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.taxBracketContributionPercent}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ira-tr" className={labelClass}>
              Tax bracket at retirement
            </label>
            <FieldShell error={errors.taxBracketRetirementPercent}>
              <input
                id="ira-tr"
                className={inputClass}
                inputMode="decimal"
                value={input.taxBracketRetirementPercent}
                onChange={(e) =>
                  set({ taxBracketRetirementPercent: e.target.value })
                }
                placeholder="22"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.taxBracketRetirementPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.taxBracketRetirementPercent}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="ira-contrib" className={labelClass}>
            Annual contribution
            <InfoTooltip
              label="Annual contribution"
              text="Assumed deductible annual contribution for the Traditional/SEP/SIMPLE comparison path. Changing this can sync the Roth after-tax contribution using (1 − contribution tax rate)."
            />
          </label>
          <FieldShell error={errors.traditionalContribution}>
            <input
              id="ira-contrib"
              className={inputClass}
              inputMode="decimal"
              value={input.traditionalContribution}
              onChange={(e) =>
                set({
                  traditionalContribution: e.target.value,
                  lastEditedContribution: 'traditionalContribution',
                })
              }
              placeholder="7500"
            />
            <div className="pr-1">
              <CurrencySelect
                value={input.traditionalContributionCurrency}
                onChange={(traditionalContributionCurrency) =>
                  set({ traditionalContributionCurrency })
                }
                aria-label="Annual contribution currency"
                showDenominationNote={false}
              />
            </div>
          </FieldShell>
          {errors.traditionalContribution ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.traditionalContribution}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ira-roth-c" className={labelClass}>
            Annual contribution after tax (Roth IRA)
          </label>
          <FieldShell error={errors.rothContribution}>
            <input
              id="ira-roth-c"
              className={inputClass}
              inputMode="decimal"
              value={input.rothContribution}
              onChange={(e) =>
                set({
                  rothContribution: e.target.value,
                  lastEditedContribution: 'rothContribution',
                })
              }
              placeholder="5700"
            />
            <div className="pr-1">
              <CurrencySelect
                value={input.rothContributionCurrency}
                onChange={(rothContributionCurrency) =>
                  set({ rothContributionCurrency })
                }
                aria-label="Roth contribution currency"
                showDenominationNote={false}
              />
            </div>
          </FieldShell>
          {errors.rothContribution ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rothContribution}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ira-ret" className={labelClass}>
            Annual return rate
          </label>
          <FieldShell error={errors.annualReturnPercent}>
            <input
              id="ira-ret"
              className={inputClass}
              inputMode="decimal"
              value={input.annualReturnPercent}
              onChange={(e) => set({ annualReturnPercent: e.target.value })}
              placeholder="7"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.annualReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualReturnPercent}
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Results for Traditional IRA, SEP IRA, and SIMPLE IRA"
        open={tradOpen}
        onToggle={() => setTradOpen((v) => !v)}
      >
        <ResultMoney
          id="ira-bal"
          label="IRA balance"
          value={result?.formattedTraditionalBalance ?? '—'}
          currency={input.balanceCurrency}
          onCurrency={(balanceCurrency) => set({ balanceCurrency })}
        />
        <ResultMoney
          id="ira-wd-g"
          label="IRA annual withdrawal"
          value={result?.formattedTraditionalGrossWithdrawal ?? '—'}
          currency={input.traditionalWithdrawalCurrency}
          onCurrency={(traditionalWithdrawalCurrency) =>
            set({ traditionalWithdrawalCurrency })
          }
        />
        <ResultMoney
          id="ira-tax"
          label="Estimated annual tax"
          value={result?.formattedTraditionalAnnualTax ?? '—'}
          currency={input.traditionalAfterTaxCurrency}
          onCurrency={(traditionalAfterTaxCurrency) =>
            set({ traditionalAfterTaxCurrency })
          }
        />
        <ResultMoney
          id="ira-th"
          label="Annual take home"
          value={result?.formattedTraditionalTakeHome ?? '—'}
          currency={input.traditionalTakeHomeCurrency}
          onCurrency={(traditionalTakeHomeCurrency) =>
            set({ traditionalTakeHomeCurrency })
          }
        />
      </SectionCard>

      <SectionCard
        title="Results for Roth IRA"
        open={rothOpen}
        onToggle={() => setRothOpen((v) => !v)}
      >
        <ResultMoney
          id="ira-rb"
          label="Roth IRA balance"
          value={result?.formattedRothBalance ?? '—'}
          currency={input.rothBalanceCurrency}
          onCurrency={(rothBalanceCurrency) => set({ rothBalanceCurrency })}
        />
        <ResultMoney
          id="ira-rth"
          label="Annual take home"
          value={result?.formattedRothTakeHome ?? '—'}
          currency={input.rothTakeHomeCurrency}
          onCurrency={(rothTakeHomeCurrency) => set({ rothTakeHomeCurrency })}
        />
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}

function ResultMoney({
  id,
  label,
  value,
  currency,
  onCurrency,
}: {
  id: string;
  label: string;
  value: string;
  currency: SupportedCurrency;
  onCurrency: (c: SupportedCurrency) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <FieldShell>
        <input
          id={id}
          className={inputClass}
          readOnly
          value={value}
          aria-readonly="true"
        />
        <div className="pr-1">
          <CurrencySelect
            value={currency}
            onChange={onCurrency}
            aria-label={`${label} currency`}
            showDenominationNote={false}
          />
        </div>
      </FieldShell>
    </div>
  );
}
