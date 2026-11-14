'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { CustomerAcquisitionCostForm } from './CustomerAcquisitionCostForm';
import { CustomerAcquisitionCostResults } from './CustomerAcquisitionCostResults';
import { calculateCustomerAcquisitionCost } from './calculation';
import {
  createDefaultInput,
  type CustomerAcquisitionCostFieldErrors,
  type CustomerAcquisitionCostInput,
  type CustomerAcquisitionCostResult,
} from './types';
import { validateCustomerAcquisitionCostInput } from './validation';

export function CustomerAcquisitionCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<CustomerAcquisitionCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<CustomerAcquisitionCostFieldErrors>({});
  const [result, setResult] = React.useState<CustomerAcquisitionCostResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: CustomerAcquisitionCostInput) => {
    const validation = validateCustomerAcquisitionCostInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        calculateCustomerAcquisitionCost(
          validation.parsed.costOfMarketing,
          validation.parsed.costOfSales,
          validation.parsed.newCustomers,
          validation.parsed.currency
        )
      );
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const shareText = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Cost of marketing: ${result.costOfMarketing}`,
        `Cost of sales: ${result.costOfSales}`,
        `New customers: ${result.newCustomers}`,
        `CAC: ${result.shareCac} per customer`,
        CURRENCY_DENOMINATION_NOTE,
      ].join('\n')
    : '';

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
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CustomerAcquisitionCostForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <CustomerAcquisitionCostResults
          hasResult={Boolean(result)}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!shareText) return;
            void copyTextToClipboard(shareText).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!shareText || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: shareText,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${shareText}\n${typeof window !== 'undefined' ? window.location.href : ''}`
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
