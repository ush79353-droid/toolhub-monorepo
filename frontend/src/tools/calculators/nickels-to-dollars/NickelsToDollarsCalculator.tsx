'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { NickelsDollarsField, NickelsToDollarsFieldErrors } from './types';
import {
  breakdownFromCents,
  formatDollarsDisplay,
  nickelsToCents,
  shareResultText,
  type NickelBreakdown,
} from './calculation';
import {
  NickelsToDollarsForm,
  defaultDraft,
  emptyDraft,
  type NickelsToDollarsDraft,
} from './NickelsToDollarsForm';
import { NickelsToDollarsResults } from './NickelsToDollarsResults';
import { parseDollarsInput, parseNickelsInput } from './validation';

function draftFromBreakdown(
  breakdown: NickelBreakdown,
  preserve: { field: NickelsDollarsField; text: string } | null,
): NickelsToDollarsDraft {
  return {
    nickels: preserve?.field === 'nickels' ? preserve.text : breakdown.nickelsDisplay,
    dollars: preserve?.field === 'dollars' ? preserve.text : formatDollarsDisplay(breakdown.cents),
    activeField: preserve?.field ?? null,
  };
}

export function NickelsToDollarsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<NickelsToDollarsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<NickelsToDollarsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const breakdownRef = React.useRef<NickelBreakdown | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: NickelsToDollarsDraft) => {
    const field = next.activeField ?? 'nickels';
    const source = next[field];

    if (field === 'nickels') {
      const parsed = parseNickelsInput(source);
      if (parsed.blank) {
        breakdownRef.current = null;
        setDraft({ nickels: source, dollars: '', activeField: field });
        setErrors({});
        setHasResult(false);
        return;
      }
      if (parsed.incomplete) {
        setDraft(next);
        setErrors({});
        return;
      }
      if (parsed.nickels == null) {
        setDraft(next);
        setErrors({ nickels: parsed.error ?? 'Enter a valid nickel count.' });
        setHasResult(false);
        breakdownRef.current = null;
        return;
      }
      const breakdown = breakdownFromCents(nickelsToCents(parsed.nickels));
      breakdownRef.current = breakdown;
      setDraft(draftFromBreakdown(breakdown, { field, text: source }));
      setErrors({});
      setHasResult(true);
      return;
    }

    const parsed = parseDollarsInput(source);
    if (parsed.blank) {
      breakdownRef.current = null;
      setDraft({ nickels: '', dollars: source, activeField: field });
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
      setErrors({ dollars: parsed.error ?? 'Enter a valid dollar amount.' });
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
            Nickels · dollars · 1 nickel = $0.05
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <NickelsToDollarsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'nickels' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <NickelsToDollarsResults
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
        </NickelsToDollarsForm>
      </div>
    </section>
  );
}
