'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { DEFAULT_CENTS, type CentsDollarsField, type CentsToDollarsFieldErrors } from './types';
import {
  formatCentsDisplay,
  formatDollarsCurrency,
  formatDollarsDisplay,
  shareResultText,
} from './calculation';
import {
  CentsToDollarsForm,
  defaultDraft,
  emptyDraft,
  type CentsToDollarsDraft,
} from './CentsToDollarsForm';
import { CentsToDollarsResults } from './CentsToDollarsResults';
import { parseCentsInput, parseDollarsInput } from './validation';

function draftFromCents(
  cents: bigint,
  preserve: { field: CentsDollarsField; text: string } | null,
): CentsToDollarsDraft {
  return {
    cents: preserve?.field === 'cents' ? preserve.text : formatCentsDisplay(cents),
    dollars: preserve?.field === 'dollars' ? preserve.text : formatDollarsDisplay(cents),
    activeField: preserve?.field ?? null,
  };
}

export function CentsToDollarsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CentsToDollarsDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<CentsToDollarsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const centsRef = React.useRef<bigint | null>(BigInt(DEFAULT_CENTS));

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CentsToDollarsDraft) => {
    const field = next.activeField ?? 'cents';
    const source = next[field];
    const parsed = field === 'cents' ? parseCentsInput(source) : parseDollarsInput(source);

    if (parsed.blank) {
      centsRef.current = null;
      setDraft({
        cents: field === 'cents' ? source : '',
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
    if (parsed.cents == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid amount.' });
      setHasResult(false);
      centsRef.current = null;
      return;
    }

    centsRef.current = parsed.cents;
    setDraft(draftFromCents(parsed.cents, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      centsRef.current = BigInt(DEFAULT_CENTS);
      setDraft(defaultDraft());
      setHasResult(true);
    } else {
      centsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const cents = centsRef.current;
  const shownCents = hasResult && cents != null ? formatCentsDisplay(cents) : null;
  const shownDollars = hasResult && cents != null ? formatDollarsCurrency(cents) : null;
  const payload = hasResult && cents != null ? shareResultText(cents) : '';

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
            Cents · dollars · 100 ¢ = $1
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CentsToDollarsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'cents' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <CentsToDollarsResults
            cents={shownCents}
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
        </CentsToDollarsForm>
      </div>
    </section>
  );
}
