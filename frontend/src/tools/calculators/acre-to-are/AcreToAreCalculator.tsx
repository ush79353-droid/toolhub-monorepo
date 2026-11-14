'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateAcreToAre, formatArea } from './calculation';
import { AcreToAreForm, draftToInput, type AcreToAreDraft } from './AcreToAreForm';
import { AcreToAreResults } from './AcreToAreResults';
import {
  DEFAULT_ACRE_TO_ARE_INPUT,
  type AcreToAreFieldErrors,
  type AcreToAreResult,
} from './types';
import { validateAcreToAre } from './validation';

function summaryText(result: AcreToAreResult): string {
  return [
    'Acre to Are Conversion — Omega Calculators',
    `${formatArea(result.acres)} acres = ${formatArea(result.ares)} ares`,
    result.explanation,
    '1 acre = 40.468564224 ares',
  ].join('\n');
}

function syncDraftFromResult(draft: AcreToAreDraft, result: AcreToAreResult): AcreToAreDraft {
  if (draft.source === 'acres') {
    return { ...draft, ares: formatArea(result.ares) };
  }
  return { ...draft, acres: formatArea(result.acres) };
}

const EMPTY_DRAFT: AcreToAreDraft = { source: 'acres', acres: '', ares: '' };

export function AcreToAreConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AcreToAreDraft>(() => {
    const initial = calculateAcreToAre(DEFAULT_ACRE_TO_ARE_INPUT);
    return {
      source: 'acres',
      acres: formatArea(initial.acres),
      ares: formatArea(initial.ares),
    };
  });
  const [errors, setErrors] = React.useState<AcreToAreFieldErrors>({});
  const [result, setResult] = React.useState<AcreToAreResult | null>(() =>
    calculateAcreToAre(DEFAULT_ACRE_TO_ARE_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AcreToAreDraft) => {
    const parsed = draftToInput(next);
    const validation = validateAcreToAre(parsed);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateAcreToAre(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">1 acre = 40.468564224 ares</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AcreToAreForm
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
        <AcreToAreResults
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
