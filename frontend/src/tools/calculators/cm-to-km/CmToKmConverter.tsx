'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateCmToKm, formatLength, shareResultText } from './calculation';
import { CmToKmForm, draftToInput, emptyDraft, type CmToKmDraft } from './CmToKmForm';
import { CmToKmResults } from './CmToKmResults';
import {
  EXTRA_LENGTH_UNITS,
  type CmToKmFieldErrors,
  type CmToKmResult,
  type ExtraLengthUnit,
} from './types';
import { validateCmToKm } from './validation';

function syncDraftFromResult(draft: CmToKmDraft, result: CmToKmResult): CmToKmDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraLengthUnit, string>>;
  for (const unit of EXTRA_LENGTH_UNITS) {
    if (draft.source === unit) continue;
    extras[unit] = formatLength(result.values[unit]);
  }

  return {
    ...draft,
    centimeters:
      draft.source === 'cm' ? draft.centimeters : formatLength(result.centimeters),
    kilometers:
      draft.source === 'km' ? draft.kilometers : formatLength(result.kilometers),
    extras,
  };
}

function clearNonSource(draft: CmToKmDraft): CmToKmDraft {
  if (draft.source === 'cm') {
    return { ...draft, kilometers: '', extras: {} };
  }
  if (draft.source === 'km') {
    return { ...draft, centimeters: '', extras: {} };
  }
  return {
    ...draft,
    centimeters: '',
    kilometers: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

export function CmToKmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CmToKmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CmToKmFieldErrors>({});
  const [result, setResult] = React.useState<CmToKmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CmToKmDraft) => {
    const input = draftToInput(next);
    const validation = validateCmToKm(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(input.value === null ? clearNonSource(next) : next);
      return;
    }
    const nextResult = calculateCmToKm(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 km = 100,000 cm exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CmToKmForm
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
          <CmToKmResults
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
        </CmToKmForm>
      </div>
    </section>
  );
}
