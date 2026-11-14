'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import {
  AdditionalFundsNeededForm,
  draftToInput,
  inputToDraft,
  type AfnDraft,
} from './AdditionalFundsNeededForm';
import { AdditionalFundsNeededResults } from './AdditionalFundsNeededResults';
import { afnInterpretation, calculateAfn } from './calculation';
import { DEFAULT_AFN_INPUT, type AfnFieldErrors, type AfnResult } from './types';
import { validateAfn } from './validation';

function summaryText(result: AfnResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const kind = afnInterpretation(result.additionalFundsNeeded);
  const meaning =
    kind === 'needed'
      ? 'External financing indicated'
      : kind === 'surplus'
        ? 'Financing surplus (negative AFN)'
        : 'No additional external financing indicated';
  return [
    'Additional Funds Needed Calculator — Omega Calculators',
    `Currency: ${result.currency}`,
    `Change in assets: ${money(result.changeInAssets)}`,
    `Change in liabilities: ${money(result.changeInLiabilities)}`,
    `Change in retained earnings: ${money(result.changeInRetainedEarnings)}`,
    `Additional funds needed: ${money(result.additionalFundsNeeded)}`,
    `Interpretation: ${meaning}`,
    'AFN = ΔA − ΔL − ΔRE. Simplified estimate, not a cash-flow forecast.',
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function AdditionalFundsNeededCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AfnDraft>(() => inputToDraft(DEFAULT_AFN_INPUT));
  const [errors, setErrors] = React.useState<AfnFieldErrors>({});
  const [result, setResult] = React.useState<AfnResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AfnDraft, reportBlanks = false) => {
    const parsed = draftToInput(next);
    const validation = validateAfn(parsed, { reportBlanks });
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAfn(parsed) : null);
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
          <p className="text-xs font-normal text-muted-foreground">AFN = ΔA − ΔL − ΔRE</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AdditionalFundsNeededForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={(next) => {
            setDraft(next);
            evaluate(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft, true);
          }}
          onReset={() => {
            const fresh = inputToDraft(DEFAULT_AFN_INPUT);
            setDraft(fresh);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <AdditionalFundsNeededResults
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
                // User dismissed the share sheet.
              });
          }}
        />
      </div>
    </section>
  );
}
