'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatLength } from './calculation';
import { ASTM_E11_SIEVES, type MeshToMicronResult } from './types';

const CHART_ROWS = ['10', '20', '40', '60', '100', '200', '325', '400'] as const;

interface MeshToMicronResultsProps {
  result: MeshToMicronResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MeshToMicronResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MeshToMicronResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Fix the highlighted inputs to calculate an opening.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you select a sieve or enter custom values.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {result.mode === 'custom'
            ? 'Calculated opening'
            : result.mode === 'reverse'
              ? 'Nearest standard sieve'
              : 'Nominal opening'}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatLength(result.openingUm)} µm
          {result.sieveLabel ? (
            <span className="ml-2 text-base font-semibold text-muted-foreground sm:text-lg">
              {result.sieveLabel}
            </span>
          ) : null}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{result.explanation}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Standard: {result.standard}
          {result.mode === 'standard' || result.mode === 'reverse'
            ? ' · nominal aperture, not particle size'
            : ' · square woven mesh estimate'}
          {result.reverse && !result.reverse.exact
            ? ` · Δ ${formatLength(result.reverse.differenceUm)} µm from entered value`
            : null}
        </p>
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">
          = {formatLength(result.equivalents.mm)} mm
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="sr-only">Common ASTM E11 nominal openings</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Sieve No.
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Opening (µm)
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Opening (mm)
              </th>
            </tr>
          </thead>
          <tbody>
            {CHART_ROWS.map((des) => {
              const sieve = ASTM_E11_SIEVES.find((s) => s.designation === des)!;
              return (
                <tr key={des} className="border-t border-border">
                  <td className="px-4 py-2 text-accent">{sieve.label}</td>
                  <td className="px-4 py-2 tabular-nums text-accent">{sieve.openingUm}</td>
                  <td className="px-4 py-2 tabular-nums text-accent">
                    {formatLength(sieve.openingUm / 1000)}
                  </td>
                </tr>
              );
            })}
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
