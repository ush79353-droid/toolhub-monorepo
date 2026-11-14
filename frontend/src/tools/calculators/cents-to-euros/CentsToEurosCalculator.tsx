'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResultFromCents, buildResultFromEuros, defaultCents } from './calculation';
import {
  CentsToEurosForm,
  defaultDraft,
  emptyDraft,
  type CentsToEurosDraft,
} from './CentsToEurosForm';
import { CentsToEurosResults } from './CentsToEurosResults';
import type { CentsEurosFieldErrors, CentsEurosResult } from './types';
import { parseFieldInput } from './validation';

function summaryText(result: CentsEurosResult): string {
  return [
    'Cents to Euros Calculator',
    'Omega Calculators',
    '',
    `Cents: ${result.centsDisplay}`,
    `Euros: ${result.eurosFormatted}`,
    '',
    result.summaryLine,
  ].join('\n');
}

function draftFromResult(
  result: CentsEurosResult,
  sourceField: CentsToEurosDraft['sourceField'],
  preserveRaw?: Partial<Pick<CentsToEurosDraft, 'cents' | 'euros'>>
): CentsToEurosDraft {
  return {
    sourceField,
    cents: preserveRaw?.cents ?? result.centsDisplay,
    euros: preserveRaw?.euros ?? result.eurosDisplay,
  };
}

export function CentsToEurosCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CentsToEurosDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CentsEurosFieldErrors>({});
  const [result, setResult] = React.useState<CentsEurosResult | null>(() =>
    buildResultFromCents(defaultCents())
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: CentsToEurosDraft) => {
    const field = next.sourceField;
    const raw = field === 'cents' ? next.cents : next.euros;
    const parsed = parseFieldInput(raw, field);

    if (parsed.blank) {
      setErrors({});
      setResult(null);
      setDraft(field === 'cents' ? { ...next, euros: '' } : { ...next, cents: '' });
      return;
    }
    if (parsed.error || !parsed.value) {
      setErrors({ [field]: parsed.error ?? 'Enter a valid number.' });
      setResult(null);
      setDraft(next);
      return;
    }

    const nextResult =
      field === 'cents'
        ? buildResultFromCents(parsed.value)
        : buildResultFromEuros(parsed.value);

    setErrors({});
    setResult(nextResult);
    setDraft(
      draftFromResult(nextResult, field, {
        cents: field === 'cents' ? next.cents : nextResult.centsDisplay,
        euros: field === 'euros' ? next.euros : nextResult.eurosDisplay,
      })
    );
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, CentsToEurosDraft> = {
        1: { sourceField: 'cents', cents: '100', euros: '' },
        2: { sourceField: 'cents', cents: '250', euros: '' },
        3: { sourceField: 'cents', cents: '50', euros: '' },
        4: { sourceField: 'euros', cents: '', euros: '12.50' },
        5: { sourceField: 'cents', cents: '0.5', euros: '' },
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
          <p className="text-xs font-normal text-muted-foreground">1 euro = 100 cents</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CentsToEurosForm
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
            setResult(buildResultFromCents(defaultCents()));
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
        <CentsToEurosResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(result.summaryLine).then((ok) => {
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
