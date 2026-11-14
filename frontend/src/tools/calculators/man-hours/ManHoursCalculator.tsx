'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { ManHoursForm } from './ManHoursForm';
import { ManHoursResults } from './ManHoursResults';
import {
  createDefaultInput,
  type ManHoursFieldErrors,
  type ManHoursInput,
  type ManHoursResult,
} from './types';
import { validateManHoursInput } from './validation';

function buildShareText(metadataTitle: string, result: ManHoursResult): string {
  return [
    `${metadataTitle} — Omega Calculators`,
    `People: ${result.people}`,
    `Hours per person: ${result.hoursPerPerson}`,
    `Man-hours: ${result.shareManHours}`,
    `Hourly pay: ${formatCurrencyValue(result.hourlyPay, result.currency)}`,
    `Cost per person: ${result.shareCostPerPerson}`,
    `Total cost: ${result.shareTotalCost}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function ManHoursCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ManHoursInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ManHoursFieldErrors>({});
  const [result, setResult] = React.useState<ManHoursResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ManHoursInput) => {
    const validation = validateManHoursInput(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
  };

  const resetAll = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ManHoursForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={resetAll}
        />
        <ManHoursResults
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
