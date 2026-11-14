'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { HighLowMethodForm } from './HighLowMethodForm';
import { HighLowMethodResults } from './HighLowMethodResults';
import {
  createDefaultInput,
  type HighLowMethodFieldErrors,
  type HighLowMethodInput,
  type HighLowMethodResult,
} from './types';
import { validateHighLowMethod } from './validation';

function summaryText(metadataTitle: string, result: HighLowMethodResult): string {
  return [
    `${metadataTitle} — Omega Calculators`,
    `High cost: ${result.highCost} at ${result.highVolume} units`,
    `Low cost: ${result.lowCost} at ${result.lowVolume} units`,
    `Units (x): ${result.unitsX}`,
    `Variable cost per unit: ${result.shareVariable}`,
    `Total fixed cost: ${result.shareFixed}`,
    `Total cost: ${result.shareTotal}`,
    CURRENCY_DENOMINATION_NOTE,
  ].join('\n');
}

export function HighLowMethodCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<HighLowMethodInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<HighLowMethodFieldErrors>({});
  const [result, setResult] = React.useState<HighLowMethodResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: HighLowMethodInput) => {
    const validation = validateHighLowMethod(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.isValid ? validation.result : null);
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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HighLowMethodForm
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
        <HighLowMethodResults
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
