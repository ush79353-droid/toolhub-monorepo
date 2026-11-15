'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { PvifaForm } from './PvifaForm';
import {
  createDefaultInput,
  type PvifaFieldErrors,
  type PvifaInput,
  type PvifaResult,
} from './types';
import { validatePvifaInput } from './validation';

export function PvifaCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<PvifaInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<PvifaFieldErrors>({});
  const [result, setResult] = React.useState<PvifaResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleChange = (next: PvifaInput) => {
    setInput(next);
    const validation = validatePvifaInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Interest rate per period (r): ${input.interestRatePercent}%`,
        `Number of periods (n): ${input.periods}`,
        `PVIFA: ${result.formattedPvifa}`,
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
            PVIFA = [1 − (1 + r)^(−n)] ÷ r (PVIFA = n when r = 0).
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PvifaForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
        />

        <details className="rounded-xl border border-border bg-muted/15">
          <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
            Additional settings
          </summary>
          <div className="flex flex-wrap gap-2 border-t border-border px-3.5 py-3 sm:px-4">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                if (await copyTextToClipboard(summary)) {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }
              }}
            >
              {copied ? 'Copied' : 'Copy results'}
            </Button>
            {canShare ? (
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs font-medium"
                disabled={!summary}
                onClick={async () => {
                  if (!summary) return;
                  try {
                    await navigator.share({ title: metadata.title, text: summary });
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  } catch {
                    // dismissed
                  }
                }}
              >
                {shared ? 'Shared' : 'Share'}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </details>
      </div>
    </section>
  );
}
