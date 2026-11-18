'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  formatLength,
  fromMeters,
  MM_PER_FOOT,
  shareResultText,
  syncFromMeters,
} from './calculation';
import { MmToFootForm, emptyDraft, type MmToFootDraft } from './MmToFootForm';
import { MmToFootResults } from './MmToFootResults';
import {
  PRIMARY_UNITS,
  UNIT_SYMBOLS,
  type ActiveField,
  type MmToFootFieldErrors,
  type OtherLengthUnit,
  type PrimaryUnit,
} from './types';
import { metersFromField, parseLengthInput } from './validation';

function isPrimary(unit: ActiveField): unit is PrimaryUnit {
  return (PRIMARY_UNITS as readonly string[]).includes(unit);
}

function draftFromMeters(
  meters: number,
  otherUnit: OtherLengthUnit,
  preserve: { field: ActiveField; text: string } | null,
): MmToFootDraft {
  const synced = syncFromMeters(meters, otherUnit);
  const texts = { ...synced.texts };
  let otherText = synced.otherText;
  if (preserve) {
    if (isPrimary(preserve.field)) {
      texts[preserve.field] = preserve.text;
    } else if (preserve.field === otherUnit) {
      otherText = preserve.text;
    }
  }
  return {
    texts,
    otherUnit,
    otherText,
    activeField: preserve?.field ?? null,
  };
}

export function MmToFootConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MmToFootDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<MmToFootFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const metersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MmToFootDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = isPrimary(field) ? next.texts[field] : next.otherText;
    const parsed = parseLengthInput(source);

    if (parsed.blank) {
      metersRef.current = null;
      setDraft({ ...emptyDraft(next.otherUnit), activeField: field });
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
      metersRef.current = null;
      return;
    }

    const converted = metersFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      metersRef.current = null;
      return;
    }

    metersRef.current = converted.meters;
    setDraft(draftFromMeters(converted.meters, next.otherUnit, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const changeOtherUnit = (unit: OtherLengthUnit) => {
    const meters = metersRef.current;
    if (meters == null || !hasResult) {
      setDraft({ ...draft, otherUnit: unit, otherText: '' });
      return;
    }
    setDraft(draftFromMeters(meters, unit, null));
  };

  const clearFields = () => {
    metersRef.current = null;
    setDraft(emptyDraft(draft.otherUnit));
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

  const meters = metersRef.current;
  const summaryLines =
    meters != null && hasResult
      ? [
          `${formatLength(fromMeters(meters, 'mm'))} ${UNIT_SYMBOLS.mm}`,
          `${formatLength(fromMeters(meters, 'ft'))} ${UNIT_SYMBOLS.ft}`,
          `${formatLength(fromMeters(meters, draft.otherUnit))} ${UNIT_SYMBOLS[draft.otherUnit]}`,
        ]
      : null;
  const payload = meters != null && hasResult ? shareResultText(meters) : '';

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
            1 ft = {MM_PER_FOOT} mm exactly
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MmToFootForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onOtherUnitChange={changeOtherUnit}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <MmToFootResults
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
        </MmToFootForm>
      </div>
    </section>
  );
}
