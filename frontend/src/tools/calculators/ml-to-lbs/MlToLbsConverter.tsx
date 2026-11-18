'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateMlToLbs, formatMeasure, shareResultText } from './calculation';
import {
  MlToLbsForm,
  clearedDraft,
  draftToInput,
  initialDraft,
  type MlToLbsDraft,
} from './MlToLbsForm';
import { MlToLbsResults } from './MlToLbsResults';
import type { MlToLbsFieldErrors, MlToLbsResult } from './types';
import { isIncompleteNumber, validateMlToLbs } from './validation';

function syncDraftFromResult(draft: MlToLbsDraft, result: MlToLbsResult): MlToLbsDraft {
  if (draft.source === 'volume') {
    return { ...draft, massValue: formatMeasure(result.massValue) };
  }
  return { ...draft, volumeValue: formatMeasure(result.volumeValue) };
}

function clearOpposite(draft: MlToLbsDraft): MlToLbsDraft {
  if (draft.source === 'volume') return { ...draft, massValue: '' };
  return { ...draft, volumeValue: '' };
}

export function MlToLbsConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MlToLbsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<MlToLbsFieldErrors>({});
  const [result, setResult] = React.useState<MlToLbsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MlToLbsDraft) => {
    const sourceRaw = next.source === 'volume' ? next.volumeValue : next.massValue;
    const densityIncomplete =
      next.densityValue.trim() === '' ||
      isIncompleteNumber(next.densityValue.trim().replace(/,/g, ''));

    if (
      sourceRaw.trim() === '' ||
      isIncompleteNumber(sourceRaw.trim().replace(/,/g, '')) ||
      densityIncomplete
    ) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateMlToLbs(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateMlToLbs(input);
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
            lb = (mL × density kg/m³) ÷ 453592.37
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MlToLbsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(initialDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(clearedDraft(draft));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <MlToLbsResults
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
        </MlToLbsForm>
      </div>
    </section>
  );
}
