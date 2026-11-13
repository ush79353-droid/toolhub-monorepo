'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
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

function summaryText(result: FiveTwentyNineResult): string {
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
    'Changing the currency symbol does not convert amounts and does not change US 529 tax treatment.',
    MONTHLY_RATE_NOTE,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function FiveTwentyNineCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FiveTwentyNineDraft>(() => inputToDraft(DEFAULT_FIVE_TWENTY_NINE_INPUT));
  const [errors, setErrors] = React.useState<FiveTwentyNineFieldErrors>({});
  const [result, setResult] = React.useState<FiveTwentyNineResult | null>(() =>
    calculateFiveTwentyNine(DEFAULT_FIVE_TWENTY_NINE_INPUT)
  );
  const [copied, setCopied] = React.useState(false);

  const evaluate = React.useCallback((next: FiveTwentyNineDraft) => {
    const parsed = draftToInput(next);
    const validation = validateFiveTwentyNineInput(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateFiveTwentyNine(parsed) : null);
  }, []);

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
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                evaluate(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          A 529 plan is a US education savings arrangement. USD is the default symbol. Choosing another currency changes
          the symbol only. It does not convert exchange rates and it does not change the plan&apos;s US tax treatment.
        </p>
        <FiveTwentyNineForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => {
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
            evaluate(next);
          }}
        />
        <FiveTwentyNineResults
          result={result}
          copied={copied}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(result)).then((ok) => {
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
