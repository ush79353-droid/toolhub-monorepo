'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { calculateDecimeterToMeter, formatLength } from './calculation';
import {
  DecimeterToMeterForm,
  draftToInput,
  inputToDraft,
  type DecimeterToMeterDraft,
} from './DecimeterToMeterForm';
import { DecimeterToMeterResults } from './DecimeterToMeterResults';
import {
  DEFAULT_DECIMETER_TO_METER_INPUT,
  EMPTY_DECIMETER_TO_METER_INPUT,
  type DecimeterToMeterFieldErrors,
  type DecimeterToMeterResult,
} from './types';
import { validateDecimeterToMeter } from './validation';

function summaryText(result: DecimeterToMeterResult): string {
  const lines = [
    'Decimeter to Meter Converter — Omega Calculators',
    `${formatLength(result.decimeters)} dm = ${formatLength(result.meters)} m`,
    '1 m = 10 dm',
  ];
  for (const row of result.otherUnits) {
    lines.push(`${row.label}: ${formatLength(row.value)} ${row.unit}`);
  }
  return lines.join('\n');
}

function syncDraftFromResult(
  draft: DecimeterToMeterDraft,
  result: DecimeterToMeterResult
): DecimeterToMeterDraft {
  if (draft.source === 'decimeters') {
    return { ...draft, meters: formatLength(result.meters) };
  }
  return { ...draft, decimeters: formatLength(result.decimeters) };
}

export function DecimeterToMeterConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DecimeterToMeterDraft>(() => {
    const initial = calculateDecimeterToMeter(DEFAULT_DECIMETER_TO_METER_INPUT);
    return {
      source: 'decimeters',
      decimeters: formatLength(initial.decimeters),
      meters: formatLength(initial.meters),
      moreOpen: false,
    };
  });
  const [errors, setErrors] = React.useState<DecimeterToMeterFieldErrors>({});
  const [result, setResult] = React.useState<DecimeterToMeterResult | null>(() =>
    calculateDecimeterToMeter(DEFAULT_DECIMETER_TO_METER_INPUT)
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: DecimeterToMeterDraft) => {
      if (
        next.decimeters === draft.decimeters &&
        next.meters === draft.meters &&
        next.source === draft.source &&
        next.moreOpen !== draft.moreOpen
      ) {
        setDraft(next);
        return;
      }

      const parsed = draftToInput(next);
      const validation = validateDecimeterToMeter(parsed);
      setErrors(validation.errors);
      if (!validation.isValid) {
        setResult(null);
        setDraft(next);
        return;
      }
      const nextResult = calculateDecimeterToMeter(parsed);
      setResult(nextResult);
      setDraft(syncDraftFromResult(next, nextResult));
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
          <p className="text-xs font-normal text-muted-foreground">1 meter = 10 decimeters</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DecimeterToMeterForm
          draft={draft}
          errors={errors}
          otherUnits={result?.otherUnits ?? null}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={() => {
            setDraft(inputToDraft(EMPTY_DECIMETER_TO_METER_INPUT));
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
        />
        <DecimeterToMeterResults
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
