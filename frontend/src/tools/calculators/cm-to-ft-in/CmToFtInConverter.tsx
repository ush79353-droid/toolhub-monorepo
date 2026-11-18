'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateCmToFtIn,
  formatLength,
  shareResultText,
} from './calculation';
import {
  CmToFtInForm,
  draftToInput,
  emptyDraft,
  type CmToFtInDraft,
} from './CmToFtInForm';
import { CmToFtInResults } from './CmToFtInResults';
import type { CmToFtInFieldErrors, CmToFtInResult } from './types';
import { isIncompleteNumber, validateCmToFtIn } from './validation';

function syncDraftFromResult(draft: CmToFtInDraft, result: CmToFtInResult): CmToFtInDraft {
  if (draft.source === 'centimeters') {
    return {
      ...draft,
      feet: formatLength(result.feet),
      inches: formatLength(result.inches),
    };
  }
  return {
    ...draft,
    centimeters: formatLength(result.centimeters),
  };
}

function clearNonSource(draft: CmToFtInDraft): CmToFtInDraft {
  if (draft.source === 'centimeters') {
    return { ...draft, feet: '', inches: '' };
  }
  return { ...draft, centimeters: '' };
}

function sourceIncomplete(draft: CmToFtInDraft): boolean {
  if (draft.source === 'feetInches') {
    const ft = draft.feet.trim().replace(/,/g, '');
    const inch = draft.inches.trim().replace(/,/g, '');
    if (ft === '' && inch === '') return true;
    if (ft !== '' && isIncompleteNumber(ft)) return true;
    if (inch !== '' && isIncompleteNumber(inch)) return true;
    return false;
  }
  const raw = draft.centimeters.trim().replace(/,/g, '');
  return raw === '' || isIncompleteNumber(raw);
}

export function CmToFtInConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CmToFtInDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CmToFtInFieldErrors>({});
  const [result, setResult] = React.useState<CmToFtInResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CmToFtInDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateCmToFtIn(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateCmToFtIn(input);
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
        <CmToFtInForm
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
          <CmToFtInResults
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
        </CmToFtInForm>
      </div>
    </section>
  );
}
