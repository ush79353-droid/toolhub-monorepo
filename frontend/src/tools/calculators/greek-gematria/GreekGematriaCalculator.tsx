'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateGreekGematria,
  formatGreekGematriaBreakdown,
} from './calculation';
import {
  GreekGematriaForm,
  defaultDraft,
  emptyDraft,
  type GreekGematriaDraft,
} from './GreekGematriaForm';
import { GreekGematriaResults } from './GreekGematriaResults';
import type { GreekGematriaResult } from './types';
import { normalizeGreekGematriaInput } from './validation';

function summaryText(result: GreekGematriaResult): string {
  const lines = [
    'Greek Gematria Calculator',
    'Omega Calculators',
    '',
    `Text: ${result.originalText}`,
    `Greek Gematria Value: ${result.total}`,
    `Letters Counted: ${result.letterCount}`,
    '',
    `Breakdown:`,
    formatGreekGematriaBreakdown(result),
  ];
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.join('\n');
}

export function GreekGematriaCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<GreekGematriaDraft>(defaultDraft);
  const [error, setError] = React.useState<string | undefined>();
  const [result, setResult] = React.useState<GreekGematriaResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: GreekGematriaDraft) => {
    const parsed = normalizeGreekGematriaInput(next.text);
    const draftNext = { ...next, text: parsed.truncated ? parsed.value : next.text };
    setDraft(draftNext);
    setError(parsed.error);

    if (parsed.blank) {
      setResult(null);
      return;
    }

    try {
      setResult(calculateGreekGematria(parsed.value));
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Unable to calculate Greek gematria.');
    }
  }, []);

  const applyExample = React.useCallback(
    (id: 1 | 2 | 3 | 4 | 5) => {
      const examples: Record<1 | 2 | 3 | 4 | 5, string> = {
        1: 'ΑΛΦΑ',
        2: 'ΛΟΓΟΣ',
        3: 'ΙΗΣΟΥΣ',
        4: 'λόγος',
        5: 'σος',
      };
      evaluate({
        ...draft,
        text: examples[id],
        stepsOpen: true,
      });
    },
    [draft, evaluate]
  );

  const canCopyShare = Boolean(result && result.letterCount > 0);
  const sharePayload = result && canCopyShare ? summaryText(result) : '';

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
            Greek isopsephy · traditional letter values
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <GreekGematriaForm
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
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setError(undefined);
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        >
          <GreekGematriaResults
            result={result}
            stepsOpen={draft.stepsOpen}
            onToggleSteps={() =>
              evaluate({ ...draft, stepsOpen: !draft.stepsOpen })
            }
            copied={copied}
            shared={shared}
            canShare={canShare && canCopyShare}
            onCopy={() => {
              if (!canCopyShare) return;
              void copyTextToClipboard(sharePayload).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!canCopyShare || typeof navigator.share !== 'function') return;
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
        </GreekGematriaForm>
      </div>
    </section>
  );
}
