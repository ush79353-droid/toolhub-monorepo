'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { FullTimeEquivalentForm } from './FullTimeEquivalentForm';
import { FullTimeEquivalentResults } from './FullTimeEquivalentResults';
import { calculateFullTimeEquivalent } from './calculation';
import {
  createDefaultInput,
  type FullTimeEquivalentFieldErrors,
  type FullTimeEquivalentInput,
  type FullTimeEquivalentResult,
} from './types';
import { validateFullTimeEquivalentInput } from './validation';

export function FullTimeEquivalentCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<FullTimeEquivalentInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<FullTimeEquivalentFieldErrors>({});
  const [result, setResult] = React.useState<FullTimeEquivalentResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: FullTimeEquivalentInput) => {
    const validation = validateFullTimeEquivalentInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        calculateFullTimeEquivalent(
          validation.parsed.fullTimeEmployees,
          validation.parsed.fullTimeHours,
          validation.parsed.partTimeEmployees,
          validation.parsed.partTimeHours
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
        `Full-time: ${result.fullTimeEmployees} people @ ${result.fullTimeHours} hrs/week`,
        `Part-time: ${result.partTimeEmployees} people @ ${result.partTimeHours} hrs/week`,
        `FTE: ${result.formattedFte}`,
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
          <p className="text-xs font-normal text-muted-foreground">
            FTE = full-time employees + (part-time employees × part-time hours ÷ full-time hours)
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <FullTimeEquivalentForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <FullTimeEquivalentResults
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
