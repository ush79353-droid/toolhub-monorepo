'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  PAPER_UNITS,
  PAPER_UNIT_LABELS,
  type PaperQuantityFieldErrors,
  type PaperUnit,
} from './types';
import { allFromSheets, formatPaperQty, shareResultText } from './calculation';
import { emptyDraft, PaperQuantityForm, type PaperQuantityDraft } from './PaperQuantityForm';
import { PaperQuantityResults } from './PaperQuantityResults';
import { parsePaperInput, sheetsFromUnit } from './validation';

function draftFromSheets(
  sheets: number,
  preserve: { field: PaperUnit; text: string } | null,
): PaperQuantityDraft {
  const amounts = allFromSheets(sheets);
  const texts = {} as Record<PaperUnit, string>;
  for (const unit of PAPER_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatPaperQty(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null };
}

export function PaperQuantityConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PaperQuantityDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PaperQuantityFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const sheetsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PaperQuantityDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parsePaperInput(source);
    if (parsed.blank) {
      sheetsRef.current = null;
      setDraft(emptyDraft());
      setErrors({});
      setHasResult(false);
      return;
    }
    if (parsed.incomplete) {
      setDraft(next);
      setErrors({});
      return;
    }
    if (parsed.value == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid quantity.' });
      setHasResult(false);
      sheetsRef.current = null;
      return;
    }

    const converted = sheetsFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      sheetsRef.current = null;
      return;
    }

    sheetsRef.current = converted.sheets;
    setDraft(draftFromSheets(converted.sheets, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    sheetsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const sheets = sheetsRef.current;
  const summaryLines =
    hasResult && sheets != null
      ? PAPER_UNITS.map((unit) => {
          const amounts = allFromSheets(sheets);
          return `${formatPaperQty(amounts[unit])} ${PAPER_UNIT_LABELS[unit]}`;
        })
      : null;
  const payload = hasResult && sheets != null ? shareResultText(sheets) : '';

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
            Sheets · quires · reams · bundles · bales
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PaperQuantityForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'sheets' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <PaperQuantityResults
            summaryLines={summaryLines}
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
        </PaperQuantityForm>
      </div>
    </section>
  );
}
