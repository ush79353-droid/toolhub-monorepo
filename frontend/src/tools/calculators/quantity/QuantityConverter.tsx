'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromUnits, formatQuantity, shareResultText } from './calculation';
import { emptyDraft, QuantityForm, type QuantityDraft } from './QuantityForm';
import { QuantityResults } from './QuantityResults';
import {
  QUANTITY_UNITS,
  QUANTITY_UNIT_SYMBOLS,
  type QuantityFieldErrors,
  type QuantityUnit,
} from './types';
import { parseQuantityInput, unitsFromQuantity } from './validation';

function draftFromUnits(
  units: number,
  preserve: { field: QuantityUnit; text: string } | null,
): QuantityDraft {
  const amounts = allFromUnits(units);
  const texts = {} as Record<QuantityUnit, string>;
  for (const unit of QUANTITY_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatQuantity(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null };
}

export function QuantityConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<QuantityDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<QuantityFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const unitsRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<QuantityUnit>('unit');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: QuantityDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseQuantityInput(source);
    if (parsed.blank) {
      unitsRef.current = null;
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
      unitsRef.current = null;
      return;
    }

    const converted = unitsFromQuantity(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      unitsRef.current = null;
      return;
    }

    unitsRef.current = converted.units;
    sourceRef.current = field;
    setDraft(draftFromUnits(converted.units, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = () => {
    unitsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const units = unitsRef.current;
  const summaryLines =
    hasResult && units != null
      ? QUANTITY_UNITS.map((unit) => {
          const amounts = allFromUnits(units);
          return `${formatQuantity(amounts[unit])} ${QUANTITY_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    hasResult && units != null ? shareResultText(units, sourceRef.current) : '';

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
            Units · dozens · scores · grosses
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <QuantityForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'unit' });
          }}
          onReload={clearAll}
          onReset={clearAll}
        >
          <QuantityResults
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
        </QuantityForm>
      </div>
    </section>
  );
}
