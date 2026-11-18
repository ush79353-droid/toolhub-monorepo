'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromSquareMeters,
  formatArea,
  shareResultText,
} from './calculation';
import {
  SquareMeterConverterForm,
  emptyDraft,
  type SquareMeterDraft,
} from './SquareMeterConverterForm';
import { SquareMeterConverterResults } from './SquareMeterConverterResults';
import {
  SQUARE_METER_UNITS,
  UNIT_SYMBOLS,
  type AreaUnit,
  type SquareMeterFieldErrors,
} from './types';
import { parseField, squareMetersFromField } from './validation';

function draftFromSquareMeters(
  squareMeters: number,
  preserve: { field: AreaUnit; text: string } | null,
  otherOpen: boolean,
): SquareMeterDraft {
  const values = allFromSquareMeters(squareMeters);
  const texts = emptyDraft().texts;
  for (const unit of SQUARE_METER_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatArea(values[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, otherOpen };
}

export function SquareMeterConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareMeterDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareMeterFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const metersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareMeterDraft) => {
    if (next.otherOpen !== draft.otherOpen) {
      const onlyToggle =
        next.activeField === draft.activeField &&
        SQUARE_METER_UNITS.every((u) => next.texts[u] === draft.texts[u]);
      if (onlyToggle) {
        setDraft(next);
        return;
      }
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseField(source);

    if ('blank' in parsed) {
      metersRef.current = null;
      setDraft({ ...emptyDraft(), otherOpen: next.otherOpen, activeField: field });
      setErrors({});
      setHasResult(false);
      return;
    }
    if ('incomplete' in parsed) {
      setDraft(next);
      setErrors({});
      return;
    }
    if ('error' in parsed) {
      setDraft(next);
      setErrors({ [field]: parsed.error });
      setHasResult(false);
      metersRef.current = null;
      return;
    }

    const converted = squareMetersFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      metersRef.current = null;
      return;
    }

    metersRef.current = converted.squareMeters;
    setDraft(
      draftFromSquareMeters(converted.squareMeters, { field, text: source }, next.otherOpen),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    metersRef.current = null;
    setDraft({ ...emptyDraft(), otherOpen: draft.otherOpen });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    metersRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const squareMeters = metersRef.current;
  const values = squareMeters != null && hasResult ? allFromSquareMeters(squareMeters) : null;
  const summaryLines = values
    ? ([
        `${formatArea(values.m2)} ${UNIT_SYMBOLS.m2}`,
        `${formatArea(values.ft2)} ${UNIT_SYMBOLS.ft2}`,
        `${formatArea(values.cm2)} ${UNIT_SYMBOLS.cm2}`,
        `${formatArea(values.mm2)} ${UNIT_SYMBOLS.mm2}`,
        `${formatArea(values.hectare)} ${UNIT_SYMBOLS.hectare}`,
      ] as const)
    : null;
  const payload = squareMeters != null && hasResult ? shareResultText(squareMeters) : '';

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
            Square meters ↔ other area units (1 m² ≈ 10.7639 ft²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareMeterConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <SquareMeterConverterResults
            summaryLines={summaryLines}
            invalid={Object.keys(errors).length > 0}
            copied={copied}
            shared={shared}
            canShare={canShare || Boolean(summaryLines)}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined'
                  ? `${payload}\n\n${window.location.href}`
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
                  ? `${payload}\n\n${window.location.href}`
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
        </SquareMeterConverterForm>
      </div>
    </section>
  );
}
