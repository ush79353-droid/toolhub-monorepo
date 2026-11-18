'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateInchToMeter, formatLength, shareResultText } from './calculation';
import {
  InchToMeterForm,
  draftToInput,
  emptyDraft,
  type InchToMeterDraft,
} from './InchToMeterForm';
import { InchToMeterResults } from './InchToMeterResults';
import type { InchToMeterFieldErrors, InchToMeterResult } from './types';
import { isIncompleteNumber, validateInchToMeter } from './validation';

function syncDraftFromResult(draft: InchToMeterDraft, result: InchToMeterResult): InchToMeterDraft {
  if (draft.source === 'inches') {
    return {
      ...draft,
      meters: formatLength(result.meters),
      feetPart: formatLength(result.feetPart),
      inchesPart: formatLength(result.inchesPart),
    };
  }
  if (draft.source === 'meters') {
    return {
      ...draft,
      inches: formatLength(result.inches),
      feetPart: formatLength(result.feetPart),
      inchesPart: formatLength(result.inchesPart),
    };
  }
  // Preserve raw feet/inches while typing; result.mixedLabel holds the normalized form.
  return {
    ...draft,
    inches: formatLength(result.inches),
    meters: formatLength(result.meters),
  };
}

function clearNonSource(draft: InchToMeterDraft): InchToMeterDraft {
  if (draft.source === 'inches') {
    return { ...draft, meters: '', feetPart: '', inchesPart: '' };
  }
  if (draft.source === 'meters') {
    return { ...draft, inches: '', feetPart: '', inchesPart: '' };
  }
  return { ...draft, inches: '', meters: '' };
}

function sourceIncomplete(draft: InchToMeterDraft): boolean {
  if (draft.source === 'feetInches') {
    const ft = draft.feetPart.trim().replace(/,/g, '');
    const inch = draft.inchesPart.trim().replace(/,/g, '');
    if (ft === '' && inch === '') return true;
    if (ft !== '' && isIncompleteNumber(ft)) return true;
    if (inch !== '' && isIncompleteNumber(inch)) return true;
    return false;
  }
  const raw = (draft.source === 'inches' ? draft.inches : draft.meters).trim().replace(/,/g, '');
  return raw === '' || isIncompleteNumber(raw);
}

export function InchToMeterCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<InchToMeterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<InchToMeterFieldErrors>({});
  const [result, setResult] = React.useState<InchToMeterResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: InchToMeterDraft) => {
    if (sourceIncomplete(next)) {
      setErrors({});
      setResult(null);
      setDraft(clearNonSource(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateInchToMeter(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateInchToMeter(input);
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
          <p className="text-xs font-normal text-muted-foreground">1 in = 0.0254 m exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <InchToMeterForm
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
          <InchToMeterResults
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
        </InchToMeterForm>
      </div>
    </section>
  );
}
