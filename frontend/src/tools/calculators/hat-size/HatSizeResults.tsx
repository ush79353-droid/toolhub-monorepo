'use client';

import { useState } from 'react';
import { ADULT_HAT_CHART, CHILD_HAT_CHART } from './chart-data';
import { formatLength, fmt } from './calculation';
import {
  CATEGORY_LABELS,
  type HatSizeResult,
  type HatLengthUnit,
} from './types';

interface HatSizeResultsProps {
  result: HatSizeResult | null;
  displayUnit: HatLengthUnit;
  showChart: boolean;
  onToggleChart: () => void;
}

export function HatSizeResults({
  result,
  displayUnit,
  showChart,
  onToggleChart,
}: HatSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter head circumference to see recommended hat sizes.
      </div>
    );
  }

  const highlightAdultCm = result.matchedAdultRow?.circumferenceCm;
  const highlightChild = result.matchedChildRow?.sizeLabel;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your recommended hat size
      </h3>
      <p className="text-xs text-muted-foreground">
        {CATEGORY_LABELS[result.category]} ·{' '}
        {formatLength(result.headCircumferenceCm, displayUnit)} (
        {fmt(result.headCircumferenceCm, 1)} cm)
      </p>

      {result.isOutOfRange ? (
        <p className="text-sm text-rose-700">{result.explanation}</p>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-white px-4 py-3">
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-3xl font-bold tracking-tight text-accent">
              {result.recommendation}
            </p>
          </div>

          {result.category === 'adult' ? (
            <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">International</dt>
                <dd className="font-semibold text-accent">
                  {result.international}
                </dd>
              </div>
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">US</dt>
                <dd className="font-semibold text-accent">{result.us}</dd>
              </div>
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">UK</dt>
                <dd className="font-semibold text-accent">{result.uk}</dd>
              </div>
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">EU</dt>
                <dd className="font-semibold text-accent">{result.eu}</dd>
              </div>
            </dl>
          ) : (
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">Child size</dt>
                <dd className="font-semibold text-accent">
                  {result.childSizeLabel}
                </dd>
              </div>
              <div className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-xs text-muted-foreground">Approx. age</dt>
                <dd className="font-semibold text-accent">{result.childAge}</dd>
              </div>
            </dl>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
          {result.isBetweenSizes && result.betweenNote ? (
            <p className="text-xs text-amber-800">{result.betweenNote}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">{result.fitGuidance}</p>
        </>
      )}

      <button
        type="button"
        className="text-xs font-medium text-primary hover:underline"
        onClick={() => setShowSteps((s) => !s)}
      >
        {showSteps ? 'Hide' : 'Show'} steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.formulaSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className="text-xs font-medium text-primary hover:underline"
        onClick={onToggleChart}
      >
        {showChart ? 'Hide' : 'Show'} size chart
      </button>

      {showChart ? (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">{result.chartSource}</p>
          {result.category === 'adult' ? (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-muted/40 text-accent">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">cm</th>
                    <th className="px-2 py-1.5 font-semibold">in</th>
                    <th className="px-2 py-1.5 font-semibold">Int</th>
                    <th className="px-2 py-1.5 font-semibold">US</th>
                    <th className="px-2 py-1.5 font-semibold">UK</th>
                    <th className="px-2 py-1.5 font-semibold">EU</th>
                  </tr>
                </thead>
                <tbody>
                  {ADULT_HAT_CHART.map((row) => {
                    const active = highlightAdultCm === row.circumferenceCm;
                    return (
                      <tr
                        key={row.circumferenceCm}
                        className={
                          active ? 'bg-primary/10 font-semibold' : undefined
                        }
                      >
                        <td className="px-2 py-1">{row.circumferenceCm}</td>
                        <td className="px-2 py-1">
                          {fmt(row.circumferenceCm / 2.54, 2)}
                        </td>
                        <td className="px-2 py-1">{row.international}</td>
                        <td className="px-2 py-1">{row.us}</td>
                        <td className="px-2 py-1">{row.uk}</td>
                        <td className="px-2 py-1">{row.eu}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-muted/40 text-accent">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Approx. age</th>
                    <th className="px-2 py-1.5 font-semibold">cm range</th>
                    <th className="px-2 py-1.5 font-semibold">in range</th>
                    <th className="px-2 py-1.5 font-semibold">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {CHILD_HAT_CHART.map((row) => {
                    const active = highlightChild === row.sizeLabel;
                    return (
                      <tr
                        key={row.sizeLabel}
                        className={
                          active ? 'bg-primary/10 font-semibold' : undefined
                        }
                      >
                        <td className="px-2 py-1">{row.approximateAge}</td>
                        <td className="px-2 py-1">
                          {row.minCircumferenceCm}–{row.maxCircumferenceCm}
                        </td>
                        <td className="px-2 py-1">
                          {fmt(row.minCircumferenceCm / 2.54, 1)}–
                          {fmt(row.maxCircumferenceCm / 2.54, 1)}
                        </td>
                        <td className="px-2 py-1">{row.sizeLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
