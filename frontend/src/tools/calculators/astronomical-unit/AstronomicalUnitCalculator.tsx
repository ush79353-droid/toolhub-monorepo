'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { buildResult, formatDistance, fromMeters, toMeters } from './calculation';
import {
  AstronomicalUnitForm,
  type AstronomicalUnitDraft,
} from './AstronomicalUnitForm';
import { AstronomicalUnitResults } from './AstronomicalUnitResults';
import {
  AU_UNIT_BY_ID,
  DEFAULT_FIELD_UNITS,
  DEFAULT_METERS,
  type AstronomicalUnitFieldErrors,
  type AstronomicalUnitResult,
  type AuFieldId,
} from './types';
import { distanceErrorMessage, distanceValueState, parseOptionalNumber } from './validation';

function emptyDraft(): AstronomicalUnitDraft {
  return {
    texts: ['', '', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    metricOpen: true,
    astroOpen: true,
    imperialOpen: true,
  };
}

function draftFromMeters(
  meters: number,
  units: AstronomicalUnitDraft['units'],
  preserveField: AuFieldId | null,
  preserveText: string,
  flags: Pick<AstronomicalUnitDraft, 'metricOpen' | 'astroOpen' | 'imperialOpen'>
): AstronomicalUnitDraft {
  const values = [
    fromMeters(meters, units[0]),
    fromMeters(meters, units[1]),
    fromMeters(meters, units[2]),
    fromMeters(meters, units[3]),
    fromMeters(meters, units[4]),
    fromMeters(meters, units[5]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatDistance(v)
  ) as AstronomicalUnitDraft['texts'];

  return {
    texts,
    units,
    activeField: preserveField,
    ...flags,
  };
}

function summaryText(result: AstronomicalUnitResult): string {
  const lines = ['Astronomical Unit Calculator – Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = AU_UNIT_BY_ID[result.units[index]!].symbol;
    const prefix = index === 0 ? '' : '= ';
    lines.push(`${prefix}${formatDistance(value)} ${symbol}`.trim());
  });
  return lines.join('\n');
}

export function AstronomicalUnitCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AstronomicalUnitDraft>(() =>
    draftFromMeters(DEFAULT_METERS, [...DEFAULT_FIELD_UNITS], null, '', {
      metricOpen: true,
      astroOpen: true,
      imperialOpen: true,
    })
  );
  const [errors, setErrors] = React.useState<AstronomicalUnitFieldErrors>({});
  const [result, setResult] = React.useState<AstronomicalUnitResult | null>(() =>
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
    (next: AstronomicalUnitDraft) => {
      const field = next.activeField;
      const flags = {
        metricOpen: next.metricOpen,
        astroOpen: next.astroOpen,
        imperialOpen: next.imperialOpen,
      };

      if (
        field === draft.activeField &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        (next.metricOpen !== draft.metricOpen ||
          next.astroOpen !== draft.astroOpen ||
          next.imperialOpen !== draft.imperialOpen)
      ) {
        setDraft(next);
        return;
      }

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
      const nextErrors: AstronomicalUnitFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        metersRef.current = null;
        setDraft({
          ...next,
          texts: ['', '', '', '', '', ''],
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
            1 au = 149,597,870,700 m · metric · astronomical · imperial
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AstronomicalUnitForm
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
        <AstronomicalUnitResults
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
