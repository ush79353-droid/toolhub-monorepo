'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateFootToCm, formatLength, shareResultText } from './calculation';
import {
  FootToCmForm,
  draftToInput,
  emptyDraft,
  type FootToCmDraft,
} from './FootToCmForm';
import { FootToCmResults } from './FootToCmResults';
import {
  EXTRA_LENGTH_UNITS,
  type ExtraLengthUnit,
  type FootToCmFieldErrors,
  type FootToCmResult,
} from './types';
import { validateFootToCm } from './validation';

function syncDraftFromResult(draft: FootToCmDraft, result: FootToCmResult): FootToCmDraft {
  const extras = { ...draft.extras } as Partial<Record<ExtraLengthUnit, string>>;
  for (const unit of EXTRA_LENGTH_UNITS) {
    if (draft.source === unit) continue;
    extras[unit] = formatLength(result.extras[unit]);
  }

  return {
    ...draft,
    feet: draft.source === 'feet' ? draft.feet : formatLength(result.feet),
    centimeters:
      draft.source === 'centimeters' ? draft.centimeters : formatLength(result.centimeters),
    extras,
  };
}

function clearNonSource(draft: FootToCmDraft): FootToCmDraft {
  if (draft.source === 'feet') {
    return { ...draft, centimeters: '', extras: {} };
  }
  if (draft.source === 'centimeters') {
    return { ...draft, feet: '', extras: {} };
  }
  return {
    ...draft,
    feet: '',
    centimeters: '',
    extras: { [draft.source]: draft.extras[draft.source] },
  };
}

export function FootToCentimeterConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<FootToCmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<FootToCmFieldErrors>({});
  const [result, setResult] = React.useState<FootToCmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: FootToCmDraft) => {
    if (
      next.feet === draft.feet &&
      next.centimeters === draft.centimeters &&
      next.source === draft.source &&
      JSON.stringify(next.extras) === JSON.stringify(draft.extras) &&
      next.moreOpen !== draft.moreOpen
    ) {
      setDraft(next);
      return;
    }

    const input = draftToInput(next);
    const validation = validateFootToCm(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(input.value === null ? clearNonSource(next) : next);
      return;
    }
    const nextResult = calculateFootToCm(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 ft = 30.48 cm exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <FootToCmForm
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
          <FootToCmResults
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
        </FootToCmForm>
      </div>
    </section>
  );
}
