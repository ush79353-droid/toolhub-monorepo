'use client';

import { useState } from 'react';
import { fmt, formatGloveMeasurement, getGloveSizingChart } from './calculation';
import { CHART_SOURCE } from './chart-data';
import {
  STYLE_LABELS,
  type GloveSizeResult,
  type GloveStyle,
  type MeasurementUnit,
} from './types';

interface GloveSizeResultsProps {
  result: GloveSizeResult | null;
  gloveStyle: GloveStyle;
  displayUnit: MeasurementUnit;
}

export function GloveSizeResults({
  result,
  gloveStyle,
  displayUnit,
}: GloveSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const chart = getGloveSizingChart(gloveStyle);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter hand circumference to see an estimated glove size.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your recommended glove size
      </h3>

      {result.recommendedSize ? (
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">
            {STYLE_LABELS[result.chartStyle]} chart estimate
          </p>
          <p className="mt-1 text-2xl font-semibold text-accent">
            {result.recommendedSize}
            {result.numericSize ? (
              <span className="ml-2 text-base font-medium text-muted-foreground">
                ≈ {result.numericSize}
              </span>
            ) : null}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Circumference</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatGloveMeasurement(result.handCircumferenceCm, displayUnit)}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  ({fmt(result.handCircumferenceCm, 1)} cm /{' '}
                  {fmt(result.handCircumferenceInches, 2)} in)
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Chart range</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.minimumCircumferenceCm != null &&
                result.maximumCircumferenceCm != null
                  ? `${fmt(result.minimumCircumferenceCm, 1)}–${fmt(result.maximumCircumferenceCm, 1)} cm`
                  : '—'}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          Outside this chart&apos;s supported range — see a brand size guide.
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.fitGuidance}
      </p>
      <p className="text-[11px] text-muted-foreground">
        Glove sizes vary by manufacturer, glove material, and intended use. Check
        the product&apos;s size chart before purchasing. {result.chartSource}
      </p>

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

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
        {showChart ? 'Hide' : 'Show'} {STYLE_LABELS[gloveStyle].toLowerCase()}{' '}
        size chart
      </button>
      {showChart ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="min-w-[420px] w-full text-left text-xs">
            <caption className="sr-only">
              {STYLE_LABELS[gloveStyle]} glove size chart. {CHART_SOURCE}
            </caption>
            <thead>
              <tr className="border-b bg-muted/30">
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Size
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Numeric
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Circumference (cm)
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Circumference (in)
                </th>
              </tr>
            </thead>
            <tbody>
              {chart.sizes.map((row) => {
                const highlight = result.recommendedSize === row.label;
                return (
                  <tr
                    key={row.label}
                    className={
                      highlight
                        ? 'bg-primary/10 font-medium'
                        : 'border-b border-border/60'
                    }
                  >
                    <td className="px-2 py-1.5">{row.label}</td>
                    <td className="px-2 py-1.5">{row.numericSize ?? '—'}</td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {fmt(row.minCircumferenceCm, 1)}–
                      {fmt(row.maxCircumferenceCm, 1)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {fmt(row.minCircumferenceCm / 2.54, 2)}–
                      {fmt(row.maxCircumferenceCm / 2.54, 2)}
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
