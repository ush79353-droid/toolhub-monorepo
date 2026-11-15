'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateBinaryOctal } from './calculation';
import {
  BinaryToOctalForm,
  defaultDraft,
  emptyDraft,
  type BinaryToOctalDraft,
} from './BinaryToOctalForm';
import { BinaryToOctalResults } from './BinaryToOctalResults';
import type { BinaryOctalFieldErrors, BinaryOctalResult } from './types';
import { parseBinaryOctalInput } from './validation';

function summaryText(result: BinaryOctalResult): string {
  const isBinaryMode = result.direction === 'binary-to-octal';
  const lines = [
    'Binary to Octal Converter',
    'Omega Calculators',
    '',
    `Conversion: ${isBinaryMode ? 'Binary to Octal' : 'Octal to Binary'}`,
    `Input: ${result.inputNormalized}`,
    `Result: ${result.output}`,
    '',
    isBinaryMode
      ? `${result.inputNormalized}₂ = ${result.output}₈`
      : `${result.inputNormalized}₈ = ${result.output}₂`,
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function BinaryToOctalConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BinaryToOctalDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<BinaryOctalFieldErrors>({});
  const [result, setResult] = React.useState<BinaryOctalResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: BinaryToOctalDraft) => {
    const parsed = parseBinaryOctalInput(next.input, next.direction);
    setDraft(next);

    if (parsed.blank) {
      setErrors({});
      setResult(null);
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ input: parsed.error ?? 'Invalid input.' });
      setResult(null);
      return;
    }

    try {
      setErrors({});
      setResult(calculateBinaryOctal(parsed.value, next.direction));
    } catch (err) {
      setResult(null);
      setErrors({
        input: err instanceof Error ? err.message : 'Unable to convert this value.',
      });
    }
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, BinaryToOctalDraft> = {
        1: { direction: 'binary-to-octal', input: '11010110', stepsOpen: true },
        2: { direction: 'binary-to-octal', input: '1010', stepsOpen: true },
        3: { direction: 'binary-to-octal', input: '111111111', stepsOpen: true },
        4: { direction: 'octal-to-binary', input: '472', stepsOpen: true },
        5: { direction: 'octal-to-binary', input: '10', stepsOpen: true },
      };
      evaluate(examples[id]);
    },
    [evaluate]
  );

  const canCopyShare = Boolean(result);
  const sharePayload = result ? summaryText(result) : '';

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
            Base 2 ↔ base 8 · 3-bit groups
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BinaryToOctalForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        >
          <BinaryToOctalResults
            result={result}
            copied={copied}
            shared={shared}
            canShare={canShare && canCopyShare}
            onCopy={() => {
              if (!canCopyShare) return;
              void copyTextToClipboard(sharePayload).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!canCopyShare || typeof navigator.share !== 'function') return;
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
                  void copyTextToClipboard(sharePayload).then((ok) => {
                    if (!ok) return;
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  });
                });
            }}
          />
        </BinaryToOctalForm>
      </div>
    </section>
  );
}
