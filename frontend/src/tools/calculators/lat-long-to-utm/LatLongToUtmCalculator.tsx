'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  calculateLatLongToUtm,
  formatDd,
  formatUtmMeters,
  signFromLatitudeHemisphere,
  signFromLongitudeHemisphere,
} from './calculation';
import {
  LatLongToUtmForm,
  draftFromCanonical,
  emptyDraft,
  type LatLongToUtmDraft,
} from './LatLongToUtmForm';
import { LatLongToUtmResults } from './LatLongToUtmResults';
import type { LatLongToUtmFieldErrors, LatLongToUtmResult } from './types';
import { validateLatLongToUtm } from './validation';

function summaryText(result: LatLongToUtmResult, coordinateType: string): string {
  const { utm } = result;
  return [
    'Lat Long to UTM Converter',
    'Omega Calculators',
    '',
    'Datum: WGS84',
    `Coordinate type: ${coordinateType === 'DMS' ? 'Degrees, minutes, seconds' : 'Decimal degrees'}`,
    '',
    `Latitude: ${formatDd(result.latitude)}°`,
    `Longitude: ${formatDd(result.longitude)}°`,
    '',
    `UTM Zone: ${utm.zone}`,
    `Hemisphere: ${utm.hemisphere === 'N' ? 'North' : 'South'}`,
    `Easting: ${formatUtmMeters(utm.easting)} m`,
    `Northing: ${formatUtmMeters(utm.northing)} m`,
    '',
    'Coordinate Reference System:',
    utm.epsg,
  ].join('\n');
}

export function LatLongToUtmConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<LatLongToUtmDraft>(emptyDraft);
  const [errors, setErrors] = React.useState<LatLongToUtmFieldErrors>({});
  const [result, setResult] = React.useState<LatLongToUtmResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const evaluate = React.useCallback(
    (next: LatLongToUtmDraft) => {
      const accordionOnly =
        next.latDd === draft.latDd &&
        next.lonDd === draft.lonDd &&
        next.latDegrees === draft.latDegrees &&
        next.latMinutes === draft.latMinutes &&
        next.latSeconds === draft.latSeconds &&
        next.lonDegrees === draft.lonDegrees &&
        next.lonMinutes === draft.lonMinutes &&
        next.lonSeconds === draft.lonSeconds &&
        next.coordinateType === draft.coordinateType &&
        next.latitudeHemisphere === draft.latitudeHemisphere &&
        next.longitudeHemisphere === draft.longitudeHemisphere &&
        next.gpsOpen !== draft.gpsOpen;

      if (accordionOnly) {
        setDraft(next);
        return;
      }

      let working = next;

      // Coordinate type change: preserve canonical location, rewrite fields.
      if (next.coordinateType !== draft.coordinateType) {
        working = draftFromCanonical(
          { ...next, latitude: draft.latitude, longitude: draft.longitude },
          draft.latitude,
          draft.longitude
        );
      }

      // DMS hemisphere change: flip sign of preserved magnitude.
      if (
        next.coordinateType === 'DMS' &&
        draft.coordinateType === 'DMS' &&
        next.latDegrees === draft.latDegrees &&
        next.lonDegrees === draft.lonDegrees &&
        next.latMinutes === draft.latMinutes &&
        next.lonMinutes === draft.lonMinutes &&
        next.latSeconds === draft.latSeconds &&
        next.lonSeconds === draft.lonSeconds &&
        (next.latitudeHemisphere !== draft.latitudeHemisphere ||
          next.longitudeHemisphere !== draft.longitudeHemisphere)
      ) {
        let latitude = draft.latitude;
        let longitude = draft.longitude;
        if (latitude !== null && next.latitudeHemisphere !== draft.latitudeHemisphere) {
          latitude =
            signFromLatitudeHemisphere(next.latitudeHemisphere) * Math.abs(latitude);
        }
        if (longitude !== null && next.longitudeHemisphere !== draft.longitudeHemisphere) {
          longitude =
            signFromLongitudeHemisphere(next.longitudeHemisphere) * Math.abs(longitude);
        }
        working = { ...next, latitude, longitude };
        if (latitude !== null && longitude !== null) {
          try {
            const nextResult = calculateLatLongToUtm({
              coordinateType: 'DMS',
              latitude,
              longitude,
            });
            setErrors({});
            setResult(nextResult);
            setDraft(working);
            return;
          } catch {
            setErrors({
              coverage:
                'This latitude is outside the standard UTM coverage. UTM normally supports locations from 80°S to 84°N.',
            });
            setResult(null);
            setDraft(working);
            return;
          }
        }
      }

      const validation = validateLatLongToUtm({
        coordinateType: working.coordinateType,
        latDd: working.latDd,
        lonDd: working.lonDd,
        latDms: {
          degrees: working.latDegrees,
          minutes: working.latMinutes,
          seconds: working.latSeconds,
          hemisphere: working.latitudeHemisphere,
        },
        lonDms: {
          degrees: working.lonDegrees,
          minutes: working.lonMinutes,
          seconds: working.lonSeconds,
          hemisphere: working.longitudeHemisphere,
        },
      });

      const nextDraft: LatLongToUtmDraft = {
        ...working,
        latitude: validation.latitude,
        longitude: validation.longitude,
      };

      setErrors(validation.errors);

      if (!validation.isValid) {
        setResult(null);
        setDraft(nextDraft);
        return;
      }

      try {
        const nextResult = calculateLatLongToUtm({
          coordinateType: working.coordinateType,
          latitude: validation.latitude,
          longitude: validation.longitude,
        });
        setResult(nextResult);
        setDraft(nextDraft);
      } catch {
        setResult(null);
        setErrors({
          ...validation.errors,
          coverage:
            'This latitude is outside the standard UTM coverage. UTM normally supports locations from 80°S to 84°N.',
        });
        setDraft(nextDraft);
      }
    },
    [draft]
  );

  const sharePayload = result ? summaryText(result, draft.coordinateType) : '';

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
          <p className="text-xs font-normal text-muted-foreground">WGS84 · UTM zones 1–60</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <LatLongToUtmForm
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
        <LatLongToUtmResults
          result={result}
          invalid={Object.keys(errors).length > 0 && !errors.coverage}
          coverageMessage={errors.coverage}
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
