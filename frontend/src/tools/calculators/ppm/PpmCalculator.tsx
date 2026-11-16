'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromRatio, formatPpm, shareResultText } from './calculation';
import { emptyDraft, PpmForm, type PpmDraft } from './PpmForm';
import { PpmResults } from './PpmResults';
import {
  PPM_UNITS,
  PPM_UNIT_SYMBOLS,
  type PpmFieldErrors,
  type PpmUnit,
} from './types';
import { parsePpmInput, ratioFromUnit } from './validation';

function draftFromRatio(
  ratio: number,
  preserve: { field: PpmUnit; text: string } | null,
): PpmDraft {
  const amounts = allFromRatio(ratio);
  const texts = {} as Record<PpmUnit, string>;
  for (const unit of PPM_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatPpm(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null };
}

export function PpmCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PpmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<PpmFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const ratioRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<PpmUnit>('ppm');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PpmDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parsePpmInput(source);
    if (parsed.blank) {
      ratioRef.current = null;
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
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      ratioRef.current = null;
      return;
    }

    const converted = ratioFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      ratioRef.current = null;
      return;
    }

    ratioRef.current = converted.ratio;
    sourceRef.current = field;
    setDraft(draftFromRatio(converted.ratio, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    ratioRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const ratio = ratioRef.current;
  const summaryLines =
    hasResult && ratio != null
      ? PPM_UNITS.map((unit) => {
          const amounts = allFromRatio(ratio);
          const symbol = PPM_UNIT_SYMBOLS[unit];
          return symbol
            ? `${formatPpm(amounts[unit])} ${symbol}`
            : formatPpm(amounts[unit]);
        })
      : null;
  const payload =
    hasResult && ratio != null ? shareResultText(ratio, sourceRef.current) : '';
  const exceedsHundredPercent = hasResult && ratio != null && ratio > 1;

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">PPM Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Ratio · % · ‰ · ppm · ppb · ppt
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PpmForm
          draft={draft}
          errors={errors}
          exceedsHundredPercent={exceedsHundredPercent}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'ppm' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <PpmResults
            summaryLines={summaryLines}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
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
              if (!payload) return;
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
        </PpmForm>
      </div>
    </section>
  );
}
