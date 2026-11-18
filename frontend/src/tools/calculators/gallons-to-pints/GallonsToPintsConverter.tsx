'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateGalToPints, formatVolume, shareResultText } from './calculation';
import {
  GalToPintsForm,
  draftToInput,
  emptyDraft,
  type GalToPintsDraft,
} from './GalToPintsForm';
import { GalToPintsResults } from './GalToPintsResults';
import { MORE_SOURCES, type GalToPintsFieldErrors, type GalToPintsResult } from './types';
import { isIncompleteNumber, validateGalToPints } from './validation';

function syncDraftFromResult(draft: GalToPintsDraft, result: GalToPintsResult): GalToPintsDraft {
  const moreMap = Object.fromEntries(result.more.map((row) => [row.unit, formatVolume(row.value)]));
  return {
    ...draft,
    usGal: draft.source === 'usGal' ? draft.usGal : formatVolume(result.usGal),
    ukGal: draft.source === 'ukGal' ? draft.ukGal : formatVolume(result.ukGal),
    usPt: draft.source === 'usPt' ? draft.usPt : formatVolume(result.usPt),
    ukPt: draft.source === 'ukPt' ? draft.ukPt : formatVolume(result.ukPt),
    mL: draft.source === 'mL' ? draft.mL : (moreMap.mL ?? ''),
    L: draft.source === 'L' ? draft.L : (moreMap.L ?? ''),
    usFlOz: draft.source === 'usFlOz' ? draft.usFlOz : (moreMap.usFlOz ?? ''),
    ukFlOz: draft.source === 'ukFlOz' ? draft.ukFlOz : (moreMap.ukFlOz ?? ''),
    usQt: draft.source === 'usQt' ? draft.usQt : (moreMap.usQt ?? ''),
    ukQt: draft.source === 'ukQt' ? draft.ukQt : (moreMap.ukQt ?? ''),
    m3: draft.source === 'm3' ? draft.m3 : (moreMap.m3 ?? ''),
  };
}

function clearNonSource(draft: GalToPintsDraft): GalToPintsDraft {
  const next = { ...draft };
  const keys = [
    'usGal',
    'ukGal',
    'usPt',
    'ukPt',
    ...MORE_SOURCES.map((r) => r.unit),
  ] as const;
  for (const key of keys) {
    if (key !== draft.source) next[key] = '';
  }
  return next;
}

export function GallonsToPintsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GalToPintsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<GalToPintsFieldErrors>({});
  const [result, setResult] = React.useState<GalToPintsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: GalToPintsDraft) => {
    if (
      next.usGal === draft.usGal &&
      next.ukGal === draft.ukGal &&
      next.usPt === draft.usPt &&
      next.ukPt === draft.ukPt &&
      next.mL === draft.mL &&
      next.L === draft.L &&
      next.usFlOz === draft.usFlOz &&
      next.ukFlOz === draft.ukFlOz &&
      next.usQt === draft.usQt &&
      next.ukQt === draft.ukQt &&
      next.m3 === draft.m3 &&
      next.source === draft.source &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw = next[next.source];
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateGalToPints(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateGalToPints(input);
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
            US · UK gallons and pints via exact liter factors
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GalToPintsForm
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
          <GalToPintsResults
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
        </GalToPintsForm>
      </div>
    </section>
  );
}
