'use client';

import { Button } from '@/components/ui/button';
import { formatLongDate } from './dates';
import type { HundredDayResult } from './calculation';

interface HundredDayResultsProps {
  result: HundredDayResult | null;
  copied: boolean;
  onCopy: () => void;
}

export function HundredDayResults({ result, copied, onCopy }: HundredDayResultsProps) {
  if (!result) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
        Enter valid dates to see the calendar result.
      </p>
    );
  }

  if (result.mode === 'offset') {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Calculated date</p>
        <p className="text-xl font-semibold leading-snug text-accent">{result.longDate}</p>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Weekday</dt>
            <dd className="font-medium text-accent">{result.weekday}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ISO date</dt>
            <dd className="font-medium tabular-nums text-accent">{result.resultDate}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Starting date</dt>
            <dd className="font-medium text-accent">{formatLongDate(result.startDate)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Days counted</dt>
            <dd className="font-medium tabular-nums text-accent">{result.dayCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Direction</dt>
            <dd className="font-medium text-accent">{result.direction === 'after' ? 'Days after' : 'Days before'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Counting</dt>
            <dd className="font-medium capitalize text-accent">{result.counting}</dd>
          </div>
        </dl>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy result'}
        </Button>
      </div>
    );
  }

  const direction =
    result.signedCount > 0 ? 'To date is later' : result.signedCount < 0 ? 'To date is earlier' : 'Same calendar day';

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Calendar days</p>
      <p className="text-xl font-semibold tabular-nums text-accent">{result.absoluteCount.toLocaleString('en-US')}</p>
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Signed count</dt>
          <dd className="font-medium tabular-nums text-accent">{result.signedCount.toLocaleString('en-US')}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Direction</dt>
          <dd className="font-medium text-accent">{direction}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Counting</dt>
          <dd className="font-medium capitalize text-accent">{result.counting}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Weeks and days</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.weeks} weeks, {result.leftoverDays} days
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">From</dt>
          <dd className="font-medium text-accent">{formatLongDate(result.fromDate)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">To</dt>
          <dd className="font-medium text-accent">{formatLongDate(result.toDate)}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        Dates stay in the order you entered. A negative signed count means the to date is earlier. These are calendar
        days, including weekends.
      </p>
      <Button type="button" variant="outline" className="h-11 font-medium" onClick={onCopy}>
        {copied ? 'Copied' : 'Copy result'}
      </Button>
    </div>
  );
}
