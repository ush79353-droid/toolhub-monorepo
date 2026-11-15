'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateDecimalOctal } from './calculation';
import {
  DecimalToOctalForm,
  defaultDraft,
  emptyDraft,
  type DecimalToOctalDraft,
} from './DecimalToOctalForm';
import { DecimalToOctalResults } from './DecimalToOctalResults';
import type { DecimalOctalFieldErrors, DecimalOctalResult } from './types';
import { parseDecimalOctalInput } from './validation';

function summaryText(result: DecimalOctalResult): string {
  const isDecimalMode = result.direction === 'decimal-to-octal';
  const lines = [
    'Decimal to Octal Converter',
    'Omega Calculators',
    '',
    isDecimalMode
      ? `Decimal: ${result.inputNormalized}`
      : `Octal: ${result.inputNormalized}`,
    isDecimalMode ? `Octal: ${result.output}` : `Decimal: ${result.output}`,
    '',
    result.formula,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function DecimalToOctalConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DecimalToOctalDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<DecimalOctalFieldErrors>({});
  const [result, setResult] = React.useState<DecimalOctalResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: DecimalToOctalDraft) => {
    const parsed = parseDecimalOctalInput(next.input, next.direction);
    if (parsed.blank) {
      setDraft(next);
      setErrors({});
      setResult(null);
      return;
    }
    if (parsed.error || parsed.value === null) {
      setDraft(next);
      setErrors({ input: parsed.error ?? 'Invalid input.' });
      setResult(null);
      return;
    }
    try {
      const nextResult = calculateDecimalOctal(parsed.value, next.direction);
      setDraft(next);
      setErrors({});
      setResult(nextResult);
    } catch (err) {
      setDraft(next);
      setErrors({
        input: err instanceof Error ? err.message : 'Unable to convert this value.',
      });
      setResult(null);
    }
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, DecimalToOctalDraft> = {
        1: { direction: 'decimal-to-octal', input: '125', stepsOpen: true },
        2: { direction: 'decimal-to-octal', input: '255', stepsOpen: true },
        3: { direction: 'octal-to-decimal', input: '175', stepsOpen: true },
        4: { direction: 'decimal-to-octal', input: '2026', stepsOpen: true },
        5: { direction: 'octal-to-decimal', input: '1000', stepsOpen: true },
      };
      evaluate(examples[id]);
    },
    [evaluate]
  );

  const clearAll = () => {
    setDraft(emptyDraft());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

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
            Decimal ↔ octal · BigInt precision
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DecimalToOctalForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={clearAll}
          onReset={clearAll}
          onApplyExample={applyExample}
        >
          <DecimalToOctalResults
            result={result}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(result)}
            onCopy={() => {
              if (!result) return;
              void copyTextToClipboard(summaryText(result)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result || typeof navigator.share !== 'function') return;
              const payload = summaryText(result);
              void navigator
                .share({
                  title: metadata.title,
                  text: payload,
                  url: typeof window !== 'undefined' ? window.location.href : undefined,
                })
                .then(() => {
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                })
                .catch(() => {
                  void copyTextToClipboard(
                    `${payload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                  ).then((ok) => {
                    if (!ok) return;
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  });
                });
            }}
          />
        </DecimalToOctalForm>
      </div>
    </section>
  );
}
