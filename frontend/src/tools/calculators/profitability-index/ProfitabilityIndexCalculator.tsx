'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { ProfitabilityIndexForm } from './ProfitabilityIndexForm';
import { ProfitabilityIndexResults } from './ProfitabilityIndexResults';
import {
  createDefaultInput,
  type ProfitabilityIndexFieldErrors,
  type ProfitabilityIndexInput,
  type ProfitabilityIndexResult,
} from './types';
import { validateProfitabilityIndex } from './validation';

function buildShareText(metadataTitle: string, result: ProfitabilityIndexResult): string {
  return [
    `${metadataTitle} — Omega Calculators`,
    `Initial investment: ${formatCurrencyValue(result.initialInvestment, result.currency)}`,
    `PV of future cash flow: ${formatCurrencyValue(result.pvFutureCashFlow, result.currency)}`,
    `Profitability index (PI): ${result.piDisplay}`,
    result.interpretation,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function ProfitabilityIndexCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ProfitabilityIndexInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ProfitabilityIndexFieldErrors>({});
  const [result, setResult] = React.useState<ProfitabilityIndexResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ProfitabilityIndexInput) => {
    const validation = validateProfitabilityIndex(next);
    setInput(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setIncomplete(true);
    setCopied(false);
    setShared(false);
  };

  const sharePayload = result ? buildShareText(metadata.title, result) : '';
  const hasBlockingErrors = Object.keys(errors).length > 0;

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
            PI = PV of future cash flow ÷ initial investment. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ProfitabilityIndexForm
          input={input}
          errors={errors}
          result={result}
          onChange={run}
          onReset={handleReset}
        />
        <ProfitabilityIndexResults
          hasResult={Boolean(result)}
          incomplete={incomplete}
          invalid={hasBlockingErrors && !incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(buildShareText(metadata.title, result)).then((ok) => {
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
