'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  EXTRA_ANGLE_UNITS,
  MAIN_ANGLE_UNITS,
  ANGLE_UNIT_DEFS,
  type AngleFieldErrors,
  type ExtraAngleUnit,
  type MainAngleUnit,
} from './types';
import {
  degreesToRadians,
  extraRowsFromRadians,
  formatAngleDisplay,
  formatDmsLine,
  formatSecondsField,
  fromRadians,
  mainRowsFromRadians,
  radiansToDms,
  shareResultText,
} from './calculation';
import {
  AngleConversionForm,
  emptyDraft,
  type ActiveAngleField,
  type AngleConversionDraft,
} from './AngleConversionForm';
import { AngleConversionResults } from './AngleConversionResults';
import { parseAngleField, parseDmsComponents, radiansFromUnit } from './validation';

function isMain(unit: ActiveAngleField): unit is MainAngleUnit {
  return (MAIN_ANGLE_UNITS as readonly string[]).includes(unit);
}

function isExtra(unit: ActiveAngleField): unit is ExtraAngleUnit {
  return (EXTRA_ANGLE_UNITS as readonly string[]).includes(unit);
}

function isDmsField(unit: ActiveAngleField): boolean {
  return unit === 'dmsDegrees' || unit === 'dmsMinutes' || unit === 'dmsSeconds';
}

function draftFromRadians(
  radians: number,
  extraOpen: boolean,
  preserve: { field: ActiveAngleField; text: string } | null,
): AngleConversionDraft {
  const texts = {} as Record<MainAngleUnit, string>;
  for (const unit of MAIN_ANGLE_UNITS) {
    texts[unit] =
      preserve?.field === unit ? preserve.text : formatAngleDisplay(fromRadians(radians, unit));
  }
  const dms = radiansToDms(radians);
  const degField =
    dms.sign < 0 && dms.degrees === 0 ? '-0' : dms.sign < 0 ? `-${dms.degrees}` : String(dms.degrees);
  const extraTexts = {} as Record<ExtraAngleUnit, string>;
  for (const unit of EXTRA_ANGLE_UNITS) {
    extraTexts[unit] =
      preserve?.field === unit ? preserve.text : formatAngleDisplay(fromRadians(radians, unit));
  }
  return {
    texts,
    dmsDegrees: preserve?.field === 'dmsDegrees' ? preserve.text : degField,
    dmsMinutes: preserve?.field === 'dmsMinutes' ? preserve.text : String(dms.minutes),
    dmsSeconds:
      preserve?.field === 'dmsSeconds' ? preserve.text : formatSecondsField(dms.seconds),
    extraTexts,
    extraOpen,
    activeField: preserve?.field ?? null,
  };
}

function defaultRadians(): number {
  return degreesToRadians(90);
}

export function AngleConversionCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<AngleConversionDraft>(() =>
    draftFromRadians(defaultRadians(), false, null),
  );
  const [errors, setErrors] = React.useState<AngleFieldErrors>({});
  const [hasResult, setHasResult] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const radiansRef = React.useRef<number | null>(defaultRadians());
  const inputLabelRef = React.useRef('90 degrees');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = (next: AngleConversionDraft) => {
    if (
      next.extraOpen !== draft.extraOpen &&
      next.texts === draft.texts &&
      next.dmsDegrees === draft.dmsDegrees &&
      next.dmsMinutes === draft.dmsMinutes &&
      next.dmsSeconds === draft.dmsSeconds &&
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

    if (isDmsField(field)) {
      const parsed = parseDmsComponents(next.dmsDegrees, next.dmsMinutes, next.dmsSeconds);
      if (parsed.blank) {
        radiansRef.current = null;
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
      if (parsed.radians == null) {
        setDraft(next);
        setErrors(parsed.errors);
        setHasResult(false);
        radiansRef.current = null;
        return;
      }
      radiansRef.current = parsed.radians;
      inputLabelRef.current = `${next.dmsDegrees || '0'}° ${next.dmsMinutes || '0'}′ ${next.dmsSeconds || '0'}″`;
      setDraft(
        draftFromRadians(parsed.radians, next.extraOpen, {
          field,
          text:
            field === 'dmsDegrees'
              ? next.dmsDegrees
              : field === 'dmsMinutes'
                ? next.dmsMinutes
                : next.dmsSeconds,
        }),
      );
      setErrors({});
      setHasResult(true);
      return;
    }

    const source = isMain(field)
      ? next.texts[field]
      : isExtra(field)
        ? next.extraTexts[field]
        : '';
    const parsed = parseAngleField(source);
    if (parsed.blank) {
      radiansRef.current = null;
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
      radiansRef.current = null;
      return;
    }

    if (!isMain(field) && !isExtra(field)) {
      setDraft(next);
      return;
    }
    const converted = radiansFromUnit(parsed.value, field);
    if (!converted.ok) {
      setDraft(next);
      setErrors({ [field]: converted.error });
      setHasResult(false);
      radiansRef.current = null;
      return;
    }

    radiansRef.current = converted.radians;
    inputLabelRef.current = `${source} ${ANGLE_UNIT_DEFS[field].symbol}`;
    setDraft(draftFromRadians(converted.radians, next.extraOpen, { field, text: source }));
    setErrors({});
    setHasResult(true);
  };

  const clearAll = (reload: boolean) => {
    if (reload) {
      const radians = defaultRadians();
      radiansRef.current = radians;
      inputLabelRef.current = '90 degrees';
      setDraft(draftFromRadians(radians, false, null));
      setHasResult(true);
    } else {
      radiansRef.current = null;
      setDraft(emptyDraft());
      setHasResult(false);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

  const radians = radiansRef.current;
  const mainRows = hasResult && radians != null ? mainRowsFromRadians(radians) : null;
  const extraRows = hasResult && radians != null ? extraRowsFromRadians(radians) : null;
  const dmsLine = hasResult && radians != null ? formatDmsLine(radiansToDms(radians)) : null;
  const payload =
    hasResult && radians != null ? shareResultText(inputLabelRef.current, radians) : '';

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
            Degrees · radians · gradians · turns · DMS
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AngleConversionForm
          draft={draft}
          errors={errors}
          onDraftChange={evaluate}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate({ ...draft, activeField: draft.activeField ?? 'degrees' });
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <AngleConversionResults
            mainRows={mainRows}
            dmsLine={dmsLine}
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
        </AngleConversionForm>
      </div>
    </section>
  );
}
