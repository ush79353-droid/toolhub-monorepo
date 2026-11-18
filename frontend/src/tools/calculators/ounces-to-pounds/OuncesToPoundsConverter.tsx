'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateOuncesToPounds,
  formatMass,
  OUNCES_PER_POUND,
  shareResultText,
  type OuncesToPoundsResult,
} from './calculation';
import {
  OuncesToPoundsForm,
  draftToInput,
  emptyDraft,
  type OuncesToPoundsDraft,
} from './OuncesToPoundsForm';
import { OuncesToPoundsResults } from './OuncesToPoundsResults';
import { DEFAULT_OUNCES_TO_POUNDS_INPUT, type OuncesToPoundsFieldErrors } from './types';
import { isIncompleteNumber, validateOuncesToPounds } from './validation';

function syncDraftFromResult(
  draft: OuncesToPoundsDraft,
  result: OuncesToPoundsResult,
): OuncesToPoundsDraft {
  if (draft.source === 'oz') {
    return { ...draft, lb: formatMass(result.lb), kg: formatMass(result.kg) };
  }
  if (draft.source === 'lb') {
    return { ...draft, oz: formatMass(result.oz), kg: formatMass(result.kg) };
  }
  return { ...draft, oz: formatMass(result.oz), lb: formatMass(result.lb) };
}

function clearOthers(draft: OuncesToPoundsDraft): OuncesToPoundsDraft {
  if (draft.source === 'oz') return { ...draft, lb: '', kg: '' };
  if (draft.source === 'lb') return { ...draft, oz: '', kg: '' };
  return { ...draft, oz: '', lb: '' };
}

function initialDraft(): OuncesToPoundsDraft {
  const initial = calculateOuncesToPounds(DEFAULT_OUNCES_TO_POUNDS_INPUT);
  return {
    source: 'oz',
    oz: formatMass(initial.oz),
    lb: formatMass(initial.lb),
    kg: formatMass(initial.kg),
  };
}

export function OuncesToPoundsConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<OuncesToPoundsDraft>(initialDraft);
  const [errors, setErrors] = React.useState<OuncesToPoundsFieldErrors>({});
  const [result, setResult] = React.useState<OuncesToPoundsResult | null>(() =>
    calculateOuncesToPounds(DEFAULT_OUNCES_TO_POUNDS_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: OuncesToPoundsDraft) => {
    const sourceRaw =
      next.source === 'oz' ? next.oz : next.source === 'lb' ? next.lb : next.kg;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOthers(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateOuncesToPounds(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateOuncesToPounds(input);
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
            1 lb = {OUNCES_PER_POUND} oz (avoirdupois)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <OuncesToPoundsForm
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
            setResult(calculateOuncesToPounds(DEFAULT_OUNCES_TO_POUNDS_INPUT));
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
          <OuncesToPoundsResults
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
        </OuncesToPoundsForm>
      </div>
    </section>
  );
}
