'use client';

import * as React from 'react';
import type { AttritionRateInput, AttritionRateResult } from './types';

interface AttritionRateResultsProps {
  input: AttritionRateInput;
  result: AttritionRateResult | null;
}

export function AttritionRateResults({ input, result }: AttritionRateResultsProps) {
  if (!result) return null;

  const start = Number(input.startEmployees);
  const end = Number(input.endEmployees);
  const left = Number(input.leftEmployees);
  const netChange = end - start;

  return (
    <div className="mt-3 rounded-xl border border-border/80 bg-muted/20 p-3.5 text-xs text-muted-foreground">
      <div className="flex items-center justify-between font-medium text-accent">
        <span>Attrition Breakdown</span>
        <span className="font-semibold text-primary">{result.formattedRate}%</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-3">
        <div>
          <span className="text-muted-foreground">Average Headcount:</span>{' '}
          <strong className="text-accent">{result.averageEmployees.toLocaleString('en-US')}</strong>
        </div>
        <div>
          <span className="text-muted-foreground">Departures:</span>{' '}
          <strong className="text-accent">{left.toLocaleString('en-US')}</strong>
        </div>
        <div>
          <span className="text-muted-foreground">Net Headcount Change:</span>{' '}
          <strong className={netChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
            {netChange >= 0 ? `+${netChange}` : netChange}
          </strong>
        </div>
      </div>
    </div>
  );
}
