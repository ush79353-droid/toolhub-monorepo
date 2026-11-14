'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, defaultAbsolute, millionToNumber } from './calculation';
import {
  NumberToMillionForm,
  defaultDraft,
  emptyDraft,
  type NumberToMillionDraft,
} from './NumberToMillionForm';
import { NumberToMillionResults } from './NumberToMillionResults';
import type {
  DecimalValue,
  NumberMillionFieldErrors,
  NumberMillionResult,
} from './types';
import { parseFieldInput } from './validation';

function summaryText(result: NumberMillionResult): string {
  return [
    'Number to Million Converter',
    'Omega Calculators',
    '',
    `Number: ${result.numberGrouped}`,
    `Millions: ${result.millionDisplay}`,
    '',
    `${result.numberGrouped} = ${result.millionDisplay} million`,
    '',
    `Scientific: ${result.scientificNotation}`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: NumberToMillionDraft['sourceField'],
  preserveRaw?: Partial<Pick<NumberToMillionDraft, 'number' | 'million'>>
): NumberToMillionDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    number: preserveRaw?.number ?? result.numberDisplay,
    million: preserveRaw?.million ?? result.millionDisplay,
  };
}

export function NumberToMillionConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NumberToMillionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NumberMillionFieldErrors>({});
  const [result, setResult] = React.useState<NumberMillionResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: NumberToMillionDraft) => {
    const field = next.sourceField;
    const raw = field === 'number' ? next.number : next.million;
    const parsed = parseFieldInput(raw, field);

    if (parsed.blank) {
      setErrors({});
      setResult(null);
      setDraft(field === 'number' ? { ...next, million: '' } : { ...next, number: '' });
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ [field]: parsed.error ?? 'Enter a valid number.' });
      setResult(null);
      setDraft(next);
      return;
    }

    const absolute =
      field === 'million' ? millionToNumber(parsed.value) : parsed.value;

    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        number: field === 'number' ? next.number : nextResult.numberDisplay,
        million: field === 'million' ? next.million : nextResult.millionDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, NumberToMillionDraft> = {
        1: { sourceField: 'number', number: '1000000', million: '' },
        2: { sourceField: 'number', number: '3500000', million: '' },
        3: { sourceField: 'number', number: '500000', million: '' },
        4: { sourceField: 'million', number: '', million: '2.5' },
        5: { sourceField: 'number', number: '12345678', million: '' },
      };
      evaluate(examples[id]);
    },
    [evaluate]
  );

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
            Short scale · 1 million = 10⁶
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NumberToMillionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setResult(buildResult(defaultAbsolute()));
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
        />
        <NumberToMillionResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
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
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
