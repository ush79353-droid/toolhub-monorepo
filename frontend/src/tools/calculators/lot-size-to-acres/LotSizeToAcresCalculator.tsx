'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { calculateLotSizeToAcres, formatMeasure, shareResultText } from './calculation';
import {
  LotSizeToAcresForm,
  draftToInput,
  emptyDraft,
  inputToDraft,
  type LotSizeToAcresDraft,
} from './LotSizeToAcresForm';
import { LotSizeToAcresResults } from './LotSizeToAcresResults';
import {
  DEFAULT_LOT_SIZE_TO_ACRES_INPUT,
  type LotSizeToAcresFieldErrors,
  type LotSizeToAcresResult,
} from './types';
import { validateLotSizeToAcres } from './validation';

function syncDraftFromResult(
  draft: LotSizeToAcresDraft,
  result: LotSizeToAcresResult,
): LotSizeToAcresDraft {
  if (draft.source === 'dimensions') {
    return { ...draft, area: formatMeasure(result.area).replace(/,/g, '') };
  }
  if (draft.source === 'solveLength') {
    return { ...draft, length: formatMeasure(result.length).replace(/,/g, '') };
  }
  return { ...draft, width: formatMeasure(result.width).replace(/,/g, '') };
}

function initialDraft(): LotSizeToAcresDraft {
  const initial = calculateLotSizeToAcres(DEFAULT_LOT_SIZE_TO_ACRES_INPUT);
  return {
    ...inputToDraft(DEFAULT_LOT_SIZE_TO_ACRES_INPUT),
    width: formatMeasure(initial.width).replace(/,/g, ''),
    length: formatMeasure(initial.length).replace(/,/g, ''),
    area: formatMeasure(initial.area).replace(/,/g, ''),
  };
}

export function LotSizeToAcresCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LotSizeToAcresDraft>(initialDraft);
  const [errors, setErrors] = React.useState<LotSizeToAcresFieldErrors>({});
  const [result, setResult] = React.useState<LotSizeToAcresResult | null>(() =>
    calculateLotSizeToAcres(DEFAULT_LOT_SIZE_TO_ACRES_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: LotSizeToAcresDraft) => {
    const input = draftToInput(next);
    const validation = validateLotSizeToAcres(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    try {
      const nextResult = calculateLotSizeToAcres(input);
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
            Rectangular lot → acres
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="lot-size-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="lot-size-currency"
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
        <LotSizeToAcresForm
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
            setResult(calculateLotSizeToAcres(DEFAULT_LOT_SIZE_TO_ACRES_INPUT));
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
          <LotSizeToAcresResults
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
        </LotSizeToAcresForm>
      </div>
    </section>
  );
}
