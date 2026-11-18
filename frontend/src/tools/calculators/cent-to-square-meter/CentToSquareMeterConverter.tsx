'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCentToSquareMeter,
  formatArea,
  shareResultText,
} from './calculation';
import {
  CentToSquareMeterForm,
  draftToInput,
  emptyDraft,
  type CentToSquareMeterDraft,
} from './CentToSquareMeterForm';
import { CentToSquareMeterResults } from './CentToSquareMeterResults';
import type { CentToSquareMeterFieldErrors, CentToSquareMeterResult } from './types';
import { isIncompleteNumber, validateCentToSquareMeter } from './validation';

function syncDraftFromResult(
  draft: CentToSquareMeterDraft,
  result: CentToSquareMeterResult,
): CentToSquareMeterDraft {
  if (draft.source === 'cent') {
    return { ...draft, m2: formatArea(result.m2), ft2: formatArea(result.ft2) };
  }
  if (draft.source === 'm2') {
    return { ...draft, cent: formatArea(result.cent), ft2: formatArea(result.ft2) };
  }
  return { ...draft, cent: formatArea(result.cent), m2: formatArea(result.m2) };
}

function clearOthers(draft: CentToSquareMeterDraft): CentToSquareMeterDraft {
  if (draft.source === 'cent') return { ...draft, m2: '', ft2: '' };
  if (draft.source === 'm2') return { ...draft, cent: '', ft2: '' };
  return { ...draft, cent: '', m2: '' };
}

export function CentToSquareMeterConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CentToSquareMeterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CentToSquareMeterFieldErrors>({});
  const [result, setResult] = React.useState<CentToSquareMeterResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CentToSquareMeterDraft) => {
    const sourceRaw =
      next.source === 'cent' ? next.cent : next.source === 'm2' ? next.m2 : next.ft2;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOthers(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateCentToSquareMeter(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCentToSquareMeter(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';

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
            1 cent = 40.468564224 m² = 435.6 ft²
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CentToSquareMeterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
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
        >
          <CentToSquareMeterResults
            result={result}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(result)}
            onCopy={() => {
              if (!result) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
                  ? `${payload}\n\nExplore: ${window.location.href}`
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
        </CentToSquareMeterForm>
      </div>
    </section>
  );
}
