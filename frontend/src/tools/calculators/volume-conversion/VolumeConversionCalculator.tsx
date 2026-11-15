'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildResult,
  draftTextsFromLiters,
  formatVolume,
  toLiters,
} from './calculation';
import {
  VolumeConversionForm,
  type VolumeConversionDraft,
} from './VolumeConversionForm';
import { VolumeConversionResults } from './VolumeConversionResults';
import {
  DEFAULT_FIELD_UNITS,
  DEFAULT_LITERS,
  FIELD_LABELS,
  VOLUME_UNIT_BY_ID,
  type VolumeConversionResult,
  type VolumeFieldErrors,
  type VolumeFieldId,
} from './types';
import {
  parseOptionalNumber,
  volumeErrorMessage,
  volumeValueState,
} from './validation';

function emptyDraft(): VolumeConversionDraft {
  return {
    texts: ['', '', '', '', '', '', '', '', ''],
    units: [...DEFAULT_FIELD_UNITS],
    activeField: null,
    moreOpen: false,
  };
}

function draftFromLiters(
  liters: number,
  units: VolumeConversionDraft['units'],
  preserveField: VolumeFieldId | null,
  preserveText: string,
  moreOpen: boolean
): VolumeConversionDraft {
  return {
    texts: draftTextsFromLiters(liters, units, preserveField, preserveText),
    units,
    activeField: preserveField,
    moreOpen,
  };
}

function summaryText(result: VolumeConversionResult): string {
  const lines = ['Volume Conversion – Omega Calculators', ''];
  result.values.forEach((value, index) => {
    const symbol = VOLUME_UNIT_BY_ID[result.units[index]!].symbol;
    lines.push(`${FIELD_LABELS[index]}: ${formatVolume(value)} ${symbol}`);
  });
  lines.push(`Canonical: ${formatVolume(result.liters)} L`);
  return lines.join('\n');
}

export function VolumeConversion({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const litersRef = React.useRef<number | null>(DEFAULT_LITERS);

  const [draft, setDraft] = React.useState<VolumeConversionDraft>(() =>
    draftFromLiters(DEFAULT_LITERS, [...DEFAULT_FIELD_UNITS], null, '', false)
  );
  const [errors, setErrors] = React.useState<VolumeFieldErrors>({});
  const [result, setResult] = React.useState<VolumeConversionResult | null>(() =>
    buildResult(DEFAULT_LITERS, [...DEFAULT_FIELD_UNITS])
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: VolumeConversionDraft) => {
      if (
        next.moreOpen !== draft.moreOpen &&
        next.texts.every((t, i) => t === draft.texts[i]) &&
        next.units.every((u, i) => u === draft.units[i]) &&
        next.activeField === draft.activeField
      ) {
        setDraft(next);
        return;
      }

      const field = next.activeField;

      if (
        field !== null &&
        next.texts[field] === draft.texts[field] &&
        next.units[field] !== draft.units[field]
      ) {
        const liters = litersRef.current;
        if (liters === null) {
          setDraft(next);
          return;
        }
        const synced = draftFromLiters(liters, next.units, null, '', next.moreOpen);
        setDraft(synced);
        setErrors({});
        setResult(buildResult(liters, next.units));
        return;
      }

      if (field === null) {
        setDraft(next);
        return;
      }

      const parsed = parseOptionalNumber(next.texts[field]);
      const state = volumeValueState(parsed);
      const message = volumeErrorMessage(state);
      const nextErrors: VolumeFieldErrors = {};
      if (message) nextErrors[field] = message;

      if (state === 'blank') {
        litersRef.current = null;
        setDraft({
          ...emptyDraft(),
          units: next.units,
          moreOpen: next.moreOpen,
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

      const liters = toLiters(parsed, next.units[field]);
      litersRef.current = liters;
      const synced = draftFromLiters(
        liters,
        next.units,
        field,
        next.texts[field],
        next.moreOpen
      );
      setDraft(synced);
      setErrors({});
      setResult(buildResult(liters, next.units));
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
            9 fields · metric / US / Imperial · base L
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <VolumeConversionForm
          draft={draft}
          errors={errors}
          moreOptions={result?.moreOptions ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            litersRef.current = null;
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <VolumeConversionResults
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
