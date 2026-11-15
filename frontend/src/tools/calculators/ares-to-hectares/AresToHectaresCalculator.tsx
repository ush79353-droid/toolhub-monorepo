'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAresToHectares, formatArea } from './calculation';
import { AresToHectaresForm, draftToInput, type AresToHectaresDraft } from './AresToHectaresForm';
import { AresToHectaresResults } from './AresToHectaresResults';
import {
  DEFAULT_ARES_TO_HECTARES_INPUT,
  type AresToHectaresFieldErrors,
  type AresToHectaresResult,
} from './types';
import { validateAresToHectares } from './validation';

function summaryText(result: AresToHectaresResult): string {
  return [
    'Ares to Hectares Converter — Omega Calculators',
    `${formatArea(result.ares)} ares = ${formatArea(result.hectares)} hectares`,
    result.explanation,
    '1 hectare = 100 ares',
  ].join('\n');
}

function syncDraftFromResult(
  draft: AresToHectaresDraft,
  result: AresToHectaresResult
): AresToHectaresDraft {
  if (draft.source === 'ares') {
    return { ...draft, hectares: formatArea(result.hectares) };
  }
  return { ...draft, ares: formatArea(result.ares) };
}

const EMPTY_DRAFT: AresToHectaresDraft = {
  source: 'ares',
  ares: '',
  hectares: '',
  moreOpen: false,
};

export function AresToHectaresConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AresToHectaresDraft>(() => {
    const initial = calculateAresToHectares(DEFAULT_ARES_TO_HECTARES_INPUT);
    return {
      source: 'ares',
      ares: formatArea(initial.ares),
      hectares: formatArea(initial.hectares),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<AresToHectaresFieldErrors>({});
  const [result, setResult] = React.useState<AresToHectaresResult | null>(() =>
    calculateAresToHectares(DEFAULT_ARES_TO_HECTARES_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AresToHectaresDraft) => {
    // Accordion-only toggle: keep current result.
    if (
      next.ares === draft.ares &&
      next.hectares === draft.hectares &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateAresToHectares(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAresToHectares(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  }, [draft]);

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
          <p className="text-xs font-normal text-muted-foreground">1 hectare = 100 ares</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AresToHectaresForm
          draft={draft}
          errors={errors}
          extras={result?.extras ?? null}
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
        <AresToHectaresResults
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
