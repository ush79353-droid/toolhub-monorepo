'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateGalToCuFt, formatVolume, shareResultText } from './calculation';
import {
  GalToCuFtForm,
  draftToInput,
  emptyDraft,
  type GalToCuFtDraft,
} from './GalToCuFtForm';
import { GalToCuFtResults } from './GalToCuFtResults';
import type { GalToCuFtFieldErrors, GalToCuFtResult } from './types';
import { isIncompleteNumber, validateGalToCuFt } from './validation';

function syncDraftFromResult(draft: GalToCuFtDraft, result: GalToCuFtResult): GalToCuFtDraft {
  return {
    ...draft,
    usGal: draft.source === 'usGal' ? draft.usGal : formatVolume(result.usGal),
    ukGal: draft.source === 'ukGal' ? draft.ukGal : formatVolume(result.ukGal),
    ft3: draft.source === 'ft3' ? draft.ft3 : formatVolume(result.ft3),
  };
}

function clearNonSource(draft: GalToCuFtDraft): GalToCuFtDraft {
  if (draft.source === 'usGal') return { ...draft, ukGal: '', ft3: '' };
  if (draft.source === 'ukGal') return { ...draft, usGal: '', ft3: '' };
  return { ...draft, usGal: '', ukGal: '' };
}

export function GallonsToCubicFeetConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GalToCuFtDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<GalToCuFtFieldErrors>({});
  const [result, setResult] = React.useState<GalToCuFtResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GalToCuFtDraft) => {
    const sourceRaw =
      next.source === 'usGal' ? next.usGal : next.source === 'ukGal' ? next.ukGal : next.ft3;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateGalToCuFt(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateGalToCuFt(input);
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
            US gal · UK gal · ft³ via exact liter factors
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GalToCuFtForm
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
          <GalToCuFtResults
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
        </GalToCuFtForm>
      </div>
    </section>
  );
}
