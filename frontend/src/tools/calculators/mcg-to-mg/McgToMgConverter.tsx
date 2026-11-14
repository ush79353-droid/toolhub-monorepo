'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMcgToMg, formatMass } from './calculation';
import { McgToMgForm, draftToInput, inputToDraft, type McgToMgDraft } from './McgToMgForm';
import { McgToMgResults } from './McgToMgResults';
import {
  DEFAULT_MCG_TO_MG_INPUT,
  EMPTY_MCG_TO_MG_INPUT,
  type McgToMgFieldErrors,
  type McgToMgResult,
} from './types';
import { validateMcgToMg } from './validation';

function summaryText(result: McgToMgResult): string {
  const lines = [
    'mcg to mg Converter — Omega Calculators',
    result.source === 'mg'
      ? `${formatMass(result.mg)} mg = ${formatMass(result.mcg)} mcg`
      : `${formatMass(result.mcg)} mcg = ${formatMass(result.mg)} mg`,
    '1 mg = 1000 mcg',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatMass(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(draft: McgToMgDraft, result: McgToMgResult): McgToMgDraft {
  if (draft.source === 'mcg') {
    return { ...draft, mg: formatMass(result.mg) };
  }
  return { ...draft, mcg: formatMass(result.mcg) };
}

export function McgToMgConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<McgToMgDraft>(() => {
    const initial = calculateMcgToMg(DEFAULT_MCG_TO_MG_INPUT);
    return {
      source: 'mcg',
      mcg: formatMass(initial.mcg),
      mg: formatMass(initial.mg),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<McgToMgFieldErrors>({});
  const [result, setResult] = React.useState<McgToMgResult | null>(() =>
    calculateMcgToMg(DEFAULT_MCG_TO_MG_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: McgToMgDraft) => {
      if (
        next.mcg === draft.mcg &&
        next.mg === draft.mg &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateMcgToMg(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateMcgToMg(parsed);
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
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">1 mg = 1000 mcg</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <McgToMgForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_MCG_TO_MG_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <McgToMgResults
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
