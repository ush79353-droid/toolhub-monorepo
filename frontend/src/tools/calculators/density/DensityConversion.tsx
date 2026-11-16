'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { allFromKgPerM3, formatDensity, shareResultText } from './calculation';
import { DensityForm, emptyDraft, type DensityDraft } from './DensityForm';
import { DensityResults } from './DensityResults';
import {
  DENSITY_UNITS,
  DENSITY_UNIT_SYMBOLS,
  type DensityFieldErrors,
  type DensityUnit,
} from './types';
import { kgPerM3FromUnit, parseDensityInput } from './validation';

function draftFromKgPerM3(
  kgPerM3: number,
  preserve: { field: DensityUnit; text: string } | null,
  open: Pick<DensityDraft, 'metricOpen' | 'imperialOpen'>,
): DensityDraft {
  const amounts = allFromKgPerM3(kgPerM3);
  const texts = {} as Record<DensityUnit, string>;
  for (const unit of DENSITY_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatDensity(amounts[unit]);
  }
  return { texts, activeField: preserve?.field ?? null, ...open };
}

export function DensityConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DensityDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<DensityFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const baseRef = React.useRef<number | null>(null);
  const sourceRef = React.useRef<DensityUnit>('kilogramPerCubicMeter');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: DensityDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = next.texts[field];
    const parsed = parseDensityInput(source);
    if (parsed.blank) {
      baseRef.current = null;
      setDraft({
        ...emptyDraft(),
        metricOpen: next.metricOpen,
        imperialOpen: next.imperialOpen,
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
      baseRef.current = null;
      return;
    }

    const converted = kgPerM3FromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      baseRef.current = null;
      return;
    }

    baseRef.current = converted.kgPerM3;
    sourceRef.current = field;
    setDraft(
      draftFromKgPerM3(converted.kgPerM3, { field, text: source }, {
        metricOpen: next.metricOpen,
        imperialOpen: next.imperialOpen,
      }),
    );
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    baseRef.current = null;
    setDraft({
      ...emptyDraft(),
      metricOpen: draft.metricOpen,
      imperialOpen: draft.imperialOpen,
    });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    baseRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const kgPerM3 = baseRef.current;
  const summaryLines =
    hasResult && kgPerM3 != null
      ? DENSITY_UNITS.map((unit) => {
          const amounts = allFromKgPerM3(kgPerM3);
          return `${formatDensity(amounts[unit])} ${DENSITY_UNIT_SYMBOLS[unit]}`;
        })
      : null;
  const payload =
    hasResult && kgPerM3 != null ? shareResultText(kgPerM3, sourceRef.current) : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Density Conversion</h2>
          <p className="text-xs font-normal text-muted-foreground">
            kg/m³ · lb/cu ft · lb/US gal
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DensityForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'kilogramPerCubicMeter' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <DensityResults
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
        </DensityForm>
      </div>
    </section>
  );
}
