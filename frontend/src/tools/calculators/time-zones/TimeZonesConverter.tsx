'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  detectBrowserTimeZone,
  formatDisplayTime,
  formatLongDate,
  instantInZone,
  pickInstant,
  withDayDelta,
  zonedClockToInstant,
} from './calculation';
import {
  TimeZonesForm,
  defaultDraft,
  emptyDraft,
  type TimeZonesDraft,
} from './TimeZonesForm';
import { TimeZonesResults } from './TimeZonesResults';
import type { TimeZonesFieldErrors, ZoneInstant } from './types';
import { parseDateTimeInput } from './validation';
import {
  EASTERN_ZONE_IDS,
  WESTERN_ZONE_IDS,
  ZONE_BY_ID,
  ZONE_CATALOG,
} from './zones';

const HIGHLIGHT_IDS = ['london', 'dubai', 'karachi', 'mumbai', 'tokyo', 'new-york'] as const;

function allZoneIds(extra: string[]): string[] {
  const ids = ['utc', ...EASTERN_ZONE_IDS, ...WESTERN_ZONE_IDS, ...extra];
  return [...new Set(ids)];
}

function viewsFromInstant(
  instant: Date,
  referenceId: string,
  extra: string[],
): Record<string, ZoneInstant> {
  const reference = instantInZone(instant, ZONE_BY_ID[referenceId] ?? ZONE_BY_ID.utc);
  const out: Record<string, ZoneInstant> = {};
  for (const id of allZoneIds(extra)) {
    const zone = ZONE_BY_ID[id];
    if (!zone) continue;
    out[id] = withDayDelta(instantInZone(instant, zone), reference.date);
  }
  return out;
}

function summaryText(
  draft: TimeZonesDraft,
  views: Record<string, ZoneInstant>,
): string {
  const reference = views[draft.referenceZoneId];
  const refZone = ZONE_BY_ID[draft.referenceZoneId];
  const lines = [
    'Time Zones Converter',
    'Omega Calculators',
    '',
    'Reference:',
    `${refZone?.city ?? 'UTC'}`,
    reference
      ? `${formatLongDate(reference.date)} — ${formatDisplayTime(reference, draft.hourCycle)}`
      : '',
    '',
  ];
  for (const id of HIGHLIGHT_IDS) {
    const view = views[id];
    const zone = ZONE_BY_ID[id];
    if (!view || !zone) continue;
    const day =
      view.dayDelta === 1 ? ' (next day)' : view.dayDelta === -1 ? ' (previous day)' : '';
    lines.push(`${zone.city}: ${formatDisplayTime(view, draft.hourCycle)}${day}`);
  }
  if (typeof window !== 'undefined') {
    lines.push('', `Explore: ${window.location.href}`);
  }
  return lines.filter((line, i, arr) => line !== '' || arr[i - 1] !== '').join('\n');
}

export function TimeZonesConverter({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<TimeZonesDraft>(() => defaultDraft());
  const [instant, setInstant] = React.useState<Date | null>(null);
  const [errors, setErrors] = React.useState<TimeZonesFieldErrors>({});
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [localZone, setLocalZone] = React.useState('UTC');

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
    setLocalZone(detectBrowserTimeZone());
    const now = new Date();
    const next = defaultDraft(now);
    setDraft(next);
    applyFromZone('utc', next.date, next.time, next, 'earlier');
  }, []);

  const applyFromZone = (
    zoneId: string,
    date: string,
    time: string,
    base: TimeZonesDraft,
    disambiguation = base.disambiguation,
  ) => {
    const zone = ZONE_BY_ID[zoneId] ?? ZONE_BY_ID.utc;
    const parsed = parseDateTimeInput(date, time);
    const nextDraft: TimeZonesDraft = {
      ...base,
      date: zoneId === base.referenceZoneId ? date : base.date,
      time: zoneId === base.referenceZoneId ? time : base.time,
      disambiguation,
    };

    if (parsed.blank || parsed.incomplete) {
      setDraft(nextDraft);
      if (parsed.blank) {
        setInstant(null);
        setErrors({});
      }
      return;
    }
    if (!parsed.clock) {
      setDraft(nextDraft);
      setInstant(null);
      setErrors({ [zoneId === base.referenceZoneId ? 'reference' : zoneId]: parsed.error });
      return;
    }

    const converted = zonedClockToInstant(parsed.clock, zone);
    if (converted.status === 'nonexistent') {
      setDraft(nextDraft);
      setInstant(null);
      setErrors({
        [zoneId === base.referenceZoneId ? 'reference' : zoneId]:
          'This local time does not exist because the clock skipped forward (DST).',
      });
      return;
    }
    if (converted.status === 'invalid') {
      setDraft(nextDraft);
      setInstant(null);
      setErrors({
        [zoneId === base.referenceZoneId ? 'reference' : zoneId]:
          'This time zone is not available in the current runtime.',
      });
      return;
    }

    const picked = pickInstant(converted, disambiguation);
    if (!picked) {
      setDraft(nextDraft);
      setInstant(null);
      return;
    }

    const view = instantInZone(picked, ZONE_BY_ID[base.referenceZoneId] ?? ZONE_BY_ID.utc);
    setDraft({
      ...nextDraft,
      date: view.date,
      time: view.time.slice(0, 5),
    });
    setInstant(picked);
    setErrors(converted.status === 'ambiguous' ? { ambiguous: 'This local time occurs twice.' } : {});
  };

  const onReferenceZoneChange = (next: TimeZonesDraft) => {
    if (instant) {
      const view = instantInZone(instant, ZONE_BY_ID[next.referenceZoneId] ?? ZONE_BY_ID.utc);
      setDraft({ ...next, date: view.date, time: view.time.slice(0, 5) });
      setErrors({});
      return;
    }
    applyFromZone(next.referenceZoneId, next.date, next.time, next);
  };

  const views = instant ? viewsFromInstant(instant, draft.referenceZoneId, draft.extraZoneIds) : {};

  const clearAll = (reload: boolean) => {
    if (reload) {
      const now = new Date();
      const next = defaultDraft(now);
      setDraft(next);
      applyFromZone('utc', next.date, next.time, next, 'earlier');
    } else {
      setDraft(emptyDraft());
      setInstant(null);
    }
    setErrors({});
    setCopied(false);
    setShared(false);
  };

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
          <p className="text-xs font-normal text-muted-foreground">IANA time zones · UTC · DST</p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <TimeZonesForm
          draft={draft}
          errors={errors}
          views={views}
          localZoneLabel={localZone}
          onDraftChange={(next) => {
            if (next.referenceZoneId !== draft.referenceZoneId) {
              onReferenceZoneChange(next);
              return;
            }
            if (next.disambiguation !== draft.disambiguation && errors.ambiguous) {
              applyFromZone(next.referenceZoneId, next.date, next.time, next, next.disambiguation);
              return;
            }
            setDraft(next);
          }}
          onReferenceChange={(date, time) =>
            applyFromZone(draft.referenceZoneId, date, time, { ...draft, date, time })
          }
          onZoneEdit={(zoneId, date, time) => applyFromZone(zoneId, date, time, draft)}
          onUseCurrent={() => {
            const now = new Date();
            const next = { ...draft, extraZoneIds: draft.extraZoneIds };
            const utcView = instantInZone(now, ZONE_BY_ID[draft.referenceZoneId] ?? ZONE_BY_ID.utc);
            applyFromZone(draft.referenceZoneId, utcView.date, utcView.time.slice(0, 5), {
              ...next,
              date: utcView.date,
              time: utcView.time.slice(0, 5),
            });
          }}
          onResetUtc={() => {
            const next = { ...draft, referenceZoneId: 'utc' };
            onReferenceZoneChange(next);
          }}
          onAddZone={(zoneId) => {
            if (draft.extraZoneIds.includes(zoneId)) return;
            setDraft({ ...draft, extraZoneIds: [...draft.extraZoneIds, zoneId], addQuery: '' });
          }}
          onRemoveZone={(zoneId) =>
            setDraft({
              ...draft,
              extraZoneIds: draft.extraZoneIds.filter((id) => id !== zoneId),
            })
          }
          onSubmit={(event) => {
            event.preventDefault();
            applyFromZone(draft.referenceZoneId, draft.date, draft.time, draft);
          }}
          onReload={() => clearAll(true)}
          onReset={() => clearAll(false)}
        >
          <TimeZonesResults
            referenceId={draft.referenceZoneId}
            views={instant ? views : null}
            highlightIds={HIGHLIGHT_IDS.filter(
              (id) => id === draft.referenceZoneId || ZONE_CATALOG.some((z) => z.id === id),
            )}
            hourCycle={draft.hourCycle}
            copied={copied}
            shared={shared}
            canShare={canShare && Boolean(instant)}
            onCopy={() => {
              if (!instant) return;
              void copyTextToClipboard(summaryText(draft, views)).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
            onShare={() => {
              if (!instant) return;
              const payload = summaryText(draft, views);
              if (typeof navigator.share === 'function') {
                void navigator
                  .share({
                    title: metadata.title,
                    text: payload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(payload).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
                return;
              }
              void copyTextToClipboard(payload).then((ok) => {
                if (!ok) return;
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              });
            }}
          />
        </TimeZonesForm>
      </div>
    </section>
  );
}
