'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateKathaToSqft,
  formatArea,
  getKathaRegion,
  shareResultText,
} from './calculation';
import {
  KathaToSqftForm,
  draftToInput,
  emptyDraft,
  type KathaToSqftDraft,
} from './KathaToSqftForm';
import { KathaToSqftResults } from './KathaToSqftResults';
import { DEFAULT_REGION_ID, type KathaToSqftFieldErrors, type KathaToSqftResult } from './types';
import { isIncompleteNumber, validateKathaToSqft } from './validation';

function syncDraftFromResult(
  draft: KathaToSqftDraft,
  result: KathaToSqftResult,
): KathaToSqftDraft {
  if (draft.source === 'katha') {
    return { ...draft, ft2: formatArea(result.ft2), m2: formatArea(result.m2) };
  }
  if (draft.source === 'ft2') {
    return { ...draft, katha: formatArea(result.katha), m2: formatArea(result.m2) };
  }
  return { ...draft, katha: formatArea(result.katha), ft2: formatArea(result.ft2) };
}

function clearOthers(draft: KathaToSqftDraft): KathaToSqftDraft {
  if (draft.source === 'katha') return { ...draft, ft2: '', m2: '' };
  if (draft.source === 'ft2') return { ...draft, katha: '', m2: '' };
  return { ...draft, katha: '', ft2: '' };
}

export function KathaToSquareFeetConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KathaToSqftDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<KathaToSqftFieldErrors>({});
  const [result, setResult] = React.useState<KathaToSqftResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: KathaToSqftDraft) => {
    const sourceRaw =
      next.source === 'katha' ? next.katha : next.source === 'ft2' ? next.ft2 : next.m2;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOthers(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateKathaToSqft(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateKathaToSqft(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';
  const region = getKathaRegion(draft.regionId);

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
            {region.name}: 1 katha = {formatArea(region.squareFeetPerKatha)} ft²
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KathaToSqftForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft(DEFAULT_REGION_ID));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            // Clear numbers only; keep the selected region.
            setDraft(emptyDraft(draft.regionId));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <KathaToSqftResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
                  : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
                  : payload;
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(text).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </KathaToSqftForm>
      </div>
    </section>
  );
}
