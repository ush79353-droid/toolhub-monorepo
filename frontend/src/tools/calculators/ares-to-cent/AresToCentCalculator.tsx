'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAresToCent, formatArea } from './calculation';
import { AresToCentForm, draftToInput, type AresToCentDraft } from './AresToCentForm';
import { AresToCentResults } from './AresToCentResults';
import {
  DEFAULT_ARES_TO_CENT_INPUT,
  type AresToCentFieldErrors,
  type AresToCentResult,
} from './types';
import { validateAresToCent } from './validation';

function summaryText(result: AresToCentResult): string {
  return [
    'Ares to Cent Converter — Omega Calculators',
    `${formatArea(result.ares)} ares ≈ ${formatArea(result.cents)} cents`,
    result.explanation,
    '1 are ≈ 2.47105381467 cents · 1 cent = 0.40468564224 ares',
  ].join('\n');
}

function syncDraftFromResult(draft: AresToCentDraft, result: AresToCentResult): AresToCentDraft {
  if (draft.source === 'ares') {
    return { ...draft, cents: formatArea(result.cents) };
  }
  return { ...draft, ares: formatArea(result.ares) };
}

const EMPTY_DRAFT: AresToCentDraft = { source: 'ares', ares: '', cents: '' };

export function AresToCentConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AresToCentDraft>(() => {
    const initial = calculateAresToCent(DEFAULT_ARES_TO_CENT_INPUT);
    return {
      source: 'ares',
      ares: formatArea(initial.ares),
      cents: formatArea(initial.cents),
    };
  });
  const [errors, setErrors] = React.useState<AresToCentFieldErrors>({});
  const [result, setResult] = React.useState<AresToCentResult | null>(() =>
    calculateAresToCent(DEFAULT_ARES_TO_CENT_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AresToCentDraft) => {
    const input = draftToInput(next);
    const validation = validateAresToCent(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAresToCent(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  }, []);

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
            1 are ≈ 2.47105381467 cents
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AresToCentForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(EMPTY_DRAFT);
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <AresToCentResults
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
