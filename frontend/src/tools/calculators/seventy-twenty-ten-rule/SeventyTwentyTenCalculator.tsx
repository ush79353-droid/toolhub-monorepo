'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { calculateSeventyTwentyTen, describeResult } from './calculation';
import { SeventyTwentyTenForm } from './SeventyTwentyTenForm';
import { SeventyTwentyTenResults } from './SeventyTwentyTenResults';
import {
  createDefaultSeventyTwentyTenInput,
  periodNoun,
  type SeventyTwentyTenFieldErrors,
  type SeventyTwentyTenInput,
  type SeventyTwentyTenResult,
} from './types';
import { validateSeventyTwentyTen } from './validation';

function summaryText(metadataTitle: string, result: SeventyTwentyTenResult): string {
  if (!result.defined) return '';
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const period = periodNoun(result.frequency);
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `After-tax income /${period}: ${money(result.income)}`,
    ...result.categories.map(
      (category) =>
        `${category.label} (${category.percent}%): ${money(category.budget)}; actual ${money(category.spending)}; ${category.status}`
    ),
    `Total actual: ${money(result.totalSpending)}`,
    result.overspending > 0
      ? `Overspending: ${money(result.overspending)}`
      : `Unallocated: ${money(result.unallocated)}`,
    `Monthly income: ${money(result.monthlyIncome)}`,
    `Annual income: ${money(result.annualIncome)}`,
    describeResult(result),
    CURRENCY_DENOMINATION_NOTE,
  ];
  return lines.join('\n');
}

export function SeventyTwentyTenCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<SeventyTwentyTenInput>(() => createDefaultSeventyTwentyTenInput());
  const [errors, setErrors] = React.useState<SeventyTwentyTenFieldErrors>({});
  const [result, setResult] = React.useState<SeventyTwentyTenResult | null>(() =>
    calculateSeventyTwentyTen(createDefaultSeventyTwentyTenInput())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: SeventyTwentyTenInput) => {
    const validation = validateSeventyTwentyTen(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateSeventyTwentyTen(next) : null);
  };

  const summary = result ? summaryText(metadata.title, result) : '';

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="budget-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="budget-currency"
              value={input.currency}
              onChange={(currency) => {
                const next = { ...input, currency };
                setInput(next);
                run(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SeventyTwentyTenForm
          input={input}
          errors={errors}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultSeventyTwentyTenInput();
            setInput(fresh);
            setErrors({});
            setResult(calculateSeventyTwentyTen(fresh));
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // The user dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <SeventyTwentyTenResults result={result} />
      </div>
    </section>
  );
}
