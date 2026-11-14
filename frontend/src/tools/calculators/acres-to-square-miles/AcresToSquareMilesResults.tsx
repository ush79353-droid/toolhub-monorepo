'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatArea } from './calculation';
import type { AcresToSquareMilesResult } from './types';

const REFERENCE_ROWS = [
  { acres: 1, mi2: 0.0015625 },
  { acres: 10, mi2: 0.015625 },
  { acres: 100, mi2: 0.15625 },
  { acres: 640, mi2: 1 },
  { acres: 1000, mi2: 1.5625 },
  { acres: 2000, mi2: 3.125 },
] as const;

interface AcresToSquareMilesResultsProps {
  result: AcresToSquareMilesResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function AcresToSquareMilesResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AcresToSquareMilesResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative area in acres or square miles to convert.
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
          {formatArea(result.acres)} ac = {formatArea(result.squareMiles)} mi²
        </p>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground">{result.explanation}</p>
        <p className="mt-1 text-xs text-muted-foreground">1 square mile = 640 acres</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[240px] text-left text-sm">
          <caption className="sr-only">Acres to square miles reference values</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Acres
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Square miles
              </th>
            </tr>
          </thead>
          <tbody>
            {REFERENCE_ROWS.map((row) => (
              <tr key={row.acres} className="border-t border-border">
                <td className="px-4 py-2 tabular-nums text-accent">
                  {row.acres.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.mi2)}</td>
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
