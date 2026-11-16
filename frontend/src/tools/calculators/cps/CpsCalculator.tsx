'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CPS_UNITS,
  CPS_UNIT_SYMBOLS,
  type CpsFieldErrors,
  type CpsUnit,
} from './types';
import { allFromCps, formatCps, shareResultText } from './calculation';
import { CpsForm, emptyDraft, type CpsDraft } from './CpsForm';
import { CpsResults } from './CpsResults';
import { cpsFromUnit, parseCpsInput } from './validation';

function draftFromCps(
  cps: number,
  preserve: { field: CpsUnit; text: string } | null,
): CpsDraft {
  const amounts = allFromCps(cps);
  const texts = {} as Record<CpsUnit, string>;
  for (const unit of CPS_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatCps(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null };
}

export function CpsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CpsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CpsFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const cpsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: CpsDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseCpsInput(source);
    if (parsed.blank) {
      cpsRef.current = null;
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
      setErrors({ [field]: parsed.error ?? 'Enter a valid frequency.' });
      setHasResult(false);
      cpsRef.current = null;
      return;
    }

    const converted = cpsFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      cpsRef.current = null;
      return;
    }

    cpsRef.current = converted.cps;
    setDraft(draftFromCps(converted.cps, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    cpsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const cps = cpsRef.current;
  const summaryLines =
    hasResult && cps != null
      ? CPS_UNITS.map((unit) => {
          const amounts = allFromCps(cps);
          return `${formatCps(amounts[unit])} ${CPS_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload = hasResult && cps != null ? shareResultText(cps) : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">CPS Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Frequency · RPM · angular speed
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CpsForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'cps' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <CpsResults
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
        </CpsForm>
      </div>
    </section>
  );
}
