'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { calculateLotSizeToSqft, formatMeasure, shareResultText } from './calculation';
import {
  LotSizeToSqftForm,
  draftToInput,
  emptyDraft,
  inputToDraft,
  type LotSizeToSqftDraft,
} from './LotSizeToSqftForm';
import { LotSizeToSqftResults } from './LotSizeToSqftResults';
import {
  DEFAULT_LOT_SIZE_TO_SQFT_INPUT,
  type LotSizeToSqftFieldErrors,
  type LotSizeToSqftResult,
} from './types';
import { validateLotSizeToSqft } from './validation';

function syncDraftFromResult(
  draft: LotSizeToSqftDraft,
  result: LotSizeToSqftResult,
): LotSizeToSqftDraft {
  if (draft.source === 'dimensions') {
    return { ...draft, area: formatMeasure(result.area).replace(/,/g, '') };
  }
  if (draft.source === 'solveLength') {
    return { ...draft, length: formatMeasure(result.length).replace(/,/g, '') };
  }
  return { ...draft, width: formatMeasure(result.width).replace(/,/g, '') };
}

function initialDraft(): LotSizeToSqftDraft {
  const initial = calculateLotSizeToSqft(DEFAULT_LOT_SIZE_TO_SQFT_INPUT);
  return {
    ...inputToDraft(DEFAULT_LOT_SIZE_TO_SQFT_INPUT),
    width: formatMeasure(initial.width).replace(/,/g, ''),
    length: formatMeasure(initial.length).replace(/,/g, ''),
    area: formatMeasure(initial.area).replace(/,/g, ''),
  };
}

export function LotSizeToSqftCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LotSizeToSqftDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LotSizeToSqftFieldErrors>({});
  const [result, setResult] = React.useState<LotSizeToSqftResult | null>(() =>
    calculateLotSizeToSqft(DEFAULT_LOT_SIZE_TO_SQFT_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LotSizeToSqftDraft) => {
    const input = draftToInput(next);
    const validation = validateLotSizeToSqft(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    try {
      const nextResult = calculateLotSizeToSqft(input);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
    } catch {
      setResult(null);
      setDraft(next);
    }
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
            Rectangular lot → square feet
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="lot-sqft-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="lot-sqft-currency"
              aria-label="Display currency"
              value={draft.currency}
              onChange={(currency) => {
                const next = { ...draft, currency };
                setDraft(next);
                evaluate(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LotSizeToSqftForm
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
            setResult(calculateLotSizeToSqft(DEFAULT_LOT_SIZE_TO_SQFT_INPUT));
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft(draft.currency));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        >
          <LotSizeToSqftResults
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
        </LotSizeToSqftForm>
      </div>
    </section>
  );
}
