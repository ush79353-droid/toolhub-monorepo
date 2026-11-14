'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateDegreesMinutesSeconds,
  decimalToDMS,
  dmsToDecimal,
  formatDdAngle,
  formatDegreesField,
  formatSecondsField,
} from './calculation';
import {
  DegreesMinutesSecondsForm,
  emptyDraft,
  type DegreesMinutesSecondsDraft,
} from './DegreesMinutesSecondsForm';
import { DegreesMinutesSecondsResults } from './DegreesMinutesSecondsResults';
import {
  EXAMPLE_DD_TO_DMS,
  EXAMPLE_DMS_TO_DD,
  type DegreesMinutesSecondsFieldErrors,
  type DegreesMinutesSecondsResult,
} from './types';
import { parseDdDraft, parseDmsDraft } from './validation';

function summaryText(result: DegreesMinutesSecondsResult, active: string): string {
  const { dms } = result;
  const signedDeg = dms.sign < 0 ? -dms.degrees : dms.degrees;
  return [
    'Degrees Minutes Seconds Calculator',
    'Omega Calculators',
    '',
    `Active input: ${active === 'DD' ? 'Decimal degrees' : 'DMS'}`,
    '',
    `Degrees: ${signedDeg}°`,
    `Minutes: ${dms.minutes}′`,
    `Seconds: ${formatSecondsField(dms.seconds)}″`,
    '',
    `DMS: ${result.dmsLine}`,
    '',
    'Decimal Degrees:',
    result.ddLine,
  ].join('\n');
}

export function DegreesMinutesSecondsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<DegreesMinutesSecondsDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<DegreesMinutesSecondsFieldErrors>({});
  const [result, setResult] = React.useState<DegreesMinutesSecondsResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback((next: DegreesMinutesSecondsDraft) => {
    if (next.activeInput === 'DMS') {
      const parsed = parseDmsDraft({
        degrees: next.degrees,
        minutes: next.minutes,
        seconds: next.seconds,
      });
      setErrors(parsed.errors);
      if (parsed.blank) {
        setResult(null);
        setDraft({ ...next, canonical: null, decimalDegrees: '' });
        return;
      }
      if (!parsed.isValid || parsed.decimalDegrees === null) {
        setResult(null);
        setDraft({ ...next, canonical: null });
        return;
      }
      const value = parsed.decimalDegrees;
      const nextResult = calculateDegreesMinutesSeconds({
        activeInput: 'DMS',
        decimalDegrees: value,
      });
      setResult(nextResult);
      setDraft({
        ...next,
        canonical: value,
        decimalDegrees: formatDdAngle(value),
      });
      return;
    }

    const parsed = parseDdDraft(next.decimalDegrees);
    setErrors(parsed.errors);
    if (parsed.blank) {
      setResult(null);
      setDraft({
        ...next,
        canonical: null,
        degrees: '',
        minutes: '',
        seconds: '',
      });
      return;
    }
    if (!parsed.isValid || parsed.decimalDegrees === null) {
      setResult(null);
      setDraft({ ...next, canonical: null });
      return;
    }
    const value = parsed.decimalDegrees;
    const nextResult = calculateDegreesMinutesSeconds({
      activeInput: 'DD',
      decimalDegrees: value,
    });
    const parts = decimalToDMS(value);
    setResult(nextResult);
    setDraft({
      ...next,
      canonical: value,
      degrees: formatDegreesField(parts),
      minutes: String(parts.minutes),
      seconds: formatSecondsField(parts.seconds),
    });
  }, []);

  const applyExample = React.useCallback((example: 'dms' | 'dd') => {
    if (example === 'dms') {
      const value = dmsToDecimal(
        EXAMPLE_DMS_TO_DD.degrees,
        EXAMPLE_DMS_TO_DD.minutes,
        EXAMPLE_DMS_TO_DD.seconds,
        EXAMPLE_DMS_TO_DD.sign
      );
      setErrors({});
      setResult(
        calculateDegreesMinutesSeconds({ activeInput: 'DMS', decimalDegrees: value })
      );
      setDraft({
        activeInput: 'DMS',
        degrees: String(EXAMPLE_DMS_TO_DD.degrees),
        minutes: String(EXAMPLE_DMS_TO_DD.minutes),
        seconds: String(EXAMPLE_DMS_TO_DD.seconds),
        decimalDegrees: formatDdAngle(value),
        canonical: value,
      });
      return;
    }

    const value = EXAMPLE_DD_TO_DMS.decimalDegrees;
    const parts = decimalToDMS(value);
    setErrors({});
    setResult(calculateDegreesMinutesSeconds({ activeInput: 'DD', decimalDegrees: value }));
    setDraft({
      activeInput: 'DD',
      degrees: formatDegreesField(parts),
      minutes: String(parts.minutes),
      seconds: formatSecondsField(parts.seconds),
      decimalDegrees: formatDdAngle(value),
      canonical: value,
    });
  }, []);

  const sharePayload = result ? summaryText(result, draft.activeInput) : '';

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
          <p className="text-xs font-normal text-muted-foreground">DMS ↔ Decimal degrees</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <DegreesMinutesSecondsForm
          draft={draft}
          errors={errors}
          onDraftChange={(next) => evaluate(next)}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReload={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onReset={() => {
            setDraft(emptyDraft());
            setErrors({});
            setResult(null);
            setCopied(false);
            setShared(false);
          }}
          onApplyExample={applyExample}
        />
        <DegreesMinutesSecondsResults
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
