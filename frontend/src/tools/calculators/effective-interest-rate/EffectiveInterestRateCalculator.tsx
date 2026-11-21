'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { EffectiveInterestRateForm } from './EffectiveInterestRateForm';
import { EffectiveInterestRateResults } from './EffectiveInterestRateResults';
import { describeResult } from './calculation';
import {
  createDefaultInput,
  type EffectiveInterestRateFieldErrors,
  type EffectiveInterestRateInput,
  type EffectiveInterestRateResult,
} from './types';
import { validateEffectiveInterestRateInput } from './validation';

export function EffectiveInterestRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<EffectiveInterestRateInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<EffectiveInterestRateFieldErrors>(() =>
    validateEffectiveInterestRateInput(createDefaultInput()).errors,
  );
  const [result, setResult] = React.useState<EffectiveInterestRateResult | null>(() =>
    validateEffectiveInterestRateInput(createDefaultInput()).result,
  );
  const [balancesOpen, setBalancesOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: EffectiveInterestRateInput) => {
    const validation = validateEffectiveInterestRateInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBalancesOpen(false);
    setCopied(false);
    setShared(false);
    run(fresh);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Annual interest rate: ${input.annualInterestRate}%`,
        `Compounding frequency: ${input.compounding}`,
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
            Convert a nominal annual rate into periodic and effective interest rates.
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <EffectiveInterestRateForm
          input={input}
          errors={errors}
          result={result}
          balancesOpen={balancesOpen}
          onBalancesOpen={setBalancesOpen}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <EffectiveInterestRateResults />
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
