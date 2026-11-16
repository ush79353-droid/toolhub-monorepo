'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { PenniesDollarsField, PenniesToDollarsFieldErrors } from './types';
import {
  formatDollarsCurrency,
  formatDollarsDisplay,
  formatPenniesDisplay,
  shareResultText,
} from './calculation';
import {
  emptyDraft,
  PenniesToDollarsForm,
  type PenniesToDollarsDraft,
} from './PenniesToDollarsForm';
import { PenniesToDollarsResults } from './PenniesToDollarsResults';
import { parseDollarsInput, parsePenniesInput } from './validation';

function draftFromPennies(
  pennies: bigint,
  preserve: { field: PenniesDollarsField; text: string } | null,
): PenniesToDollarsDraft {
  return {
    pennies: preserve?.field === 'pennies' ? preserve.text : formatPenniesDisplay(pennies),
    dollars: preserve?.field === 'dollars' ? preserve.text : formatDollarsDisplay(pennies),
    activeField: preserve?.field ?? null,
  };
}

export function PenniesToDollarsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PenniesToDollarsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PenniesToDollarsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const penniesRef = React.useRef<bigint | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PenniesToDollarsDraft) => {
    const field = next.activeField ?? 'pennies';
    const source = next[field];
    const parsed = field === 'pennies' ? parsePenniesInput(source) : parseDollarsInput(source);

    if (parsed.blank) {
      penniesRef.current = null;
      setDraft({
        pennies: field === 'pennies' ? source : '',
        dollars: field === 'dollars' ? source : '',
        activeField: field,
      });
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.pennies == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid amount.' });
      setHasResult(false);
      penniesRef.current = null;
      return;
    }

    penniesRef.current = parsed.pennies;
    setDraft(draftFromPennies(parsed.pennies, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    penniesRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const pennies = penniesRef.current;
  const shownPennies = hasResult && pennies != null ? formatPenniesDisplay(pennies) : null;
  const shownDollars = hasResult && pennies != null ? formatDollarsCurrency(pennies) : null;
  const payload = hasResult && pennies != null ? shareResultText(pennies) : '';

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
            Pennies · dollars · 100 ¢ = $1
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PenniesToDollarsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'pennies' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <PenniesToDollarsResults
            pennies={shownPennies}
            dollars={shownDollars}
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
        </PenniesToDollarsForm>
      </div>
    </section>
  );
}
