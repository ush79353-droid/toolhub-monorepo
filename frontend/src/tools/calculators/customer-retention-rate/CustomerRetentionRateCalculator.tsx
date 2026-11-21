'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CustomerRetentionRateForm } from './CustomerRetentionRateForm';
import { CustomerRetentionRateResults } from './CustomerRetentionRateResults';
import type {
  CustomerRetentionFieldErrors,
  CustomerRetentionResult,
} from './types';
import {
  emptyDraft,
  validateCustomerRetentionDraft,
  type CustomerRetentionDraft,
} from './validation';

function summaryText(metadataTitle: string, result: CustomerRetentionResult): string {
  return [
    `${metadataTitle} | Omega Calculators`,
    `Existing customers: ${result.existingCustomers}`,
    `New customers: ${result.newCustomers}`,
    `Total customers: ${result.totalCustomers}`,
    `Retained customers: ${result.retainedCustomers}`,
    `Attrition rate: ${result.attritionDisplay}%`,
    `Customer retention rate: ${result.retentionDisplay}%`,
  ].join('\n');
}

export function CustomerRetentionRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CustomerRetentionDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CustomerRetentionFieldErrors>({});
  const [result, setResult] = React.useState<CustomerRetentionResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CustomerRetentionDraft) => {
    const validation = validateCustomerRetentionDraft(next);
    setDraft(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? validation.result : null);
  };

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
            Retention % = (total − new) ÷ existing × 100; attrition = 100 − retention
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CustomerRetentionRateForm
          draft={draft}
          attritionDisplay={result?.attritionDisplay ?? ''}
          retentionDisplay={result?.retentionDisplay ?? ''}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <CustomerRetentionRateResults
          result={result}
          invalid={hasFieldErrors}
          incomplete={incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(summaryText(metadata.title, result)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
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
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
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
