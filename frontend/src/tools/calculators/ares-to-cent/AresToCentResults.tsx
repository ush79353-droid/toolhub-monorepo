'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatArea } from './calculation';
import type { AresToCentResult } from './types';

const REFERENCE_ROWS = [
  { ares: 0, cents: 0 },
  { ares: 1, cents: 2.471053814671653 },
  { ares: 2, cents: 4.942107629343306 },
  { ares: 3, cents: 7.413161444014959 },
  { ares: 4, cents: 9.884215258686612 },
  { ares: 5, cents: 12.355269073358266 },
  { ares: 10, cents: 24.71053814671653 },
  { ares: 20, cents: 49.42107629343306 },
  { ares: 50, cents: 123.55269073358266 },
  { ares: 100, cents: 247.1053814671653 },
] as const;

interface AresToCentResultsProps {
  result: AresToCentResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function AresToCentResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AresToCentResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative area in ares or cents to convert.
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
          {formatArea(result.ares)} a ≈ {formatArea(result.cents)} cent
        </p>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground">{result.explanation}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          1 are ≈ 2.47105381467 cents · 1 cent = 0.40468564224 ares
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[240px] text-left text-sm">
          <caption className="sr-only">Ares to cents reference values</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Ares
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Cents
              </th>
            </tr>
          </thead>
          <tbody>
            {REFERENCE_ROWS.map((row) => (
              <tr key={row.ares} className="border-t border-border">
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.ares)}</td>
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.cents)}</td>
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
