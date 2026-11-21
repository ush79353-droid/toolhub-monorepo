'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatLongUtc, formatZoneEntry } from './calculation';
import type { UnixUnit } from './types';
import { UNIT_LABELS } from './types';
import { ZONE_GROUPS } from './zones';

interface UnixTimeResultsProps {
  date: Date | null;
  unixText: string;
  unit: UnixUnit;
  shared: boolean;
  canShare: boolean;
  onShare: () => void;
  onCopySummary: () => void;
  copied: boolean;
}

export function UnixTimeResults({
  date,
  unixText,
  unit,
  shared,
  canShare,
  onShare,
  onCopySummary,
  copied,
}: UnixTimeResultsProps) {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (!date) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid Unix timestamp or UTC date/time to see conversions and time zones.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Instant summary
        </p>
        <p className="mt-2 font-mono text-sm tabular-nums text-accent">
          Unix: {unixText} · {UNIT_LABELS[unit]}
        </p>
        <p className="mt-1 text-sm text-accent">{formatLongUtc(date)}</p>
      </div>

      <div className="space-y-2">
        {ZONE_GROUPS.map((group) => {
          const open = Boolean(openGroups[group.id]);
          return (
            <div key={group.id} className="overflow-hidden rounded-xl border border-border">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 bg-muted/30 px-4 py-3 text-left text-sm font-semibold text-accent"
                aria-expanded={open}
                onClick={() =>
                  setOpenGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                }
              >
                <span>{group.title}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {open ? 'Hide' : 'Show'}
                </span>
              </button>
              {open ? (
                <ul className="divide-y divide-border px-4 py-1">
                  {group.zones.map((zone) => (
                    <li key={zone.id} className="py-2.5">
                      <p className="text-xs font-medium text-muted-foreground">{zone.label}</p>
                      <p className="mt-0.5 break-words font-mono text-sm tabular-nums text-accent">
                        {formatZoneEntry(date, zone)}
                      </p>
                      {zone.kind === 'iana' ? (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
 IANA zone; DST abbreviation follows the selected instant.
                        </p>
                      ) : (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Fixed UTC offset (not a geographical DST zone).
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Fixed-offset rows apply a constant shift. Named summer/standard zones use IANA rules for the
 selected date; winter dates show standard abbreviations, not summer labels.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopySummary}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFeedback('yes')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'yes'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setFeedback('no')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'no'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
}
