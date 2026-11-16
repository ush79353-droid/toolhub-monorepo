'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateBarToPsig, formatPressure, shareResultText } from './calculation';
import { BarToPsigForm, draftToInput, emptyDraft, type BarToPsigDraft } from './BarToPsigForm';
import { BarToPsigResults } from './BarToPsigResults';
import {
  DEFAULT_BAR_TO_PSIG_INPUT,
  PSI_PER_BAR,
  STANDARD_ATMOSPHERIC_BAR,
  type BarToPsigFieldErrors,
  type BarToPsigResult,
} from './types';
import { validateBarToPsig } from './validation';

function syncDraftFromResult(draft: BarToPsigDraft, result: BarToPsigResult): BarToPsigDraft {
  if (draft.source === 'bar') {
    return { ...draft, psig: formatPressure(result.psig) };
  }
  return { ...draft, bar: formatPressure(result.bar) };
}

function initialDraft(): BarToPsigDraft {
  const initial = calculateBarToPsig(DEFAULT_BAR_TO_PSIG_INPUT);
  return {
    source: 'bar',
    bar: formatPressure(initial.bar),
    psig: formatPressure(initial.psig),
    reference: 'absolute',
    atmosphericBar: String(STANDARD_ATMOSPHERIC_BAR),
  };
}

export function BarToPsigConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BarToPsigDraft>(initialDraft);
  const [errors, setErrors] = React.useState<BarToPsigFieldErrors>({});
  const [result, setResult] = React.useState<BarToPsigResult | null>(() =>
    calculateBarToPsig(DEFAULT_BAR_TO_PSIG_INPUT),
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: BarToPsigDraft) => {
    const input = draftToInput(next);
    const validation = validateBarToPsig(input);
    setErrors(validation.errors);
    if (!validation.isValid) {
      setDraft(next);
      setResult(null);
      return;
    }
    const nextResult = calculateBarToPsig(input);
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
            1 bar ≈ {PSI_PER_BAR} psi (gauge difference)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <BarToPsigForm
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
            setResult(calculateBarToPsig(DEFAULT_BAR_TO_PSIG_INPUT));
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
          <BarToPsigResults
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
        </BarToPsigForm>
      </div>
    </section>
  );
}
