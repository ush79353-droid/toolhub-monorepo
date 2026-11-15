'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { PrimaryField, StorageUnit } from './types';
import { STORAGE_UNIT_BY_ID } from './types';

interface ByteConversionResultsProps {
  values: Record<PrimaryField, string> | null;
  extraValue: string | null;
  extraUnit: StorageUnit;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function ByteConversionResults({
  values,
  extraValue,
  extraUnit,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ByteConversionResultsProps) {
  if (!values) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative value in any field to convert across decimal and binary storage units.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-sm tabular-nums text-accent">
          <li className="break-all">
            {values.B} B = {values.KB} KB = {values.MB} MB = {values.GB} GB
          </li>
          {extraValue ? (
            <li className="break-all">
              = {extraValue} {STORAGE_UNIT_BY_ID[extraUnit].symbol}
            </li>
          ) : null}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Decimal units use powers of 1000. Binary units use powers of 1024.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share result'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
