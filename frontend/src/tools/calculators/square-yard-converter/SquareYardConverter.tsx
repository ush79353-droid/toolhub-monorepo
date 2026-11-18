'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromSquareYards,
  formatArea,
  shareResultText,
} from './calculation';
import {
  SquareYardConverterForm,
  emptyDraft,
  type SquareYardDraft,
} from './SquareYardConverterForm';
import { SquareYardConverterResults } from './SquareYardConverterResults';
import {
  SQUARE_YARD_UNITS,
  UNIT_SYMBOLS,
  type AreaUnit,
  type SquareYardFieldErrors,
} from './types';
import { parseField, squareYardsFromField } from './validation';

function draftFromSquareYards(
  squareYards: number,
  preserve: { field: AreaUnit; text: string } | null,
  commonOpen: boolean,
  otherOpen: boolean,
): SquareYardDraft {
  const values = allFromSquareYards(squareYards);
  const texts = emptyDraft().texts;
  for (const unit of SQUARE_YARD_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatArea(values[unit]);
  }
  return {
    texts,
    activeField: preserve?.field ?? null,
    commonOpen,
    otherOpen,
  };
}

export function SquareYardConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SquareYardDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SquareYardFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const yardsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: SquareYardDraft) => {
    if (next.commonOpen !== draft.commonOpen || next.otherOpen !== draft.otherOpen) {
      const onlyToggle =
        next.activeField === draft.activeField &&
        SQUARE_YARD_UNITS.every((u) => next.texts[u] === draft.texts[u]);
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
      yardsRef.current = null;
      setDraft({
        ...emptyDraft(),
        commonOpen: next.commonOpen,
        otherOpen: next.otherOpen,
        activeField: field,
      });
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
      yardsRef.current = null;
      return;
    }

    const converted = squareYardsFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      yardsRef.current = null;
      return;
    }

    yardsRef.current = converted.squareYards;
    setDraft(
      draftFromSquareYards(
        converted.squareYards,
        { field, text: source },
        next.commonOpen,
        next.otherOpen,
      ),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    yardsRef.current = null;
    setDraft({
      ...emptyDraft(),
      commonOpen: draft.commonOpen,
      otherOpen: draft.otherOpen,
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    yardsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const squareYards = yardsRef.current;
  const values = squareYards != null && hasResult ? allFromSquareYards(squareYards) : null;
  const summaryLines = values
    ? ([
        `${formatArea(values.yd2)} ${UNIT_SYMBOLS.yd2}`,
        `${formatArea(values.ft2)} ${UNIT_SYMBOLS.ft2}`,
        `${formatArea(values.m2)} ${UNIT_SYMBOLS.m2}`,
        `${formatArea(values.acre)} ${UNIT_SYMBOLS.acre}`,
      ] as const)
    : null;
  const payload = squareYards != null && hasResult ? shareResultText(squareYards) : '';

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
            Square yards ↔ other area units (1 yd² = 9 ft²)
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SquareYardConverterForm
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
          <SquareYardConverterResults
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
        </SquareYardConverterForm>
      </div>
    </section>
  );
}
