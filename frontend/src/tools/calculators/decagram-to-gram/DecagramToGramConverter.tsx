'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateDecagramToGram, formatMass } from './calculation';
import {
  DecagramToGramForm,
  draftToInput,
  inputToDraft,
  type DecagramToGramDraft,
} from './DecagramToGramForm';
import { DecagramToGramResults } from './DecagramToGramResults';
import {
  DEFAULT_DECAGRAM_TO_GRAM_INPUT,
  EMPTY_DECAGRAM_TO_GRAM_INPUT,
  type DecagramToGramFieldErrors,
  type DecagramToGramResult,
} from './types';
import { validateDecagramToGram } from './validation';

function summaryText(result: DecagramToGramResult): string {
  return [
    'Decagram to Gram Converter — Omega Calculators',
    result.source === 'g'
      ? `${formatMass(result.g)} g = ${formatMass(result.dag)} dag`
      : `${formatMass(result.dag)} dag = ${formatMass(result.g)} g`,
    '1 dag = 10 g',
  ].join('\n');
}

function syncDraftFromResult(
  draft: DecagramToGramDraft,
  result: DecagramToGramResult
): DecagramToGramDraft {
  if (draft.source === 'dag') {
    return { ...draft, g: formatMass(result.g) };
  }
  return { ...draft, dag: formatMass(result.dag) };
}

export function DecagramToGramConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DecagramToGramDraft>(() => {
    const initial = calculateDecagramToGram(DEFAULT_DECAGRAM_TO_GRAM_INPUT);
    return {
      source: 'dag',
      dag: formatMass(initial.dag),
      g: formatMass(initial.g),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<DecagramToGramFieldErrors>({});
  const [result, setResult] = React.useState<DecagramToGramResult | null>(() =>
    calculateDecagramToGram(DEFAULT_DECAGRAM_TO_GRAM_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: DecagramToGramDraft) => {
      if (
        next.dag === draft.dag &&
        next.g === draft.g &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateDecagramToGram(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateDecagramToGram(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    },
    [draft]
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
          <h2 className="text-[15px] font-semibold text-accent">Converter</h2>
          <p className="text-xs font-normal text-muted-foreground">1 dag = 10 g</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DecagramToGramForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_DECAGRAM_TO_GRAM_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <DecagramToGramResults
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
