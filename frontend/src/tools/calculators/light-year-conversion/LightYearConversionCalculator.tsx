'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, formatDistance, fromMeters, toMeters } from './calculation';
import {
  LightYearConversionForm,
  type LightYearConversionDraft,
} from './LightYearConversionForm';
import { LightYearConversionResults } from './LightYearConversionResults';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_METERS,
  LIGHT_YEAR_UNIT_BY_ID,
  type LightYearConversionResult,
  type LightYearFieldErrors,
  type LightYearFieldId,
} from './types';
import { distanceErrorMessage, distanceValueState, parseOptionalNumber } from './validation';

function emptyDraft(): LightYearConversionDraft {
  return {
    texts: ['', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    metricOpen: true,
    imperialOpen: true,
    astroOpen: true,
  };
}

function draftFromMeters(
  meters: number,
  units: LightYearConversionDraft['units'],
  preserveField: LightYearFieldId | null,
  preserveText: string,
  flags: Pick<LightYearConversionDraft, 'metricOpen' | 'imperialOpen' | 'astroOpen'>
): LightYearConversionDraft {
  const values = [
    fromMeters(meters, units[0]),
    fromMeters(meters, units[1]),
    fromMeters(meters, units[2]),
    fromMeters(meters, units[3]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatDistance(v)
  ) as LightYearConversionDraft['texts'];

  return {
    texts,
    units,
    activeField: preserveField,
    ...flags,
  };
}

function summaryText(result: LightYearConversionResult): string {
  const lines = ['Light Year Conversion – Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = LIGHT_YEAR_UNIT_BY_ID[result.units[index]!].symbol;
    const prefix = index === 0 ? '' : '= ';
    lines.push(`${prefix}${formatDistance(value)} ${symbol}`.trim());
  });
  return lines.join('\n');
}

export function LightYearConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LightYearConversionDraft>(() =>
    draftFromMeters(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS], null, '', {
      metricOpen: true,
      imperialOpen: true,
      astroOpen: true,
    })
  );
  const [errors, setErrors] = React.useState<LightYearFieldErrors>({});
  const [result, setResult] = React.useState<LightYearConversionResult | null>(() =>
    buildResult(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  const metersRef = React.useRef<number | null>(DEFAULT_METERS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: LightYearConversionDraft) => {
      const field = next.activeField;
      const flags = {
        metricOpen: next.metricOpen,
        imperialOpen: next.imperialOpen,
        astroOpen: next.astroOpen,
      };

      // Accordion-only toggle.
      if (
        field === draft.activeField &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        (next.metricOpen !== draft.metricOpen ||
          next.imperialOpen !== draft.imperialOpen ||
          next.astroOpen !== draft.astroOpen)
      ) {
        setDraft(next);
        return;
      }

      // Unit-only change.
      if (
        field !== null &&
        next.texts[field] === draft.texts[field] &&
        next.units[field] !== draft.units[field]
      ) {
        const meters = metersRef.current;
        if (meters === null) {
          setDraft(next);
          return;
        }
        const synced = draftFromMeters(meters, next.units, null, '', flags);
        setDraft(synced);
        setErrors({});
        setResult(buildResult(meters, next.units));
        return;
      }

      if (field === null) {
        setDraft(next);
        return;
      }

      const parsed = parseOptionalNumber(next.texts[field]);
      const state = distanceValueState(parsed);
      const message = distanceErrorMessage(state);
      const nextErrors: LightYearFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        metersRef.current = null;
        setDraft({
          ...next,
          texts: ['', '', '', ''],
        });
        setErrors({});
        setResult(null);
        return;
      }

      if (state !== 'ok' || parsed === null) {
        setDraft(next);
        setErrors(nextErrors);
        setResult(null);
        return;
      }

      const meters = toMeters(parsed, next.units[field]);
      metersRef.current = meters;
      const synced = draftFromMeters(meters, next.units, field, next.texts[field], flags);
      setDraft(synced);
      setErrors({});
      setResult(buildResult(meters, next.units));
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result) : '';

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
            Light-years · metric · imperial · astronomical
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LightYearConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            metersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <LightYearConversionResults
          result={result}
          invalid={Object.keys(errors).length > 0}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(sharePayload).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}
