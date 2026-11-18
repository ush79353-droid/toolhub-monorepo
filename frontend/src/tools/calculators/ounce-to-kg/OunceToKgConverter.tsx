'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateOunceToKg,
  formatMass,
  KG_PER_OUNCE,
  shareResultText,
  type OunceToKgResult,
} from './calculation';
import {
  OunceToKgForm,
  draftToInput,
  emptyDraft,
  type OunceToKgDraft,
} from './OunceToKgForm';
import { OunceToKgResults } from './OunceToKgResults';
import { DEFAULT_OUNCE_TO_KG_INPUT, type OunceToKgFieldErrors } from './types';
import { isIncompleteNumber, validateOunceToKg } from './validation';

function syncDraftFromResult(
  draft: OunceToKgDraft,
  result: OunceToKgResult,
): OunceToKgDraft {
  if (draft.source === 'oz') {
    return { ...draft, kg: formatMass(result.kg), lb: formatMass(result.lb) };
  }
  if (draft.source === 'kg') {
    return { ...draft, oz: formatMass(result.oz), lb: formatMass(result.lb) };
  }
  return { ...draft, oz: formatMass(result.oz), kg: formatMass(result.kg) };
}

function clearOthers(draft: OunceToKgDraft): OunceToKgDraft {
  if (draft.source === 'oz') return { ...draft, kg: '', lb: '' };
  if (draft.source === 'kg') return { ...draft, oz: '', lb: '' };
  return { ...draft, oz: '', kg: '' };
}

function initialDraft(): OunceToKgDraft {
  const initial = calculateOunceToKg(DEFAULT_OUNCE_TO_KG_INPUT);
  return {
    source: 'oz',
    oz: formatMass(initial.oz),
    kg: formatMass(initial.kg),
    lb: formatMass(initial.lb),
  };
}

export function OunceToKgConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<OunceToKgDraft>(initialDraft);
  const [errors, setErrors] = React.useState<OunceToKgFieldErrors>({});
  const [result, setResult] = React.useState<OunceToKgResult | null>(() =>
    calculateOunceToKg(DEFAULT_OUNCE_TO_KG_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: OunceToKgDraft) => {
    const sourceRaw =
      next.source === 'oz' ? next.oz : next.source === 'kg' ? next.kg : next.lb;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOthers(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateOunceToKg(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateOunceToKg(input);
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
            1 oz = {KG_PER_OUNCE} kg (avoirdupois)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <OunceToKgForm
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
            setResult(calculateOunceToKg(DEFAULT_OUNCE_TO_KG_INPUT));
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
          <OunceToKgResults
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
        </OunceToKgForm>
      </div>
    </section>
  );
}
