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
import { calculateFiveTwentyNine } from './calculation';
import {
  DEFAULT_FIVE_TWENTY_NINE_INPUT,
  MONTHLY_RATE_NOTE,
  type FiveTwentyNineFieldErrors,
  type FiveTwentyNineResult,
} from './types';
import { validateFiveTwentyNineInput } from './validation';
import {
  draftToInput,
  FiveTwentyNineForm,
  inputToDraft,
  type FiveTwentyNineDraft,
} from './FiveTwentyNineForm';
import { FiveTwentyNineResults } from './FiveTwentyNineResults';

const MONEY_FIELDS = [
  'currentAnnualCost',
  'annualScholarship',
  'currentBalance',
  'initialLumpSum',
  'monthlyContribution',
  'additionalAnnualContribution',
  'annualContributionAlert',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts education costs, balances, and contributions using stored exchange rates. Ages, years, and percents stay the same. US 529 tax treatment is unchanged.';

function summaryText(result: FiveTwentyNineResult, note: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const required =
    result.requiredMonthlyContribution === null
      ? 'Required monthly contribution: not reachable in this saving period.'
      : `Required monthly contribution: ${money(result.requiredMonthlyContribution)}.`;
  return [
    '529 College Savings Plan Calculator — Omega Calculators',
    `Balance at college start: ${money(result.balanceAtCollegeStart)}.`,
    `First-year cost: ${money(result.firstYearCost)}. Total education cost: ${money(result.totalEducationCost)}.`,
    `Contributions: ${money(result.totalContributions)}. Growth: ${money(result.investmentGrowth)}. Fees: ${money(result.investmentFees)}.`,
    `Covered by the 529: ${money(result.coveredByPlan)}. Gap: ${money(result.fundingGap)}. Surplus: ${money(result.surplusBalance)}.`,
    required,
    'Estimate only. Not guaranteed investment performance and not tax advice.',
    note,
    MONTHLY_RATE_NOTE,
  ].join('\n');
}

export function FiveTwentyNineCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<FiveTwentyNineDraft>(() => inputToDraft(DEFAULT_FIVE_TWENTY_NINE_INPUT));
  const [errors, setErrors] = React.useState<FiveTwentyNineFieldErrors>({});
  const [result, setResult] = React.useState<FiveTwentyNineResult | null>(() =>
    calculateFiveTwentyNine(DEFAULT_FIVE_TWENTY_NINE_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const evaluate = React.useCallback((next: FiveTwentyNineDraft) => {
    const parsed = draftToInput(next);
    const validation = validateFiveTwentyNineInput(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateFiveTwentyNine(parsed) : null);
  }, []);

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
    const next = { ...draft, ...converted.values, currency } as FiveTwentyNineDraft;
    setDraft(next);
    evaluate(next);
  };

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
          <p className="text-xs font-normal text-muted-foreground">Assumptions you enter, not a tuition survey</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="ftn-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="ftn-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={handleCurrencyChange}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">{currencyNote}</p>
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <FiveTwentyNineForm
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
            const next = inputToDraft(DEFAULT_FIVE_TWENTY_NINE_INPUT);
            setDraft(next);
            setCopied(false);
            setConversionError(null);
            evaluate(next);
          }}
        />
        <FiveTwentyNineResults
          result={result}
          copied={copied}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result, currencyNote)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        />
      </div>
    </section>
  );
}
