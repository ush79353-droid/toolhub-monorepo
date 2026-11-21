'use client';

import type { PositivePregnancyTestAt3WeeksResult } from './types';

interface Props {
  result: PositivePregnancyTestAt3WeeksResult | null;
}

export function PositivePregnancyTestAt3WeeksResults({ result }: Props) {
  if (!result) return null;

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5">
      <p className="text-[13px] font-medium text-accent">Timing summary</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      {result.sensitivityNote ? (
        <p className="text-xs text-muted-foreground">{result.sensitivityNote}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      <p className="text-xs text-muted-foreground">
        This article tool does not output a yes/no answer about whether a
        positive test at “3 weeks pregnant” is possible for you.
      </p>
    </div>
  );
}
