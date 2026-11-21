'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatLongDate, formatZuluIso, formatZuluLabel } from './calculation';
import type { HourCycle, ZuluConversion } from './types';

interface ZuluTimeResultsProps {
  conversion: ZuluConversion | null;
  hourCycle: HourCycle;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function ZuluTimeResults({
  conversion,
  hourCycle,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ZuluTimeResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (!conversion || conversion.status === 'invalid' || conversion.status === 'nonexistent') {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {conversion?.status === 'nonexistent'
          ? 'That local clock time does not exist: the clocks sprang forward over this hour. Pick a valid time.'
          : 'Enter a Zulu or local time and a conversion date.'}
      </p>
    );
  }

  const zuluDisplay = hourCycle === 'h12' ? conversion.zuluTime12 : formatZuluLabel(conversion.zuluTime);
  const localDisplay = hourCycle === 'h12' ? conversion.localTime12 : conversion.localTime;
  const dayNote =
    conversion.dayDelta === 1
      ? 'next day'
      : conversion.dayDelta === -1
        ? 'previous day'
        : conversion.dayDelta > 1
          ? `+${conversion.dayDelta} days`
          : conversion.dayDelta < -1
            ? `${conversion.dayDelta} days`
            : null;

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <p className="mt-2 font-mono text-sm tabular-nums text-accent">
          {zuluDisplay} UTC = {localDisplay} {conversion.abbreviation}
          {dayNote ? ` · ${dayNote}` : ''}
        </p>
        <dl className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="inline">Selected time zone: </dt>
            <dd className="inline text-accent">{conversion.iana}</dd>
          </div>
          <div>
            <dt className="inline">Abbreviation: </dt>
            <dd className="inline text-accent">{conversion.abbreviation}</dd>
          </div>
          <div>
            <dt className="inline">UTC offset: </dt>
            <dd className="inline text-accent">{conversion.offsetLabel}</dd>
          </div>
          <div>
            <dt className="inline">Daylight saving time: </dt>
            <dd className="inline text-accent">{conversion.dstActive ? 'Active' : 'Inactive'}</dd>
          </div>
          <div>
            <dt className="inline">Zulu date: </dt>
            <dd className="inline text-accent">{formatLongDate(conversion.zuluDate)}</dd>
          </div>
          <div>
            <dt className="inline">Local date: </dt>
            <dd className="inline text-accent">{formatLongDate(conversion.localDate)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="inline">ISO 8601: </dt>
            <dd className="inline font-mono text-accent">
              {formatZuluIso(conversion.zuluDate, conversion.zuluTime)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
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
