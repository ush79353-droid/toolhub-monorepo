'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  buildCoordinatesResult,
  formatDd,
  formatDdLine,
  formatDdmLine,
  formatDmsLine,
  latitudeHemisphereFromSigned,
  longitudeHemisphereFromSigned,
  signFromLatitudeHemisphere,
  signFromLongitudeHemisphere,
} from './calculation';
import {
  CoordinatesForm,
  draftFromCanonical,
  emptyDraft,
  type CoordinatesDraft,
} from './CoordinatesForm';
import { CoordinatesResults } from './CoordinatesResults';
import {
  MAX_ABS_LATITUDE,
  MAX_ABS_LONGITUDE,
  type CoordinatesFieldErrors,
  type CoordinatesResult,
} from './types';
import { validateAxisComponents } from './validation';

function summaryText(result: CoordinatesResult, showLetters: boolean): string {
  const latH = result.latitudeHemisphere;
  const lonH = result.longitudeHemisphere;
  return [
    'Coordinates Converter',
    'Omega Calculators',
    '',
    'Format: Decimal Degrees',
    '',
    `Latitude: ${formatDdLine(result.latitude, showLetters, latH)}`,
    `Longitude: ${formatDdLine(result.longitude, showLetters, lonH)}`,
    '',
    'DMS:',
    formatDmsLine(result.latitudeDms, showLetters ? latH : null),
    formatDmsLine(result.longitudeDms, showLetters ? lonH : null),
    '',
    'DDM:',
    formatDdmLine(result.latitudeDdm, showLetters ? latH : null),
    formatDdmLine(result.longitudeDdm, showLetters ? lonH : null),
    '',
    'Signed Decimal Degrees:',
    `${formatDd(result.latitude)}, ${formatDd(result.longitude)}`,
  ].join('\n');
}

function evaluateDraft(draft: CoordinatesDraft): {
  errors: CoordinatesFieldErrors;
  result: CoordinatesResult | null;
  nextDraft: CoordinatesDraft;
} {
  const lat = validateAxisComponents({
    format: draft.format,
    showLetters: draft.showLetters,
    maxAbsDegrees: MAX_ABS_LATITUDE,
    axis: 'latitude',
    draft: {
      degrees: draft.latDegrees,
      minutes: draft.latMinutes,
      seconds: draft.latSeconds,
      decimalMinutes: draft.latDecimalMinutes,
    },
  });
  const lon = validateAxisComponents({
    format: draft.format,
    showLetters: draft.showLetters,
    maxAbsDegrees: MAX_ABS_LONGITUDE,
    axis: 'longitude',
    draft: {
      degrees: draft.lonDegrees,
      minutes: draft.lonMinutes,
      seconds: draft.lonSeconds,
      decimalMinutes: draft.lonDecimalMinutes,
    },
  });

  const errors: CoordinatesFieldErrors = { ...lat.errors, ...lon.errors };

  let latitude = draft.latitude;
  let longitude = draft.longitude;
  let latHemi = draft.latitudeHemisphere;
  let lonHemi = draft.longitudeHemisphere;

  if (lat.isValid && lat.value !== null) {
    if (draft.showLetters) {
      latitude = signFromLatitudeHemisphere(draft.latitudeHemisphere) * lat.value;
    } else {
      latitude = lat.value;
      latHemi = latitudeHemisphereFromSigned(latitude);
    }
  } else if (lat.blank) {
    latitude = null;
  }

  if (lon.isValid && lon.value !== null) {
    if (draft.showLetters) {
      longitude = signFromLongitudeHemisphere(draft.longitudeHemisphere) * lon.value;
    } else {
      longitude = lon.value;
      lonHemi = longitudeHemisphereFromSigned(longitude);
    }
  } else if (lon.blank) {
    longitude = null;
  }

  const nextDraft: CoordinatesDraft = {
    ...draft,
    latitude,
    longitude,
    latitudeHemisphere: latHemi,
    longitudeHemisphere: lonHemi,
  };

  if (
    latitude === null ||
    longitude === null ||
    !lat.isValid ||
    !lon.isValid ||
    Object.keys(errors).length > 0
  ) {
    return { errors, result: null, nextDraft };
  }

  return {
    errors,
    result: buildCoordinatesResult(latitude, longitude),
    nextDraft,
  };
}

export function CoordinatesConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<CoordinatesDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<CoordinatesFieldErrors>({});
  const [result, setResult] = React.useState<CoordinatesResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: CoordinatesDraft, options?: { rewriteFields?: boolean }) => {
      const accordionOnly =
        next.latDegrees === draft.latDegrees &&
        next.latMinutes === draft.latMinutes &&
        next.latSeconds === draft.latSeconds &&
        next.latDecimalMinutes === draft.latDecimalMinutes &&
        next.lonDegrees === draft.lonDegrees &&
        next.lonMinutes === draft.lonMinutes &&
        next.lonSeconds === draft.lonSeconds &&
        next.lonDecimalMinutes === draft.lonDecimalMinutes &&
        next.format === draft.format &&
        next.showLetters === draft.showLetters &&
        next.latitudeHemisphere === draft.latitudeHemisphere &&
        next.longitudeHemisphere === draft.longitudeHemisphere &&
        (next.formatsOpen !== draft.formatsOpen ||
          next.latitudeOpen !== draft.latitudeOpen ||
          next.longitudeOpen !== draft.longitudeOpen);

      if (accordionOnly) {
        setDraft(next);
        return;
      }

      // Format or letter-mode change: preserve canonical location, rewrite fields.
      const representationChanged =
        next.format !== draft.format || next.showLetters !== draft.showLetters;

      let working = next;
      if (representationChanged || options?.rewriteFields) {
        let latitude = draft.latitude;
        let longitude = draft.longitude;
        let latHemi = next.latitudeHemisphere;
        let lonHemi = next.longitudeHemisphere;

        if (draft.latitude !== null) {
          latitude = draft.latitude;
          if (next.showLetters) {
            latHemi = latitudeHemisphereFromSigned(latitude);
            // Keep existing hemi if magnitude unchanged and user only toggled letters off→on with same sign
            if (next.showLetters && !draft.showLetters) {
              latHemi = latitudeHemisphereFromSigned(latitude);
            }
          }
        }
        if (draft.longitude !== null) {
          longitude = draft.longitude;
          if (next.showLetters) {
            lonHemi = longitudeHemisphereFromSigned(longitude);
          }
        }

        working = draftFromCanonical(
          {
            ...next,
            latitudeHemisphere: latHemi,
            longitudeHemisphere: lonHemi,
          },
          latitude,
          longitude
        );
      }

      // Hemisphere change with letters: flip sign of magnitude.
      if (
        next.showLetters &&
        next.format === draft.format &&
        next.showLetters === draft.showLetters &&
        (next.latitudeHemisphere !== draft.latitudeHemisphere ||
          next.longitudeHemisphere !== draft.longitudeHemisphere) &&
        next.latDegrees === draft.latDegrees &&
        next.lonDegrees === draft.lonDegrees
      ) {
        let latitude = draft.latitude;
        let longitude = draft.longitude;
        if (latitude !== null && next.latitudeHemisphere !== draft.latitudeHemisphere) {
          latitude = signFromLatitudeHemisphere(next.latitudeHemisphere) * Math.abs(latitude);
        }
        if (longitude !== null && next.longitudeHemisphere !== draft.longitudeHemisphere) {
          longitude = signFromLongitudeHemisphere(next.longitudeHemisphere) * Math.abs(longitude);
        }
        working = {
          ...next,
          latitude,
          longitude,
        };
        if (latitude !== null && longitude !== null) {
          setErrors({});
          setResult(buildCoordinatesResult(latitude, longitude));
          setDraft(working);
          return;
        }
      }

      const evaluated = evaluateDraft(working);
      setErrors(evaluated.errors);
      setResult(evaluated.result);
      setDraft(evaluated.nextDraft);
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result, draft.showLetters) : '';

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
          <p className="text-xs font-normal text-muted-foreground">DD · DMS · DDM</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <CoordinatesForm
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
        />
        <CoordinatesResults
          result={result}
          showLetters={draft.showLetters}
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
