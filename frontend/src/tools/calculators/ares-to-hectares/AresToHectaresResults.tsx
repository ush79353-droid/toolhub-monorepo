'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatArea } from './calculation';
import type { AresToHectaresResult } from './types';

const REFERENCE_ROWS = [
  { ares: 0, hectares: 0 },
  { ares: 1, hectares: 0.01 },
  { ares: 5, hectares: 0.05 },
  { ares: 10, hectares: 0.1 },
  { ares: 25, hectares: 0.25 },
  { ares: 50, hectares: 0.5 },
  { ares: 100, hectares: 1 },
  { ares: 200, hectares: 2 },
  { ares: 250, hectares: 2.5 },
  { ares: 500, hectares: 5 },
  { ares: 1000, hectares: 10 },
  { ares: 2500, hectares: 25 },
  { ares: 10000, hectares: 100 },
] as const;

interface AresToHectaresResultsProps {
  result: AresToHectaresResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function AresToHectaresResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AresToHectaresResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative area in ares or hectares to convert.
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
          {formatArea(result.ares)} a = {formatArea(result.hectares)} ha
        </p>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground">{result.explanation}</p>
        <p className="mt-1 text-xs text-muted-foreground">1 hectare = 100 ares (exact)</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[240px] text-left text-sm">
          <caption className="sr-only">Ares to hectares reference values</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Ares
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Hectares
              </th>
            </tr>
          </thead>
          <tbody>
            {REFERENCE_ROWS.map((row) => (
              <tr key={row.ares} className="border-t border-border">
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.ares)}</td>
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.hectares)}</td>
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
