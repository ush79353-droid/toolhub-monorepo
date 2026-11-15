'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  DEFAULT_MPS,
  EXTRA_SPEED_UNITS,
  MAIN_SPEED_UNITS,
  type ExtraSpeedUnit,
  type MainSpeedUnit,
  type SpeedFieldErrors,
  type SpeedUnit,
} from './types';
import {
  extraRowsFromMps,
  formatSpeed,
  fromMetersPerSecond,
  mainRowsFromMps,
  shareResultText,
} from './calculation';
import { emptyDraft, MsToKmhForm, type MsToKmhDraft } from './MsToKmhForm';
import { MsToKmhResults } from './MsToKmhResults';
import { metersPerSecondFromUnit, parseSpeedInput } from './validation';

function isMain(unit: SpeedUnit): unit is MainSpeedUnit {
  return (MAIN_SPEED_UNITS as readonly string[]).includes(unit);
}

function isExtra(unit: SpeedUnit): unit is ExtraSpeedUnit {
  return (EXTRA_SPEED_UNITS as readonly string[]).includes(unit);
}

function draftFromMps(
  mps: number,
  extraOpen: boolean,
  preserve: { field: SpeedUnit; text: string } | null,
): MsToKmhDraft {
  const texts = {} as Record<MainSpeedUnit, string>;
  for (const unit of MAIN_SPEED_UNITS) {
    texts[unit] = preserve?.field === unit ? preserve.text : formatSpeed(fromMetersPerSecond(mps, unit));
  }
  const extraTexts = {} as Record<ExtraSpeedUnit, string>;
  for (const unit of EXTRA_SPEED_UNITS) {
    extraTexts[unit] =
      preserve?.field === unit ? preserve.text : formatSpeed(fromMetersPerSecond(mps, unit));
  }
  return {
    texts,
    extraTexts,
    extraOpen,
    activeField: preserve?.field ?? null,
  };
}

export function MsToKmhConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<MsToKmhDraft>(() =>
    draftFromMps(DEFAULT_MPS, false, null),
  );
  const [errors, setErrors] = React.useState<SpeedFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const mpsRef = React.useRef<number | null>(DEFAULT_MPS);
  const inputLabelRef = React.useRef(`${DEFAULT_MPS} meters per second`);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: MsToKmhDraft) => {
    if (
      next.extraOpen !== draft.extraOpen &&
      next.texts === draft.texts &&
      next.extraTexts === draft.extraTexts
    ) {
      setDraft(next);
      return;
    }

    const field = next.activeField;
    if (!field) {
      setDraft(next);
      return;
    }

    const source = isMain(field)
      ? next.texts[field]
      : isExtra(field)
        ? next.extraTexts[field]
        : '';
    const parsed = parseSpeedInput(source);
    if (parsed.blank) {
      mpsRef.current = null;
      setDraft({ ...emptyDraft(), extraOpen: next.extraOpen, activeField: field });
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

    const converted = metersPerSecondFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      mpsRef.current = null;
      return;
    }

    mpsRef.current = converted.mps;
    const shareNames: Record<SpeedUnit, string> = {
      mps: 'meters per second',
      kmh: 'kilometers per hour',
      mph: 'miles per hour',
      fps: 'feet per second',
      knots: 'knots',
      cms: 'centimeters per second',
      mms: 'millimeters per second',
      kms: 'kilometers per second',
      mpm: 'meters per minute',
      kmpm: 'kilometers per minute',
      fpm: 'feet per minute',
      mips: 'miles per second',
      mipm: 'miles per minute',
    };
    inputLabelRef.current = `${source} ${shareNames[field]}`;
    setDraft(draftFromMps(converted.mps, next.extraOpen, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      mpsRef.current = DEFAULT_MPS;
      inputLabelRef.current = `${DEFAULT_MPS} meters per second`;
      setDraft(draftFromMps(DEFAULT_MPS, false, null));
      setHasResult(true);
    } else {
      mpsRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const mps = mpsRef.current;
  const mainRows = hasResult && mps != null ? mainRowsFromMps(mps) : null;
  const extraRows = hasResult && mps != null ? extraRowsFromMps(mps) : null;
  const payload = hasResult && mps != null ? shareResultText(inputLabelRef.current, mps) : '';

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
            m/s · km/h · mph · ft/s · knots
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <MsToKmhForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'mps' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <MsToKmhResults
            mainRows={mainRows}
            extraRows={draft.extraOpen ? extraRows : null}
            copied={copied}
            shared={shared}
            canShare={canShare && hasResult}
            onCopy={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
              void copyTextToClipboard(text).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!payload) return;
              const text =
                typeof window !== 'undefined' ? `${payload}\n\nExplore: ${window.location.href}` : payload;
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
        </MsToKmhForm>
      </div>
    </section>
  );
}
