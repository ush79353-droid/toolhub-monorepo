'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromMeters, formatLength, shareResultText } from './calculation';
import {
  KilometerCalculatorForm,
  emptyDraft,
  type KilometerDraft,
} from './KilometerCalculatorForm';
import { KilometerCalculatorResults } from './KilometerCalculatorResults';
import {
  KM_SYNC_UNITS,
  UNIT_SYMBOLS,
  type KilometerFieldErrors,
  type KmSyncUnit,
} from './types';
import { metersFromField, parseLengthInput } from './validation';

type OpenState = Pick<KilometerDraft, 'kmOpen' | 'metricOpen' | 'imperialOpen'>;

function draftFromMeters(
  meters: number,
  preserve: { field: KmSyncUnit; text: string } | null,
  open: OpenState,
): KilometerDraft {
  const values = allFromMeters(meters);
  const texts = emptyDraft().texts;
  for (const unit of KM_SYNC_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatLength(values[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, ...open };
}

export function KilometerCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<KilometerDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<KilometerFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const metersRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const openFrom = (d: KilometerDraft): OpenState => ({
    kmOpen: d.kmOpen,
    metricOpen: d.metricOpen,
    imperialOpen: d.imperialOpen,
  });

  const evaluate = (next: KilometerDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const open = openFrom(next);
    const source = next.texts[field];
    const parsed = parseLengthInput(source);

    if (parsed.blank) {
      metersRef.current = null;
      setDraft({ ...emptyDraft(), ...open, activeField: field });
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
    setDraft(draftFromMeters(converted.meters, { field, text: source }, open));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    metersRef.current = null;
    setDraft({ ...emptyDraft(), ...openFrom(draft) });
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
  const values = meters != null && hasResult ? allFromMeters(meters) : null;
  const summaryLines = values
    ? KM_SYNC_UNITS.map((unit) => `${formatLength(values[unit])} ${UNIT_SYMBOLS[unit]}`)
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
          <p className="text-xs font-normal text-muted-foreground">1 km = 1,000 m exactly</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <KilometerCalculatorForm
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
          <KilometerCalculatorResults
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
        </KilometerCalculatorForm>
      </div>
    </section>
  );
}
