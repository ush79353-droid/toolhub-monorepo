'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateHeight, formatLength, metersToOther, shareResultText } from './calculation';
import {
  HeightConverterForm,
  draftToInput,
  emptyDraft,
  type HeightDraft,
} from './HeightConverterForm';
import { HeightConverterResults } from './HeightConverterResults';
import type { HeightFieldErrors, HeightResult } from './types';
import { isIncompleteNumber, validateHeight } from './validation';

function syncDraftFromResult(draft: HeightDraft, result: HeightResult): HeightDraft {
  const next: HeightDraft = {
    ...draft,
    centimeters: formatLength(result.centimeters),
    meters: formatLength(result.meters),
    metersPart: formatLength(result.metersPart),
    centimetersPart: formatLength(result.centimetersPart),
    inches: formatLength(result.inches),
    feet: formatLength(result.feet),
    feetPart: formatLength(result.feetPart),
    inchesPart: formatLength(result.inchesPart),
    otherUnit: draft.otherUnit,
    otherValue: formatLength(metersToOther(result.meters, draft.otherUnit)),
  };

  if (draft.source === 'centimeters') next.centimeters = draft.centimeters;
  else if (draft.source === 'meters') next.meters = draft.meters;
  else if (draft.source === 'metersCm') {
    next.metersPart = draft.metersPart;
    next.centimetersPart = draft.centimetersPart;
  } else if (draft.source === 'inches') next.inches = draft.inches;
  else if (draft.source === 'feet') next.feet = draft.feet;
  else if (draft.source === 'feetInches') {
    next.feetPart = draft.feetPart;
    next.inchesPart = draft.inchesPart;
  } else if (draft.source === 'other') next.otherValue = draft.otherValue;

  return next;
}

function clearNonSource(draft: HeightDraft): HeightDraft {
  const cleared: HeightDraft = {
    ...draft,
    centimeters: '',
    meters: '',
    metersPart: '',
    centimetersPart: '',
    inches: '',
    feet: '',
    feetPart: '',
    inchesPart: '',
    otherValue: '',
  };
  if (draft.source === 'centimeters') cleared.centimeters = draft.centimeters;
  else if (draft.source === 'meters') cleared.meters = draft.meters;
  else if (draft.source === 'metersCm') {
    cleared.metersPart = draft.metersPart;
    cleared.centimetersPart = draft.centimetersPart;
  } else if (draft.source === 'inches') cleared.inches = draft.inches;
  else if (draft.source === 'feet') cleared.feet = draft.feet;
  else if (draft.source === 'feetInches') {
    cleared.feetPart = draft.feetPart;
    cleared.inchesPart = draft.inchesPart;
  } else if (draft.source === 'other') cleared.otherValue = draft.otherValue;
  return cleared;
}

function compoundIncomplete(a: string, b: string): boolean {
  const left = a.trim().replace(/,/g, '');
  const right = b.trim().replace(/,/g, '');
  if (left === '' && right === '') return true;
  if (left !== '' && isIncompleteNumber(left)) return true;
  if (right !== '' && isIncompleteNumber(right)) return true;
  return false;
}

function sourceIncomplete(draft: HeightDraft): boolean {
  if (draft.source === 'metersCm') {
    return compoundIncomplete(draft.metersPart, draft.centimetersPart);
  }
  if (draft.source === 'feetInches') {
    return compoundIncomplete(draft.feetPart, draft.inchesPart);
  }
  const raw =
    draft.source === 'centimeters'
      ? draft.centimeters
      : draft.source === 'meters'
        ? draft.meters
        : draft.source === 'inches'
          ? draft.inches
          : draft.source === 'feet'
            ? draft.feet
            : draft.otherValue;
  const cleaned = raw.trim().replace(/,/g, '');
  return cleaned === '' || isIncompleteNumber(cleaned);
}

export function HeightConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HeightDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<HeightFieldErrors>({});
  const [result, setResult] = React.useState<HeightResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: HeightDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateHeight(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateHeight(input);
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
            cm · m · m+cm · in · ft · ft+in · other
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HeightConverterForm
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
          <HeightConverterResults
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
        </HeightConverterForm>
      </div>
    </section>
  );
}
