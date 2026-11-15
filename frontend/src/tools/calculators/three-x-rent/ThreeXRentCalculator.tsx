'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { calculateThreeXRent } from './calculation';
import { ThreeXRentForm, draftToInput, inputToDraft, type ThreeXRentDraft } from './ThreeXRentForm';
import { ThreeXRentResults } from './ThreeXRentResults';
import {
  DEFAULT_THREE_X_RENT_INPUT,
  type ThreeXRentFieldErrors,
  type ThreeXRentResult,
} from './types';
import { validateThreeXRent } from './validation';

function formatMultiple(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

function summaryText(result: ThreeXRentResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const lines = ['3x Rent Calculator — Omega Calculators'];
  if (result.mode === 'required-income' && result.requiredMonthlyIncome !== null && result.requiredAnnualIncome !== null) {
    lines.push(`Required gross monthly income: ${money(result.requiredMonthlyIncome)}`);
    lines.push(`Required gross annual income: ${money(result.requiredAnnualIncome)}`);
    if (result.monthlyRent !== null) lines.push(`Monthly rent: ${money(result.monthlyRent)}`);
  } else if (result.maximumMonthlyRent !== null && result.maximumAnnualRent !== null && result.grossMonthlyIncome !== null) {
    lines.push(`Maximum monthly rent: ${money(result.maximumMonthlyRent)}`);
    lines.push(`Maximum annual rent: ${money(result.maximumAnnualRent)}`);
    lines.push(`Gross monthly income before taxes: ${money(result.grossMonthlyIncome)}`);
  }
  lines.push(`Rent-to-income: ${formatMultiple(result.rentToIncomePercent)}%`);
  lines.push(`Multiplier: ${formatMultiple(result.multiplier)}×`);
  for (const line of result.tenantLines) {
    lines.push(`${line.label}: ${money(line.monthly)} / month, ${money(line.annual)} / year (${formatMultiple(line.sharePercent)}%)`);
  }
  lines.push('The 3× figure is a common screening guideline, not a legal requirement.');
  if (result.split === 'equal') {
    lines.push('Equal tenant shares are an assumption. Landlords may assess combined household income.');
  }
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function ThreeXRentCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<ThreeXRentDraft>(() => inputToDraft(DEFAULT_THREE_X_RENT_INPUT));
  const [errors, setErrors] = React.useState<ThreeXRentFieldErrors>({});
  const [result, setResult] = React.useState<ThreeXRentResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: ThreeXRentDraft) => {
    const parsed = draftToInput(next);
    const validation = validateThreeXRent(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateThreeXRent(parsed) : null);
  }, []);

  const sharePayload = result ? summaryText(result) : '';

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
          <p className="text-xs font-normal text-muted-foreground">Gross income before taxes</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="three-x-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="three-x-currency"
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
        <ThreeXRentForm
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
            const fresh = inputToDraft(DEFAULT_THREE_X_RENT_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <ThreeXRentResults
          result={result}
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
