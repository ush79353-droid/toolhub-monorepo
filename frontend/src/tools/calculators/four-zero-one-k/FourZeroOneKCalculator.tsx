'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { calculateFourZeroOneK } from './calculation';
import {
  DEFAULT_FOUR_ZERO_ONE_K_DRAFT,
  draftToInput,
  FourZeroOneKForm,
  type FourZeroOneKDraft,
} from './FourZeroOneKForm';
import { FourZeroOneKResults } from './FourZeroOneKResults';
import type { FourZeroOneKFieldErrors, FourZeroOneKResult } from './types';
import { validateFourZeroOneK } from './validation';

function formatPercent(decimal: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(decimal * 100)}%`;
}

function summaryText(result: FourZeroOneKResult, currency: FourZeroOneKDraft['currency']): string {
  const money = (value: number) => formatCurrencyValue(value, currency);
  const lines = [
    '401(k) Calculator — Omega Calculators',
    `Projected balance: ${money(result.finalBalance)}`,
    `Inflation-adjusted balance: ${money(result.inflationAdjustedBalance)}`,
    `Employee contributions: ${money(result.employeeContributions)}`,
    `Employer contributions: ${money(result.employerContributions)}`,
    `Vested employer contributions: ${money(result.vestedEmployerContributions)}`,
    `Investment growth: ${money(result.investmentGrowth)}`,
    `Fees: ${money(result.fees)}`,
    `Years until retirement: ${result.years}`,
  ];
  if (result.solvedEmployeePercent !== null) {
    lines.push(`Employee contribution needed: ${formatPercent(result.solvedEmployeePercent)}`);
  }
  if (result.solvedEmployeeFixedAnnual !== null) {
    lines.push(`Employee contribution needed: ${money(result.solvedEmployeeFixedAnnual)} per year`);
  }
  if (result.estimatedAnnualWithdrawal !== null) {
    lines.push(`Illustrative withdrawal: ${money(result.estimatedAnnualWithdrawal)} per year`);
  }
  if (result.impossible) lines.push('The target is out of reach under these limits.');
  lines.push('Projection from these assumptions, not a guaranteed return.');
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function FourZeroOneKCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FourZeroOneKDraft>(DEFAULT_FOUR_ZERO_ONE_K_DRAFT);
  const [errors, setErrors] = React.useState<FourZeroOneKFieldErrors>({});
  const [result, setResult] = React.useState<FourZeroOneKResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: FourZeroOneKDraft) => {
    const parsed = draftToInput(next);
    const validation = validateFourZeroOneK(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateFourZeroOneK(parsed) : null);
  }, []);

  React.useEffect(() => {
    evaluate(DEFAULT_FOUR_ZERO_ONE_K_DRAFT);
  }, [evaluate]);

  const sharePayload = result ? summaryText(result, draft.currency) : '';

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
            <label htmlFor="fok-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="fok-currency"
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
        <p className="text-xs font-normal leading-relaxed text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        <FourZeroOneKForm
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
            setDraft(DEFAULT_FOUR_ZERO_ONE_K_DRAFT);
            setCopied(false);
            setShared(false);
            evaluate(DEFAULT_FOUR_ZERO_ONE_K_DRAFT);
          }}
        />
        <FourZeroOneKResults
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
