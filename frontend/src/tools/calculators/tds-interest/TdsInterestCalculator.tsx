'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { TdsInterestForm } from './TdsInterestForm';
import {
  createDefaultInput,
  type TdsInterestFieldErrors,
  type TdsInterestInput,
  type TdsInterestResult,
} from './types';
import { validateTdsInterestInput } from './validation';

function inputsEqual(a: TdsInterestInput, b: TdsInterestInput): boolean {
  return (
    a.mode === b.mode &&
    a.taxAmount === b.taxAmount &&
    a.transactionDate === b.transactionDate &&
    a.deductionDate === b.deductionDate &&
    a.paymentDate === b.paymentDate &&
    a.quarter === b.quarter &&
    a.filingYear === b.filingYear &&
    a.filingDate === b.filingDate
  );
}

export function TdsInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateTdsInterestInput(defaults);
  const [input, setInput] = React.useState<TdsInterestInput>(() => defaults);
  const [errors, setErrors] = React.useState<TdsInterestFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<TdsInterestResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: TdsInterestInput) => {
    setInput(next);
    const validation = validateTdsInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateTdsInterestInput(fresh);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const dirty = !inputsEqual(input, defaults);

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Mode: ${input.mode}`,
        `Tax amount: ₹${input.taxAmount}`,
        result.message,
        'Fixed INR. India TDS estimate only — confirm due dates and any CBDT extensions before filing.',
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
            India TDS — Sections 201(1A) and 234E · amounts in ₹ (INR)
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TdsInterestForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
          dirty={dirty}
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
            {copied ? 'Copied' : 'Share result'}
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
