'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildResult,
  formatArea,
  fromSquareMeters,
  toSquareMeters,
} from './calculation';
import { AreaConverterForm, type AreaConverterDraft } from './AreaConverterForm';
import { AreaConverterResults } from './AreaConverterResults';
import {
  AREA_UNIT_BY_ID,
  DEFAULT_FIELD_UNITS,
  DEFAULT_SQUARE_METERS,
  type AreaConverterFieldErrors,
  type AreaConverterResult,
  type AreaFieldId,
} from './types';
import { areaErrorMessage, areaValueState, parseOptionalNumber } from './validation';

function emptyDraft(): AreaConverterDraft {
  return {
    texts: ['', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
  };
}

function draftFromSquareMeters(
  squareMeters: number,
  units: AreaConverterDraft['units'],
  preserveField: AreaFieldId | null,
  preserveText: string
): AreaConverterDraft {
  const values = [
    fromSquareMeters(squareMeters, units[0]),
    fromSquareMeters(squareMeters, units[1]),
    fromSquareMeters(squareMeters, units[2]),
    fromSquareMeters(squareMeters, units[3]),
    fromSquareMeters(squareMeters, units[4]),
  ] as const;

  const texts = values.map((v, i) =>
    preserveField === i ? preserveText : formatArea(v)
  ) as AreaConverterDraft['texts'];

  return { texts, units, activeField: preserveField };
}

function summaryText(result: AreaConverterResult): string {
  const lines = ['Area Converter – Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = AREA_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${index === 0 ? '' : '= '}${formatArea(value)} ${symbol}`.trim());
  });
  return lines.join('\n');
}

export function AreaConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AreaConverterDraft>(() =>
    draftFromSquareMeters(DEFAULT_SQUARE_METERS, [...DEFAULT_FIELD_UNITS], null, '')
  );
  const [errors, setErrors] = React.useState<AreaConverterFieldErrors>({});
  const [result, setResult] = React.useState<AreaConverterResult | null>(() =>
    buildResult(DEFAULT_SQUARE_METERS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  // Canonical physical area. Updated only from a successful field edit.
  const squareMetersRef = React.useRef<number | null>(DEFAULT_SQUARE_METERS);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: AreaConverterDraft) => {
    const field = next.activeField;
    const nextErrors: AreaConverterFieldErrors = {};

    // Unit-only change: keep canonical m² and reformat fields from it.
    if (
      field !== null &&
      next.texts[field] === draft.texts[field] &&
      next.units[field] !== draft.units[field]
    ) {
      const m2 = squareMetersRef.current;
      if (m2 === null) {
        setDraft(next);
        return;
      }
      const synced = draftFromSquareMeters(m2, next.units, null, '');
      setDraft(synced);
      setErrors({});
      setResult(buildResult(m2, next.units));
      return;
    }

    if (field === null) {
      setDraft(next);
      return;
    }

    const parsed = parseOptionalNumber(next.texts[field]);
    const state = areaValueState(parsed);
    const message = areaErrorMessage(state);
    if (message) nextErrors[field] = message;

    if (state === 'blank') {
      squareMetersRef.current = null;
      setDraft({
        ...next,
        texts: ['', '', '', '', ''],
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

    const m2 = toSquareMeters(parsed, next.units[field]);
    squareMetersRef.current = m2;
    const synced = draftFromSquareMeters(m2, next.units, field, next.texts[field]);
    setDraft(synced);
    setErrors({});
    setResult(buildResult(m2, next.units));
  }, [draft.texts, draft.units]);

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
            15 units · base m²
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AreaConverterForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            squareMetersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <AreaConverterResults
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
