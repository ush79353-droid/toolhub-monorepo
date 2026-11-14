'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateCcfToGallons, formatVolume } from './calculation';
import {
  CcfToGallonsForm,
  draftToInput,
  inputToDraft,
  type CcfToGallonsDraft,
} from './CcfToGallonsForm';
import { CcfToGallonsResults } from './CcfToGallonsResults';
import {
  DEFAULT_CCF_TO_GALLONS_INPUT,
  EMPTY_CCF_TO_GALLONS_INPUT,
  type CcfToGallonsFieldErrors,
  type CcfToGallonsResult,
} from './types';
import { validateCcfToGallons } from './validation';

function summaryText(result: CcfToGallonsResult): string {
  const lines = [
    'CCF to Gallons Conversion — Omega Calculators',
    result.source === 'usGallons'
      ? `${formatVolume(result.usGallons)} US gal = ${formatVolume(result.ccf)} CCF`
      : `${formatVolume(result.ccf)} CCF = ${formatVolume(result.usGallons)} US gal`,
    '1 CCF = 100 ft³ = 172800/231 US liquid gallons',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatVolume(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: CcfToGallonsDraft,
  result: CcfToGallonsResult
): CcfToGallonsDraft {
  if (draft.source === 'ccf') {
    return { ...draft, usGallons: formatVolume(result.usGallons) };
  }
  return { ...draft, ccf: formatVolume(result.ccf) };
}

export function CcfToGallonsConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CcfToGallonsDraft>(() => {
    const initial = calculateCcfToGallons(DEFAULT_CCF_TO_GALLONS_INPUT);
    return {
      source: 'ccf',
      ccf: formatVolume(initial.ccf),
      usGallons: formatVolume(initial.usGallons),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<CcfToGallonsFieldErrors>({});
  const [result, setResult] = React.useState<CcfToGallonsResult | null>(() =>
    calculateCcfToGallons(DEFAULT_CCF_TO_GALLONS_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: CcfToGallonsDraft) => {
      if (
        next.ccf === draft.ccf &&
        next.usGallons === draft.usGallons &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateCcfToGallons(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateCcfToGallons(parsed);
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
          <p className="text-xs font-normal text-muted-foreground">
            1 CCF = 172800 ÷ 231 US liquid gallons
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CcfToGallonsForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_CCF_TO_GALLONS_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <CcfToGallonsResults
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
