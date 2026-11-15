'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { SharpeRatioForm } from './SharpeRatioForm';
import {
  createDefaultInput,
  type SharpeRatioFieldErrors,
  type SharpeRatioInput,
  type SharpeRatioResult,
} from './types';
import { validateSharpeRatioInput } from './validation';

export function SharpeRatioCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<SharpeRatioInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<SharpeRatioFieldErrors>({});
  const [result, setResult] = React.useState<SharpeRatioResult | null>(null);
  const [riskPremiumDisplay, setRiskPremiumDisplay] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SharpeRatioInput) => {
    setInput(next);
    const validation = validateSharpeRatioInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setRiskPremiumDisplay(
      validation.result?.formattedRiskPremium ??
        validation.partialRiskPremium?.formatted ??
        ''
    );
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setRiskPremiumDisplay('');
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Return: ${input.investmentReturn}%`,
        `Risk-free return: ${input.riskFreeReturn}%`,
        `Risk premium: ${result.formattedRiskPremium}%`,
        `Standard deviation: ${input.standardDeviation}%`,
        `Sharpe ratio: ${result.formattedSharpeRatio}`,
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
            Sharpe = (return − risk-free) ÷ standard deviation
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <SharpeRatioForm
          input={input}
          errors={errors}
          result={result}
          riskPremiumDisplay={riskPremiumDisplay}
          onChange={apply}
          onReset={handleReset}
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
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
