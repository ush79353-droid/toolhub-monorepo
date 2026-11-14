'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { ExpectedReturnForm } from './ExpectedReturnForm';
import {
  createDefaultInput,
  type ExpectedReturnFieldErrors,
  type ExpectedReturnInput,
  type ExpectedReturnResult,
} from './types';
import { ensureTrailingScenario, validateExpectedReturnInput } from './validation';

export function ExpectedReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ExpectedReturnInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ExpectedReturnFieldErrors>(() => {
    return validateExpectedReturnInput(createDefaultInput()).errors;
  });
  const [result, setResult] = React.useState<ExpectedReturnResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleChange = (next: ExpectedReturnInput) => {
    const withTrailing = ensureTrailingScenario(next);
    setInput(withTrailing);
    const validation = validateExpectedReturnInput(withTrailing);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors(validateExpectedReturnInput(fresh).errors);
    setResult(null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        ...input.scenarios
          .map((s, i) => {
            if (
              (s.probability.trim() === '' || s.probability.trim() === '0') &&
              s.stockA.trim() === '' &&
              s.stockB.trim() === ''
            ) {
              return null;
            }
            return `Scenario ${i + 1}: Prob ${s.probability}%, A ${s.stockA}%, B ${s.stockB}%`;
          })
          .filter(Boolean),
        `Expected return A: ${result.formattedExpectedReturnA}%`,
        `Expected return B: ${result.formattedExpectedReturnB}%`,
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
            Probability-weighted expected returns for two stocks
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ExpectedReturnForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
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
