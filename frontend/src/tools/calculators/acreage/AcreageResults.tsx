'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { areaUnitLabel } from './calculation';
import type { AcreageResult } from './types';

interface AcreageResultsProps {
  result: AcreageResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function formatArea(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

export function AcreageResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AcreageResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid values to see the acreage result.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter width and length, or an area to convert.
      </p>
    );
  }

  const unit = areaUnitLabel(result.areaUnit);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {result.mode === 'dimensions' ? 'Rectangular area' : 'Converted area'}
        </p>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-accent">
          {formatArea(result.areaDisplay)}{' '}
          <span className="text-lg font-semibold text-primary">{unit}</span>
        </p>
        {result.mode === 'dimensions' &&
        result.widthDisplay !== null &&
        result.lengthDisplay !== null ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {formatArea(result.widthDisplay)} {result.widthUnit} × {formatArea(result.lengthDisplay)}{' '}
            {result.lengthUnit}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Area conversion only. Width and length are not estimated from area alone.
          </p>
        )}
      </div>

      {result.totalPrice !== null ? (
        <div className="rounded-xl border border-border px-4 py-3.5 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total price
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
            {formatCurrencyValue(result.totalPrice, result.currency)}
          </p>
          {result.pricePerUnit !== null ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrencyValue(result.pricePerUnit, result.currency)} per{' '}
              {areaUnitLabel(result.priceAreaUnit)}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="sr-only">Area converted into common land units</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Unit
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {result.conversions.map((row) => (
              <tr key={row.unit} className="border-t border-border">
                <td className="px-4 py-2 text-accent">{row.label}</td>
                <td className="px-4 py-2 tabular-nums text-accent">{formatArea(row.value)}</td>
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
