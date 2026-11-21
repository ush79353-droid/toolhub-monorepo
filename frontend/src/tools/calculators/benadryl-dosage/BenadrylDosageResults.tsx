'use client';

import type { BenadrylDosageResult } from './types';

function renderMarked(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-accent">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

interface BenadrylDosageResultsProps {
  result: BenadrylDosageResult | null;
}

export function BenadrylDosageResults({ result }: BenadrylDosageResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {renderMarked(result.indicationHtmlSafe)}
      </p>

      {result.maxDosesNote ? (
        <div className="flex gap-3 rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-sm text-accent">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
            aria-hidden
          >
            ✚
          </span>
          <p className="leading-relaxed">
            Administer{' '}
            <strong className="font-semibold">
              a maximum of {result.maxDosesPer24Hours} doses
            </strong>{' '}
            over 24 hours.
          </p>
        </div>
      ) : null}

      {result.status === 'awaiting_age' ? (
        <p className="text-sm text-muted-foreground">
          Enter age to see the label dose band for this product.
        </p>
      ) : (
        <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5">
          <p className="text-[13px] font-medium text-accent">Label dose</p>
          {result.doseLine ? (
            <p className="text-lg font-semibold tabular-nums text-accent">
              {result.doseLine}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.interpretation}
          </p>
          <p className="text-xs text-muted-foreground">{result.frequencyNote}</p>
          <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
