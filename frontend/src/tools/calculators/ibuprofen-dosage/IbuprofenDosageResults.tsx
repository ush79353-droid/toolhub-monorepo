'use client';

import type { IbuprofenDosageResult } from './types';

interface IbuprofenDosageResultsProps {
  result: IbuprofenDosageResult;
}

export function IbuprofenDosageResults({ result }: IbuprofenDosageResultsProps) {
  if (result.status === 'awaiting_weight') {
    return (
      <p className="text-sm text-muted-foreground">{result.interpretation}</p>
    );
  }

  if (result.status === 'age_gate_blocked') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-sm text-accent">
        <p className="font-medium">Age confirmation required</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          {result.interpretation}
        </p>
      </div>
    );
  }

  if (result.status === 'ask_doctor' || result.status === 'out_of_chart') {
    return (
      <div className="rounded-xl border border-border bg-muted/15 p-3.5 text-sm">
        <p className="font-medium text-accent">Ask a doctor</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          {result.interpretation}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{result.disclaimer}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5">
      <p className="text-[13px] font-medium text-accent">Label dose</p>
      {result.productLabel ? (
        <p className="text-sm text-muted-foreground">{result.productLabel}</p>
      ) : null}
      {result.concentrationNote ? (
        <p className="text-xs text-muted-foreground">{result.concentrationNote}</p>
      ) : null}
      {result.doseLine ? (
        <p className="text-lg font-semibold tabular-nums text-accent">
          {result.doseLine}
        </p>
      ) : null}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs text-muted-foreground">
        Maximum {result.maxDosesPer24Hours} doses in 24 hours.
      </p>
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
    </div>
  );
}
