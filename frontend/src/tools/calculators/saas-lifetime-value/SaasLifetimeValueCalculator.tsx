'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import {
  draftToInput,
  emptyDraft,
  SaasLifetimeValueForm,
  type SaasLifetimeValueDraft,
} from './SaasLifetimeValueForm';
import { SaasLifetimeValueResults } from './SaasLifetimeValueResults';
import { calculateSaasLifetimeValue } from './calculation';
import type { SaasLifetimeValueFieldErrors, SaasLifetimeValueResult } from './types';
import { validateSaasLifetimeValue } from './validation';

function summaryText(metadataTitle: string, result: SaasLifetimeValueResult): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  return [
    `${metadataTitle} — Omega Calculators`,
    `Currency: ${result.currency}`,
    `ARPA: ${money(result.arpa)}${result.derivedFromRevenue ? ' (derived)' : ''}`,
    `Gross margin: ${result.grossMarginPercent}%`,
    `Churn: ${result.churnPercent}%`,
    `Account expansion: ${money(result.accountExpansion)}`,
    `Customer LTV: ${
      result.customerLifetimeValue === null
        ? 'No finite estimate'
        : money(result.customerLifetimeValue)
    }`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function SaasLifetimeValueCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SaasLifetimeValueDraft>(() => emptyDraft());
  const [errors, setErrors] = React.useState<SaasLifetimeValueFieldErrors>({});
  const [result, setResult] = React.useState<SaasLifetimeValueResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: SaasLifetimeValueDraft, reportBlanks = false) => {
    const parsed = draftToInput(next);
    const validation = validateSaasLifetimeValue(parsed, { reportBlanks });
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? calculateSaasLifetimeValue(parsed) : null);
  }, []);

  const resetAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? summaryText(metadata.title, result) : '';
  const hasFieldErrors = Object.keys(errors).length > 0;

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
          <p className="text-xs font-normal text-muted-foreground">
            LTV = ((ARPA + expansion) × margin) ÷ churn
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SaasLifetimeValueForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={(next) => evaluate(next)}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft, true);
          }}
          onReset={resetAll}
        />
        <SaasLifetimeValueResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result || result.customerLifetimeValue === null) return;
            void copyTextToClipboard(summaryText(metadata.title, result)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || result.customerLifetimeValue === null || typeof navigator.share !== 'function') {
              return;
            }
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`,
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
