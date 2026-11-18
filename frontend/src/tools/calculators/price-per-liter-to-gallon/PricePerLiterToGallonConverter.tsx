'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculatePricePerLiterToGallon,
  formatPrice,
  shareResultText,
} from './calculation';
import {
  PricePerLiterToGallonForm,
  draftToInput,
  emptyDraft,
  type PricePerLiterToGallonDraft,
} from './PricePerLiterToGallonForm';
import { PricePerLiterToGallonResults } from './PricePerLiterToGallonResults';
import {
  LITERS_PER_GALLON,
  type GallonSystem,
  type PricePerLiterToGallonFieldErrors,
  type PricePerLiterToGallonResult,
} from './types';
import { isIncompleteNumber, validatePricePerLiterToGallon } from './validation';

function syncDraftFromResult(
  draft: PricePerLiterToGallonDraft,
  result: PricePerLiterToGallonResult,
): PricePerLiterToGallonDraft {
  if (draft.source === 'perLiter') {
    return { ...draft, pricePerGallon: formatPrice(result.pricePerGallon) };
  }
  return { ...draft, pricePerLiter: formatPrice(result.pricePerLiter) };
}

function clearOpposite(draft: PricePerLiterToGallonDraft): PricePerLiterToGallonDraft {
  if (draft.source === 'perLiter') return { ...draft, pricePerGallon: '' };
  return { ...draft, pricePerLiter: '' };
}

export function PricePerLiterToGallonConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PricePerLiterToGallonDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PricePerLiterToGallonFieldErrors>({});
  const [result, setResult] = React.useState<PricePerLiterToGallonResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PricePerLiterToGallonDraft) => {
    if (
      next.pricePerLiter === draft.pricePerLiter &&
      next.pricePerGallon === draft.pricePerGallon &&
      next.source === draft.source &&
      next.gallonSystem === draft.gallonSystem &&
      next.currency === draft.currency &&
      next.detailsOpen !== draft.detailsOpen
    ) {
      setDraft(next);
      return;
    }

    const sourceRaw =
      next.source === 'perLiter' ? next.pricePerLiter : next.pricePerGallon;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validatePricePerLiterToGallon(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculatePricePerLiterToGallon(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const changeGallonSystem = (system: GallonSystem) => {
    const next = { ...draft, gallonSystem: system };
    const sourceRaw =
      next.source === 'perLiter' ? next.pricePerLiter : next.pricePerGallon;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setDraft(next);
      return;
    }
    evaluate(next);
  };

  const changeCurrency = (currency: SupportedCurrency) => {
    // Denomination only — keep numbers, refresh result labels.
    const next = { ...draft, currency };
    if (result) {
      setResult({ ...result, currency });
    }
    setDraft(next);
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
            1 US gal = {LITERS_PER_GALLON.us} L · 1 imp gal = {LITERS_PER_GALLON.imperial} L
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PricePerLiterToGallonForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onGallonSystemChange={changeGallonSystem}
          onCurrencyChange={changeCurrency}
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
            setDraft({
              ...emptyDraft(),
              detailsOpen: draft.detailsOpen,
              gallonSystem: draft.gallonSystem,
              currency: draft.currency,
            });
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <PricePerLiterToGallonResults
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
        </PricePerLiterToGallonForm>
      </div>
    </section>
  );
}
