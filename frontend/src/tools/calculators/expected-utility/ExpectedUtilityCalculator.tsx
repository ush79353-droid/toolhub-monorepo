'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { ExpectedUtilityForm } from './ExpectedUtilityForm';
import { ExpectedUtilityResults } from './ExpectedUtilityResults';
import { describeResult } from './calculation';
import {
  createDefaultInput,
  type ExpectedUtilityFieldErrors,
  type ExpectedUtilityInput,
  type ExpectedUtilityResult,
} from './types';
import { validateExpectedUtilityInput } from './validation';

export function ExpectedUtilityCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ExpectedUtilityInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ExpectedUtilityFieldErrors>({});
  const [result, setResult] = React.useState<ExpectedUtilityResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ExpectedUtilityInput) => {
    const validation = validateExpectedUtilityInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Event 1: ${input.probability1}% · ${input.value1} ${input.currency}`,
        `Event 2: ${input.probability2}% · ${input.value2} ${input.currency}`,
        describeResult(result),
        'Assumption: risk-neutral linear utility U(x) = x.',
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
          <p className="text-xs font-normal text-muted-foreground">
            Two-event expected utility with U(x) = x. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ExpectedUtilityForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <ExpectedUtilityResults />
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
