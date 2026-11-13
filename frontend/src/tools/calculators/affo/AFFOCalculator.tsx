'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { AFFOForm, draftToInput, inputToDraft, type AffoDraft } from './AFFOForm';
import { AFFOResults } from './AFFOResults';
import { calculateAffo } from './calculation';
import { DEFAULT_AFFO_INPUT, type AffoFieldErrors, type AffoResult } from './types';
import { validateAffo } from './validation';

function summaryText(result: AffoResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const lines = [
    'AFFO Calculator — Omega Calculators',
    `Period: ${result.periodLabel}`,
    `Currency: ${result.currency}`,
    `Net income: ${money(result.netIncome)}`,
    `Simplified FFO: ${money(result.ffo)}`,
    `Simplified AFFO: ${money(result.affo)}`,
    `AFFO − FFO: ${money(result.affoAdjustment)}`,
    `FFO additions: ${money(result.ffoAdditions)}`,
    `FFO deductions: ${money(result.ffoDeductions)}`,
    `AFFO additions: ${money(result.affoAdditions)}`,
    `AFFO deductions: ${money(result.affoDeductions)}`,
    `Interest income (not adjusted): ${money(result.interestIncome)}`,
  ];
  if (result.ffoPerShare !== null) lines.push(`FFO per share: ${money(result.ffoPerShare)}`);
  if (result.affoPerShare !== null) lines.push(`AFFO per share: ${money(result.affoPerShare)}`);
  if (result.payoutRatio !== null) {
    lines.push(`AFFO payout ratio: ${(result.payoutRatio * 100).toFixed(2)}%`);
  }
  lines.push('Simplified estimate. Not Nareit FFO and not audited AFFO. AFFO − FFO is not distributable cash.');
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function AFFOCalculator({ metadata, className = '', presentation = 'default', headerActions }: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AffoDraft>(() => inputToDraft(DEFAULT_AFFO_INPUT));
  const [errors, setErrors] = React.useState<AffoFieldErrors>({});
  const [result, setResult] = React.useState<AffoResult | null>(() => calculateAffo(DEFAULT_AFFO_INPUT));
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AffoDraft) => {
    const parsed = draftToInput(next);
    const validation = validateAffo(parsed);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAffo(parsed) : null);
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
          <p className="text-xs font-normal text-muted-foreground">Simplified FFO and AFFO</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="affo-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="affo-currency"
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
        <AFFOForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={(next) => {
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_AFFO_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(calculateAffo(DEFAULT_AFFO_INPUT));
            setCopied(false);
            setShared(false);
          }}
        />
        <AFFOResults
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
