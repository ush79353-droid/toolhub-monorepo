'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { QuartersDollarsField, QuartersToDollarsFieldErrors } from './types';
import {
  breakdownFromCents,
  formatDollarsDisplay,
  quartersToCents,
  shareResultText,
  type QuarterBreakdown,
} from './calculation';
import {
  QuartersToDollarsForm,
  defaultDraft,
  emptyDraft,
  type QuartersToDollarsDraft,
} from './QuartersToDollarsForm';
import { QuartersToDollarsResults } from './QuartersToDollarsResults';
import { parseDollarsInput, parseQuartersInput } from './validation';

function draftFromBreakdown(
  breakdown: QuarterBreakdown,
  preserve: { field: QuartersDollarsField; text: string } | null,
): QuartersToDollarsDraft {
  return {
    quarters: preserve?.field === 'quarters' ? preserve.text : breakdown.quartersDisplay,
    dollars: preserve?.field === 'dollars' ? preserve.text : formatDollarsDisplay(breakdown.cents),
    activeField: preserve?.field ?? null,
  };
}

export function QuartersToDollarsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<QuartersToDollarsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<QuartersToDollarsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const breakdownRef = React.useRef<QuarterBreakdown | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: QuartersToDollarsDraft) => {
    const field = next.activeField ?? 'quarters';
    const source = next[field];

    if (field === 'quarters') {
      const parsed = parseQuartersInput(source);
      if (parsed.blank) {
        breakdownRef.current = null;
        setDraft({ quarters: source, dollars: '', activeField: field });
        setErrors({});
        setHasResult(false);
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        return;
      }
      if (parsed.quarters == null) {
        setDraft(next);
        setErrors({
          quarters: parsed.error ?? 'Enter a valid non-negative whole number of quarters.',
        });
        setHasResult(false);
        breakdownRef.current = null;
        return;
      }
      const breakdown = breakdownFromCents(quartersToCents(parsed.quarters));
      breakdownRef.current = breakdown;
      setDraft(draftFromBreakdown(breakdown, { field, text: source }));
      setErrors({});
      setHasResult(true);
      return;
    }

    const parsed = parseDollarsInput(source);
    if (parsed.blank) {
      breakdownRef.current = null;
      setDraft({ quarters: '', dollars: source, activeField: field });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.cents == null) {
      setDraft(next);
      setErrors({ dollars: parsed.error ?? 'Enter a valid non-negative dollar amount.' });
      setHasResult(false);
      breakdownRef.current = null;
      return;
    }

    const breakdown = breakdownFromCents(parsed.cents);
    breakdownRef.current = breakdown;
    setDraft(draftFromBreakdown(breakdown, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    breakdownRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const breakdown = hasResult ? breakdownRef.current : null;
  const payload = breakdown ? shareResultText(breakdown) : '';

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
            Quarters · dollars · 1 quarter = $0.25
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <QuartersToDollarsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'quarters' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <QuartersToDollarsResults
            breakdown={breakdown}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
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
        </QuartersToDollarsForm>
      </div>
    </section>
  );
}
