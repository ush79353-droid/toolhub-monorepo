'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { calculateFourZeroThreeB } from './calculation';
import {
  DEFAULT_FOUR_ZERO_THREE_B_DRAFT,
  draftToInput,
  FourZeroThreeBForm,
  type FourZeroThreeBDraft,
} from './FourZeroThreeBForm';
import { FourZeroThreeBResults } from './FourZeroThreeBResults';
import type { FourZeroThreeBFieldErrors, FourZeroThreeBResult } from './types';
import { validateFourZeroThreeB } from './validation';

const MONEY_FIELDS = [
  'balance',
  'annualSalary',
  'employeeFixedAnnual',
  'targetBalance',
  'electiveDeferralLimit',
  'catchUpAmount',
  'annualAdditionsLimit',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts balances, salary, and dollar contributions using stored exchange rates. Percents and ages stay the same.';

function formatPercent(decimal: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(decimal * 100)}%`;
}

function summaryText(
  result: FourZeroThreeBResult,
  currency: FourZeroThreeBDraft['currency'],
  note: string
): string {
  const money = (value: number) => formatCurrencyValue(value, currency);
  const lines = [
    '403(b) Calculator — Omega Calculators',
    `Projected nominal balance: ${money(result.finalBalance)}`,
    `Inflation-adjusted balance: ${money(result.inflationAdjustedBalance)}`,
    `Employee contributions: ${money(result.employeeContributions)}`,
    `Employer contributions: ${money(result.employerContributions)}`,
    `Vested employer contributions: ${money(result.vestedEmployerContributions)}`,
    `Investment growth: ${money(result.investmentGrowth)}`,
    `Fees: ${money(result.fees)}`,
    `Years until retirement: ${result.years}`,
    `First-year employee deferral: ${money(result.firstYearEmployeeContribution)} (${formatPercent(result.firstYearEmployeePercent)})`,
    `First-year employer deposit: ${money(result.firstYearEmployerContribution)}`,
  ];
  if (result.solvedEmployeePercent !== null) {
    lines.push(`Employee deferral needed: ${formatPercent(result.solvedEmployeePercent)}`);
  }
  if (result.solvedEmployeeFixedAnnual !== null) {
    lines.push(`Employee deferral needed: ${money(result.solvedEmployeeFixedAnnual)} per year`);
  }
  if (result.solvedSalary !== null) lines.push(`Starting salary needed: ${money(result.solvedSalary)}`);
  if (result.solvedEmployerRate !== null) lines.push(`Employer rate needed: ${formatPercent(result.solvedEmployerRate)}`);
  if (result.impossible) lines.push('The target is out of reach under these limits.');
  lines.push('Projection from these assumptions, not a guaranteed return.');
  lines.push(note);
  return lines.join('\n');
}

export function FourZeroThreeBCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<FourZeroThreeBDraft>(DEFAULT_FOUR_ZERO_THREE_B_DRAFT);
  const [errors, setErrors] = React.useState<FourZeroThreeBFieldErrors>({});
  const [result, setResult] = React.useState<FourZeroThreeBResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const evaluate = React.useCallback((next: FourZeroThreeBDraft) => {
    const parsed = draftToInput(next);
    const validation = validateFourZeroThreeB(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateFourZeroThreeB(parsed) : null);
  }, []);

  React.useEffect(() => {
    evaluate(DEFAULT_FOUR_ZERO_THREE_B_DRAFT);
  }, [evaluate]);

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      draft,
      MONEY_FIELDS,
      draft.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next = { ...draft, ...converted.values, currency } as FourZeroThreeBDraft;
    setDraft(next);
    evaluate(next);
  };

  const sharePayload = result ? summaryText(result, draft.currency, currencyNote) : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">Projection from your assumptions</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="fztb-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="fztb-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={handleCurrencyChange}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-xs font-normal leading-relaxed text-muted-foreground">{currencyNote}</p>
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <FourZeroThreeBForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
            setConversionError(null);
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(DEFAULT_FOUR_ZERO_THREE_B_DRAFT);
            setCopied(false);
            setShared(false);
            setConversionError(null);
            evaluate(DEFAULT_FOUR_ZERO_THREE_B_DRAFT);
          }}
        />
        <FourZeroThreeBResults
          result={result}
          currency={draft.currency}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({ title: metadata.title, text: sharePayload })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                // The user dismissed the share sheet. Leave the results in place.
              });
          }}
        />
      </div>
    </section>
  );
}
