'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatArea } from './calculation';
import type { AcreToAreResult } from './types';

const REFERENCE_ROWS = [
  { acres: 0, ares: 0 },
  { acres: 0.5, ares: 20.234282112 },
  { acres: 1, ares: 40.468564224 },
  { acres: 2, ares: 80.937128448 },
  { acres: 5, ares: 202.34282112 },
  { acres: 10, ares: 404.68564224 },
  { acres: 25, ares: 1011.7141056 },
  { acres: 100, ares: 4046.8564224 },
] as const;

interface AcreToAreResultsProps {
  result: AcreToAreResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function AcreToAreResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AcreToAreResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative area in acres or ares to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter an area.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatArea(result.acres)} ac = {formatArea(result.ares)} a
        </p>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground">{result.explanation}</p>
        <p className="mt-1 text-xs text-muted-foreground">1 acre = 40.468564224 ares</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[240px] text-left text-sm">
          <caption className="sr-only">Acre to are reference values</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Acres
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Ares
              </th>
            </tr>
          </thead>
          <tbody>
            {REFERENCE_ROWS.map((row) => (
              <tr key={row.acres} className="border-t border-border">
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.acres)}</td>
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.ares)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
