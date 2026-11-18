'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromPixels,
  formatSize,
  shareResultText,
} from './calculation';
import {
  defaultDraft,
  emptyDraft,
  PxToEmForm,
  type PxToEmDraft,
} from './PxToEmForm';
import { PxToEmResults } from './PxToEmResults';
import {
  DEFAULT_BASE_PX,
  SIZE_UNITS,
  SIZE_UNIT_SYMBOLS,
  type PxToEmFieldErrors,
  type SizeUnit,
} from './types';
import { parseBaseInput, parseSizeInput, pixelsFromUnit } from './validation';

function draftFromPixels(
  px: number,
  basePx: number,
  baseText: string,
  preserve: { field: SizeUnit; text: string } | null,
): PxToEmDraft {
  const amounts = allFromPixels(px, basePx);
  const texts = {} as Record<SizeUnit, string>;
  for (const unit of SIZE_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatSize(amounts[unit]);
  }
  return {
    baseText,
    texts,
    activeField: preserve?.field ?? null,
  };
}

export function PxToEmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<PxToEmDraft>(defaultDraft);
  const [errors, setErrors] = React.useState<PxToEmFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const pixelsRef = React.useRef<number | null>(null);
  const baseRef = React.useRef<number>(DEFAULT_BASE_PX);
  const sourceRef = React.useRef<SizeUnit>('px');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: PxToEmDraft) => {
    const field = next.activeField;

    const baseParsed = parseBaseInput(next.baseText);
    if (field === 'base') {
      if (baseParsed.blank || baseParsed.incomplete) {
        setDraft(next);
        setErrors({});
        return;
      }
      if (baseParsed.value == null) {
        setDraft(next);
        setErrors({ base: baseParsed.error ?? 'Base font size must be greater than zero.' });
        return;
      }

      baseRef.current = baseParsed.value;

      // Recalculate from last conversion source if we have a result.
      if (hasResult && pixelsRef.current != null) {
        const source = sourceRef.current;
        const sourceText = next.texts[source];
        const sizeParsed = parseSizeInput(sourceText);
        if (sizeParsed.value != null) {
          const converted = pixelsFromUnit(sizeParsed.value, source, baseParsed.value);
          if (converted.ok) {
            pixelsRef.current = converted.px;
            setDraft(
              draftFromPixels(converted.px, baseParsed.value, next.baseText, {
                field: source,
                text: sourceText,
              }),
            );
            setErrors({});
            setHasResult(true);
            return;
          }
        }
      }

      setDraft(next);
      setErrors({});
      return;
    }

    if (!field) {
      setDraft(next);
      return;
    }

    if (baseParsed.value == null || baseParsed.blank || baseParsed.incomplete) {
      setDraft(next);
      setErrors({
        base: baseParsed.error ?? 'Base font size must be greater than zero.',
      });
      setHasResult(false);
      pixelsRef.current = null;
      return;
    }

    baseRef.current = baseParsed.value;
    const source = next.texts[field];
    const parsed = parseSizeInput(source);

    if (parsed.blank) {
      pixelsRef.current = null;
      setDraft({
        baseText: next.baseText,
        texts: { px: '', em: '', pt: '', percent: '' },
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
    if (parsed.value == null) {
      setDraft(next);
      setErrors({ [field]: parsed.error ?? 'Enter a valid finite number.' });
      setHasResult(false);
      pixelsRef.current = null;
      return;
    }

    const converted = pixelsFromUnit(parsed.value, field, baseParsed.value);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      pixelsRef.current = null;
      return;
    }

    pixelsRef.current = converted.px;
    sourceRef.current = field;
    setDraft(
      draftFromPixels(converted.px, baseParsed.value, next.baseText, {
        field,
        text: source,
      }),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    pixelsRef.current = null;
    baseRef.current = DEFAULT_BASE_PX;
    sourceRef.current = 'px';
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const px = pixelsRef.current;
  const basePx = baseRef.current;
  const summaryLines =
    hasResult && px != null
      ? [
          `Base ${formatSize(basePx)} px`,
          ...SIZE_UNITS.map(
            (unit) =>
              `${formatSize(allFromPixels(px, basePx)[unit])} ${SIZE_UNIT_SYMBOLS[unit]}`,
          ),
        ]
      : null;
  const payload =
    hasResult && px != null ? shareResultText(px, basePx, sourceRef.current) : '';

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
            Base · px · em · pt · %
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <PxToEmForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'px' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <PxToEmResults
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
        </PxToEmForm>
      </div>
    </section>
  );
}
