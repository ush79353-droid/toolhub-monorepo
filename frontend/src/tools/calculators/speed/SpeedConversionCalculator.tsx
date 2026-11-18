'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  allFromMps,
  formatSpeed,
  fromMetersPerSecondPace,
  shareResultText,
} from './calculation';
import { emptyDraft, SpeedForm, type SpeedDraft } from './SpeedForm';
import { SpeedResults } from './SpeedResults';
import {
  PACE_UNITS,
  PACE_UNIT_SYMBOLS,
  SPEED_UNITS,
  SPEED_UNIT_SYMBOLS,
  type SpeedField,
  type SpeedFieldErrors,
} from './types';
import { mpsFromField, parseSpeedInput } from './validation';

type OpenState = Pick<
  SpeedDraft,
  'imperialOpen' | 'metricOpen' | 'otherOpen' | 'paceOpen' | 'imperialExtra' | 'metricExtra' | 'paceExtra'
>;

function draftFromMps(
  mps: number,
  preserve: { field: SpeedField; text: string } | null,
  open: OpenState,
): SpeedDraft {
  const { speeds, paces } = allFromMps(mps);
  const texts = emptyDraft().texts;
  for (const unit of SPEED_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatSpeed(speeds[unit]);
  }
  for (const unit of PACE_UNITS) {
    if (preserve?.field === unit) {
      texts[unit] = preserve.text;
      continue;
    }
    const p = paces[unit];
    texts[unit] = p == null ? '' : formatSpeed(p);
  }
  return { texts, activeField: preserve?.field ?? null, ...open };
}

export function SpeedConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<SpeedDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<SpeedFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const mpsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const openFrom = (d: SpeedDraft): OpenState => ({
    imperialOpen: d.imperialOpen,
    metricOpen: d.metricOpen,
    otherOpen: d.otherOpen,
    paceOpen: d.paceOpen,
    imperialExtra: d.imperialExtra,
    metricExtra: d.metricExtra,
    paceExtra: d.paceExtra,
  });

  const evaluate = (next: SpeedDraft) => {
    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const open = openFrom(next);
    const source = next.texts[field];
    const parsed = parseSpeedInput(source);

    if (parsed.blank) {
      mpsRef.current = null;
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
      mpsRef.current = null;
      return;
    }

    const converted = mpsFromField(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      mpsRef.current = null;
      return;
    }

    mpsRef.current = converted.mps;
    setDraft(draftFromMps(converted.mps, { field, text: source }, open));
    setErrors({});
    setHasResult(true);
  };

  const clearFields = () => {
    mpsRef.current = null;
    setDraft({ ...emptyDraft(), ...openFrom(draft) });
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const reload = () => {
    mpsRef.current = null;
    setDraft(emptyDraft());
    setHasResult(false);
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const mps = mpsRef.current;
  const paceUndefined = hasResult && mps != null && mps === 0;
  const converted = mps != null && hasResult ? allFromMps(mps) : null;
  const summaryLines = converted
    ? [
        `${formatSpeed(converted.speeds.mph)} ${SPEED_UNIT_SYMBOLS.mph}`,
        `${formatSpeed(converted.speeds.kmh)} ${SPEED_UNIT_SYMBOLS.kmh}`,
        `${formatSpeed(converted.speeds.mps)} ${SPEED_UNIT_SYMBOLS.mps}`,
        `${formatSpeed(converted.speeds.knot)} ${SPEED_UNIT_SYMBOLS.knot}`,
        ...(mps! > 0
          ? [
              `${formatSpeed(fromMetersPerSecondPace(mps!, 'minPerKm')!)} ${PACE_UNIT_SYMBOLS.minPerKm}`,
              `${formatSpeed(fromMetersPerSecondPace(mps!, 'minPerMile')!)} ${PACE_UNIT_SYMBOLS.minPerMile}`,
            ]
          : []),
      ]
    : null;
  const payload = mps != null && hasResult ? shareResultText(mps) : '';

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
            mph · km/h · m/s · knots · pace
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <SpeedForm
          draft={draft}
          errors={errors}
          paceUndefined={paceUndefined}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'mph' });
          }}
          onReload={reload}
          onReset={clearFields}
        >
          <SpeedResults
            summaryLines={summaryLines}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(payload)}
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
        </SpeedForm>
      </div>
    </section>
  );
}
