'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  absoluteFromCrore,
  absoluteFromMillion,
  buildResult,
  defaultAbsolute,
} from './calculation';
import {
  CroreToMillionForm,
  defaultDraft,
  emptyDraft,
  type CroreToMillionDraft,
} from './CroreToMillionForm';
import { CroreToMillionResults } from './CroreToMillionResults';
import type { CroreMillionFieldErrors, CroreMillionResult, DecimalValue } from './types';
import { parseFieldInput } from './validation';

function summaryText(result: CroreMillionResult): string {
  return [
    'Crore to Million Converter',
    'Omega Calculators',
    '',
    `Crores: ${result.croreDisplay}`,
    `Millions: ${result.millionDisplay}`,
    '',
    'Conversion:',
    `${result.croreDisplay} crore = ${result.millionDisplay} million`,
    '',
    `International: ${result.absoluteInternational}`,
    `Indian: ${result.absoluteIndian}`,
  ].join('\n');
}

function draftFromAbsolute(
  absolute: DecimalValue,
  sourceField: CroreToMillionDraft['sourceField'],
  preserveRaw?: Partial<Pick<CroreToMillionDraft, 'crore' | 'million'>>
): CroreToMillionDraft {
  const result = buildResult(absolute);
  return {
    sourceField,
    crore: preserveRaw?.crore ?? result.croreDisplay,
    million: preserveRaw?.million ?? result.millionDisplay,
  };
}

export function CroreToMillionConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CroreToMillionDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CroreMillionFieldErrors>({});
  const [result, setResult] = React.useState<CroreMillionResult | null>(() =>
    buildResult(defaultAbsolute())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: CroreToMillionDraft) => {
    const field = next.sourceField;
    const raw = field === 'crore' ? next.crore : next.million;
    const parsed = parseFieldInput(raw, field);

    if (parsed.blank) {
      setErrors({});
      setResult(null);
      setDraft(field === 'crore' ? { ...next, million: '' } : { ...next, crore: '' });
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ [field]: parsed.error ?? 'Enter a valid number.' });
      setResult(null);
      setDraft(next);
      return;
    }

    const absolute =
      field === 'crore'
        ? absoluteFromCrore(parsed.value)
        : absoluteFromMillion(parsed.value);
    const nextResult = buildResult(absolute);
    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromAbsolute(absolute, field, {
        crore: field === 'crore' ? next.crore : nextResult.croreDisplay,
        million: field === 'million' ? next.million : nextResult.millionDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, CroreToMillionDraft> = {
        1: { sourceField: 'crore', crore: '1', million: '' },
        2: { sourceField: 'crore', crore: '2.5', million: '' },
        3: { sourceField: 'crore', crore: '12.75', million: '' },
        4: { sourceField: 'million', crore: '', million: '75' },
        5: { sourceField: 'crore', crore: '0.1', million: '' },
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
          <p className="text-xs font-normal text-muted-foreground">1 crore = 10 million</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CroreToMillionForm
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
        <CroreToMillionResults
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
