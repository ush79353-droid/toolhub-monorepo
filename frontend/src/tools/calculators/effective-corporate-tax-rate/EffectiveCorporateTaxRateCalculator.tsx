'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { EffectiveCorporateTaxRateForm } from './EffectiveCorporateTaxRateForm';
import { EffectiveCorporateTaxRateResults } from './EffectiveCorporateTaxRateResults';
import { buildEffectiveCorporateTaxRateResult, describeResult } from './calculation';
import {
  createDefaultInput,
  type EffectiveCorporateTaxRateFieldErrors,
  type EffectiveCorporateTaxRateInput,
  type EffectiveCorporateTaxRateResult,
} from './types';
import { validateEffectiveCorporateTaxRateInput } from './validation';

export function EffectiveCorporateTaxRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<EffectiveCorporateTaxRateInput>(() =>
    createDefaultInput()
  );
  const [errors, setErrors] = React.useState<EffectiveCorporateTaxRateFieldErrors>({});
  const [result, setResult] = React.useState<EffectiveCorporateTaxRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: EffectiveCorporateTaxRateInput) => {
    const validation = validateEffectiveCorporateTaxRateInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        buildEffectiveCorporateTaxRateResult(
          validation.parsed.earningsBeforeTax,
          validation.parsed.incomeTaxPaid,
          validation.parsed.currency
        )
      );
    } else {
      setResult(null);
    }
  };

  const summary = result
    ? [`${metadata.title} — Omega Calculators`, describeResult(result), CURRENCY_DENOMINATION_NOTE].join(
        '\n'
      )
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
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <EffectiveCorporateTaxRateForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={() => {
            const fresh = createDefaultInput();
            setInput(fresh);
            setErrors({});
            setResult(null);
          }}
        />
        <div className="flex flex-wrap gap-2">
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
                  // User dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <EffectiveCorporateTaxRateResults />
      </div>
    </section>
  );
}
