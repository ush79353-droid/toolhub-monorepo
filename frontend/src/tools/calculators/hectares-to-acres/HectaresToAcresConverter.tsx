'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateHectaresToAcres, formatArea, shareResultText } from './calculation';
import {
  HectaresToAcresForm,
  draftToInput,
  emptyDraft,
  type HectaresToAcresDraft,
} from './HectaresToAcresForm';
import { HectaresToAcresResults } from './HectaresToAcresResults';
import {
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
  type HectaresToAcresFieldErrors,
  type HectaresToAcresResult,
} from './types';
import { isIncompleteNumber, validateHectaresToAcres } from './validation';

function syncDraftFromResult(
  draft: HectaresToAcresDraft,
  result: HectaresToAcresResult,
): HectaresToAcresDraft {
  if (draft.source === 'hectares') {
    return { ...draft, acres: formatArea(result.acres) };
  }
  return { ...draft, hectares: formatArea(result.hectares) };
}

function clearOpposite(draft: HectaresToAcresDraft): HectaresToAcresDraft {
  if (draft.source === 'hectares') return { ...draft, acres: '' };
  return { ...draft, hectares: '' };
}

export function HectaresToAcresConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<HectaresToAcresDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<HectaresToAcresFieldErrors>({});
  const [result, setResult] = React.useState<HectaresToAcresResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: HectaresToAcresDraft) => {
    const sourceRaw = next.source === 'hectares' ? next.hectares : next.acres;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateHectaresToAcres(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateHectaresToAcres(input);
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
            1 ha = {SQUARE_METERS_PER_HECTARE} m² · 1 ac = {SQUARE_METERS_PER_ACRE} m²
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <HectaresToAcresForm
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
          <HectaresToAcresResults
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
        </HectaresToAcresForm>
      </div>
    </section>
  );
}
