'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { Button } from '@/components/ui/button';
import { SafetyStockForm } from './SafetyStockForm';
import { SafetyStockResults } from './SafetyStockResults';
import { calculateSafetyStock, describeResult } from './calculation';
import {
  createDefaultInput,
  type SafetyStockFieldErrors,
  type SafetyStockInput,
  type SafetyStockResult,
} from './types';
import { validateSafetyStockInput } from './validation';

export function SafetyStockCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<SafetyStockInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<SafetyStockFieldErrors>({});
  const [result, setResult] = React.useState<SafetyStockResult | null>(null);
  const [statisticalOpen, setStatisticalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: SafetyStockInput) => {
    const validation = validateSafetyStockInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        calculateSafetyStock(
          validation.parsed.maxDailyUsage,
          validation.parsed.maxLeadTime,
          validation.parsed.averageDailyUsage,
          validation.parsed.averageLeadTime
        )
      );
    } else {
      setResult(null);
    }
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Max daily usage: ${result.maxDailyUsage} units`,
        `Max lead time: ${result.maxLeadTime} days`,
        `Average daily usage: ${result.averageDailyUsage} units`,
        `Average lead time: ${result.averageLeadTime} days`,
        describeResult(result),
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
            Basic max–min safety stock and reorder point (lead times in days)
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SafetyStockForm
          input={input}
          errors={errors}
          result={result}
          statisticalOpen={statisticalOpen}
          onStatisticalOpenChange={setStatisticalOpen}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={() => {
            const fresh = createDefaultInput();
            setInput(fresh);
            setErrors({});
            setResult(null);
            setStatisticalOpen(false);
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
        <SafetyStockResults />
      </div>
    </section>
  );
}
