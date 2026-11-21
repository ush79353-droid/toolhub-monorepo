'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildGematriaBundle } from './calculation';
import {
  GematriaForm,
  defaultDraft,
  emptyDraft,
  type GematriaDraft,
} from './GematriaForm';
import { GematriaResults } from './GematriaResults';
import type { GematriaBundle } from './types';
import { normalizeGematriaInput } from './validation';

function summaryText(bundle: GematriaBundle): string {
  const lines = [
    'Gematria Calculator | Omega Calculators',
    '',
    `Text: ${bundle.inputDisplay}`,
    '',
  ];
  if (bundle.activeJewish && bundle.activeJewish.countedCount > 0) {
    const label =
      bundle.activeJewish.system === 'hebrew-standard'
        ? 'Hebrew Standard Gematria'
        : 'English Jewish Gematria';
    lines.push(`${label}: ${bundle.activeJewish.total}`);
  }
  if (bundle.english && bundle.english.countedCount > 0) {
    lines.push(`English Gematria: ${bundle.english.total}`);
  }
  if (bundle.simple && bundle.simple.countedCount > 0) {
    lines.push(`Simple Gematria: ${bundle.simple.total}`);
  }
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function GematriaCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GematriaDraft>(defaultDraft);
  const [error, setError] = React.useState<string | undefined>();
  const [bundle, setBundle] = React.useState<GematriaBundle | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: GematriaDraft) => {
    const parsed = normalizeGematriaInput(next.text);
    const draftNext = { ...next, text: parsed.truncated ? parsed.value : next.text };
    setDraft(draftNext);
    setError(parsed.error);

    if (parsed.blank) {
      setBundle(null);
      return;
    }

    setBundle(buildGematriaBundle(parsed.value, draftNext.jewishMode));
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4) => {
      const examples: Record<1 | 2 | 3 | 4, string> = {
        1: 'CAT',
        2: 'HELLO',
        3: 'שלום',
        4: 'ABC',
      };
      evaluate({
        ...draft,
        text: examples[id],
        jewishMode: 'auto',
        breakdownOpen: true,
      });
    },
    [draft, evaluate]
  );

  const sharePayload = bundle ? summaryText(bundle) : '';
  const canCopyShare = Boolean(
    bundle &&
      ((bundle.activeJewish && bundle.activeJewish.countedCount > 0) ||
        (bundle.simple && bundle.simple.countedCount > 0) ||
        (bundle.english && bundle.english.countedCount > 0))
  );

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
            Simple · English ×6 · Jewish / Hebrew
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GematriaForm
          draft={draft}
          error={error}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(defaultDraft());
            setError(undefined);
            setBundle(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setError(undefined);
            setBundle(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        >
          <GematriaResults
            bundle={bundle}
            breakdownOpen={draft.breakdownOpen}
            copied={copied}
            shared={shared}
            canShare={canShare && canCopyShare}
            onCopy={() => {
              if (!canCopyShare || !bundle) return;
              void copyTextToClipboard(sharePayload).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!canCopyShare || !bundle || typeof navigator.share !== 'function') return;
              void navigator
                .share({
                  title: metadata.title,
                  text: sharePayload,
                  url: typeof window !== 'undefined' ? window.location.href : undefined,
                })
                .then(() => {
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                })
                .catch(() => {
                  void copyTextToClipboard(sharePayload).then((ok) => {
                    if (!ok) return;
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  });
                });
            }}
          />
        </GematriaForm>
      </div>
    </section>
  );
}
