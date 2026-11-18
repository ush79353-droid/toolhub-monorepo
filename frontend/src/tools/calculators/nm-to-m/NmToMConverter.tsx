'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateNmToM,
  formatLength,
  NANOMETERS_PER_METER,
  shareResultText,
  type NmToMResult,
} from './calculation';
import { NmToMForm, draftToInput, emptyDraft, type NmToMDraft } from './NmToMForm';
import { NmToMResults } from './NmToMResults';
import { DEFAULT_NM_TO_M_INPUT, type NmToMFieldErrors } from './types';
import { isIncompleteNumber, validateNmToM } from './validation';

function syncDraftFromResult(draft: NmToMDraft, result: NmToMResult): NmToMDraft {
  if (draft.source === 'nm') {
    return { ...draft, m: formatLength(result.m) };
  }
  return { ...draft, nm: formatLength(result.nm) };
}

function clearOpposite(draft: NmToMDraft): NmToMDraft {
  if (draft.source === 'nm') return { ...draft, m: '' };
  return { ...draft, nm: '' };
}

function initialDraft(): NmToMDraft {
  const initial = calculateNmToM(DEFAULT_NM_TO_M_INPUT);
  return {
    source: 'nm',
    nm: formatLength(initial.nm),
    m: formatLength(initial.m),
  };
}

export function NmToMConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NmToMDraft>(initialDraft);
  const [errors, setErrors] = React.useState<NmToMFieldErrors>({});
  const [result, setResult] = React.useState<NmToMResult | null>(() =>
    calculateNmToM(DEFAULT_NM_TO_M_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: NmToMDraft) => {
    const sourceRaw = next.source === 'nm' ? next.nm : next.m;
    if (sourceRaw.trim() === '' || isIncompleteNumber(sourceRaw.trim().replace(/,/g, ''))) {
      setErrors({});
      setResult(null);
      setDraft(clearOpposite(next));
      return;
    }

    const input = draftToInput(next);
    const validation = validateNmToM(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setResult(null);
      setDraft(next);
      return;
    }
    const nextResult = calculateNmToM(input);
    setResult(nextResult);
    setDraft(syncDraftFromResult(next, nextResult));
  };

  const payload = result ? shareResultText(result) : '';
  const billion = NANOMETERS_PER_METER.toLocaleString('en-US');

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
            1 nm = 10⁻⁹ m · 1 m = {billion} nm
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NmToMForm
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
            setResult(calculateNmToM(DEFAULT_NM_TO_M_INPUT));
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
          <NmToMResults
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
        </NmToMForm>
      </div>
    </section>
  );
}
