'use client';

import { useState } from 'react';
import { formatMeasure } from './calculation';
import { DRESS_SIZE_CHART, CHART_SOURCE } from './chart-data';
import {
  labelForSystem,
  type DressSizeResult,
  type DressSizingSystem,
  type MeasurementUnit,
} from './types';

interface DressSizeResultsProps {
  result: DressSizeResult | null;
  preferredSystem: DressSizingSystem;
  displayUnit: MeasurementUnit;
}

export function DressSizeResults({
  result,
  preferredSystem,
  displayUnit,
}: DressSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showChart, setShowChart] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter bust, waist, and hip measurements to see a chart-based dress size
        estimate.
      </div>
    );
  }

  const rec = result.recommended;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Recommended dress size</h3>

      {rec ? (
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">
            Preferred system · chart estimate
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
            {labelForSystem(rec, preferredSystem)}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">US</dt>
              <dd className="font-medium text-accent">{rec.usSize}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">UK</dt>
              <dd className="font-medium text-accent">{rec.ukSize}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">EU</dt>
              <dd className="font-medium text-accent">{rec.euSize}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">International</dt>
              <dd className="font-medium text-accent">
                {rec.internationalSize}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          Outside this chart&apos;s supported range — see a brand extended-size
          guide.
        </div>
      )}

      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-2.5">
          <dt className="text-xs text-muted-foreground">
            Bust {formatMeasure(result.bustCm, displayUnit)}
          </dt>
          <dd className="font-medium text-accent">
            {result.bustMatch
              ? labelForSystem(result.bustMatch, preferredSystem)
              : '—'}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-white p-2.5">
          <dt className="text-xs text-muted-foreground">
            Waist {formatMeasure(result.waistCm, displayUnit)}
          </dt>
          <dd className="font-medium text-accent">
            {result.waistMatch
              ? labelForSystem(result.waistMatch, preferredSystem)
              : '—'}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-white p-2.5">
          <dt className="text-xs text-muted-foreground">
            Hips {formatMeasure(result.hipsCm, displayUnit)}
          </dt>
          <dd className="font-medium text-accent">
            {result.hipsMatch
              ? labelForSystem(result.hipsMatch, preferredSystem)
              : '—'}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.fitGuidance}
      </p>
      <p className="text-[11px] text-muted-foreground">{result.chartSource}</p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} match steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-accent">
          {result.formulaSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowChart((s) => !s)}
        aria-expanded={showChart}
      >
        {showChart ? 'Hide' : 'Show'} size chart
      </button>
      {showChart ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="min-w-[640px] w-full text-left text-xs">
            <caption className="sr-only">
              Illustrative dress size chart in {displayUnit}. {CHART_SOURCE}
            </caption>
            <thead>
              <tr className="border-b bg-muted/30">
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  US
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  UK
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  EU
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Int
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Bust
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Waist
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Hips
                </th>
              </tr>
            </thead>
            <tbody>
              {DRESS_SIZE_CHART.map((row) => {
                const highlight = rec?.usSize === row.usSize;
                const range = (min: number, max: number) =>
                  `${formatMeasure(min, displayUnit).replace(` ${displayUnit}`, '')}–${formatMeasure(max, displayUnit)}`;
                return (
                  <tr
                    key={row.usSize}
                    className={
                      highlight
                        ? 'bg-primary/10 font-medium'
                        : 'border-b border-border/60'
                    }
                  >
                    <td className="px-2 py-1.5">{row.usSize}</td>
                    <td className="px-2 py-1.5">{row.ukSize}</td>
                    <td className="px-2 py-1.5">{row.euSize}</td>
                    <td className="px-2 py-1.5">{row.internationalSize}</td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {range(row.bustMinCm, row.bustMaxCm)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {range(row.waistMinCm, row.waistMaxCm)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {range(row.hipsMinCm, row.hipsMaxCm)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
