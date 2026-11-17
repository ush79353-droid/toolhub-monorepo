'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateLbsToPounds, shareResultText } from './calculation';
import {
  LbsToPoundsForm,
  defaultDraft,
  draftToInput,
  emptyDraft,
  type LbsToPoundsDraft,
} from './LbsToPoundsForm';
import { LbsToPoundsResults } from './LbsToPoundsResults';
import { LBS_TO_POUNDS_FACTOR, type LbsToPoundsFieldErrors, type LbsToPoundsResult } from './types';
import { isIncompleteNumber, validateLbsToPounds } from './validation';

/** Identity sync: copy the active field text so typing precision is preserved. */
function syncDraftIdentity(draft: LbsToPoundsDraft): LbsToPoundsDraft {
  if (draft.source === 'lbs') {
    return { ...draft, pounds: draft.lbs };
  }
  return { ...draft, lbs: draft.pounds };
}

function clearOpposite(draft: LbsToPoundsDraft): LbsToPoundsDraft {
  if (draft.source === 'lbs') return { ...draft, pounds: '' };
  return { ...draft, lbs: '' };
}

function initialResult(): LbsToPoundsResult {
  return calculateLbsToPounds({ source: 'lbs', lbs: 1, pounds: null });
}

export function LbsToPoundsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LbsToPoundsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<LbsToPoundsFieldErrors>({});
  const [result, setResult] = React.useState<LbsToPoundsResult | null>(initialResult);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LbsToPoundsDraft) => {
    const sourceRaw = next.source === 'lbs' ? next.lbs : next.pounds;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateLbsToPounds(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateLbsToPounds(input);
    setResult(nextResult);
    setDraft(syncDraftIdentity(next));
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
            1 lb = 1 pound (identity × {LBS_TO_POUNDS_FACTOR})
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LbsToPoundsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setErrors({});
            setResult(initialResult());
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
          <LbsToPoundsResults
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
        </LbsToPoundsForm>
      </div>
    </section>
  );
}
