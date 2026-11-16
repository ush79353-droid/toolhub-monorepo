'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCmHeight,
  formatLength,
  shareResultText,
} from './calculation';
import type { CmHeightResult } from './types';
import {
  CmHeightConversionForm,
  draftToInput,
  emptyDraft,
  type CmHeightDraft,
} from './CmHeightConversionForm';
import { CmHeightConversionResults } from './CmHeightConversionResults';
import type { CmHeightFieldErrors } from './types';
import { isIncompleteNumber, validateCmHeight } from './validation';

function syncDraftFromResult(draft: CmHeightDraft, result: CmHeightResult): CmHeightDraft {
  const next: CmHeightDraft = {
    ...draft,
    centimeters: formatLength(result.centimeters),
    feet: formatLength(result.feet),
    inches: formatLength(result.inches),
    meters: formatLength(result.meters),
    millimeters: formatLength(result.millimeters),
    totalInches: formatLength(result.totalInches),
    decimalFeet: formatLength(result.decimalFeet),
  };

  if (draft.source === 'centimeters') next.centimeters = draft.centimeters;
  else if (draft.source === 'feetInches') {
    next.feet = draft.feet;
    next.inches = draft.inches;
  } else if (draft.source === 'meters') next.meters = draft.meters;
  else if (draft.source === 'millimeters') next.millimeters = draft.millimeters;
  else if (draft.source === 'totalInches') next.totalInches = draft.totalInches;
  else if (draft.source === 'decimalFeet') next.decimalFeet = draft.decimalFeet;

  return next;
}

function clearNonSource(draft: CmHeightDraft): CmHeightDraft {
  const cleared: CmHeightDraft = {
    ...draft,
    centimeters: '',
    feet: '',
    inches: '',
    meters: '',
    millimeters: '',
    totalInches: '',
    decimalFeet: '',
  };
  if (draft.source === 'centimeters') cleared.centimeters = draft.centimeters;
  else if (draft.source === 'feetInches') {
    cleared.feet = draft.feet;
    cleared.inches = draft.inches;
  } else if (draft.source === 'meters') cleared.meters = draft.meters;
  else if (draft.source === 'millimeters') cleared.millimeters = draft.millimeters;
  else if (draft.source === 'totalInches') cleared.totalInches = draft.totalInches;
  else if (draft.source === 'decimalFeet') cleared.decimalFeet = draft.decimalFeet;
  return cleared;
}

function sourceRaw(draft: CmHeightDraft): string {
  if (draft.source === 'centimeters') return draft.centimeters;
  if (draft.source === 'feetInches') {
    return draft.feet.trim() === '' && draft.inches.trim() === ''
      ? ''
      : `${draft.feet}|${draft.inches}`;
  }
  if (draft.source === 'meters') return draft.meters;
  if (draft.source === 'millimeters') return draft.millimeters;
  if (draft.source === 'totalInches') return draft.totalInches;
  return draft.decimalFeet;
}

function sourceIncomplete(draft: CmHeightDraft): boolean {
  if (draft.source === 'feetInches') {
    const ft = draft.feet.trim().replace(/,/g, '');
    const inch = draft.inches.trim().replace(/,/g, '');
    if (ft === '' && inch === '') return true;
    if (ft !== '' && isIncompleteNumber(ft)) return true;
    if (inch !== '' && isIncompleteNumber(inch)) return true;
    return false;
  }
  const raw = sourceRaw(draft).trim().replace(/,/g, '');
  return raw === '' || isIncompleteNumber(raw);
}

export function CmHeightConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CmHeightDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CmHeightFieldErrors>({});
  const [result, setResult] = React.useState<CmHeightResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CmHeightDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateCmHeight(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCmHeight(input);
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
            1 in = 2.54 cm · 1 ft = 30.48 cm
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CmHeightConversionForm
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
          <CmHeightConversionResults
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
        </CmHeightConversionForm>
      </div>
    </section>
  );
}
