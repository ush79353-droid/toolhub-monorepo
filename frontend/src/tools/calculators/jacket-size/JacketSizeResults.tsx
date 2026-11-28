'use client';

import { useState } from 'react';
import { getJacketSizeChart } from './chart-data';
import { formatCircumference, formatHeight, fmt } from './calculation';
import {
  CATEGORY_LABELS,
  LENGTH_LABELS,
  type CircumferenceUnit,
  type HeightUnit,
  type JacketSizeResult,
} from './types';

interface JacketSizeResultsProps {
  result: JacketSizeResult | null;
  chestUnit: CircumferenceUnit;
  heightUnit: HeightUnit;
  showChart: boolean;
  onToggleChart: () => void;
}

export function JacketSizeResults({
  result,
  chestUnit,
  heightUnit,
  showChart,
  onToggleChart,
}: JacketSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter chest circumference to see a recommended jacket size.
      </div>
    );
  }

  const chart = getJacketSizeChart(result.category);
  const highlightUs = result.usSize;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your recommended jacket size
      </h3>
      <p className="text-xs text-muted-foreground">
        {CATEGORY_LABELS[result.category]} · Chest{' '}
        {formatCircumference(result.chestCm, chestUnit)}
        {result.heightCm != null
          ? ` · Height ${formatHeight(result.heightCm, heightUnit)}`
          : ''}
      </p>

      {result.isOutOfRange ? (
        <p className="text-sm text-rose-700">{result.explanation}</p>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-white px-4 py-3">
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-3xl font-bold tracking-tight text-accent">
              {result.primaryDisplay}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">International</dt>
              <dd className="font-semibold text-accent">
                {result.internationalSize}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">US</dt>
              <dd className="font-semibold text-accent">{result.usSize}</dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">UK</dt>
              <dd className="font-semibold text-accent">{result.ukSize}</dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">EU</dt>
              <dd className="font-semibold text-accent">{result.euSize}</dd>
            </div>
          </dl>

          {result.jacketLength ? (
            <p className="text-sm text-accent">
              Length: <strong>{LENGTH_LABELS[result.jacketLength]}</strong>
            </p>
          ) : null}

          {result.chestRangeCm ? (
            <p className="text-xs text-muted-foreground">
              Chart chest band:{' '}
              {fmt(result.chestRangeCm.min, 0)}–
              {fmt(result.chestRangeCm.max, 0)} cm (
              {formatCircumference(result.chestRangeCm.min, 'in')}–
              {formatCircumference(result.chestRangeCm.max, 'in')})
            </p>
          ) : null}

          {result.isBetweenSizes ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Your measurements fall between two jacket sizes.
              {result.alternativeSizes.length > 0
                ? ` Nearby: ${result.alternativeSizes.join('; ')}.`
                : ''}{' '}
              Smaller may fit closer; larger allows more movement or layering.
            </div>
          ) : null}

          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
          <p className="text-xs text-muted-foreground">{result.fitGuidance}</p>
        </>
      )}

      {result.warnings.map((w) => (
        <p key={w} className="text-xs text-amber-800">
          {w}
        </p>
      ))}

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
        {showChart ? 'Hide' : 'Show'}{' '}
        {result.category === 'men' ? "men's" : "women's"} jacket size chart
      </button>

      {showChart ? (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">
            {result.sizingReference}
          </p>
          <div className="overflow-x-auto rounded-lg border border-border bg-white">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-muted/40 text-accent">
                <tr>
                  <th className="px-2 py-1.5 font-semibold">Chest cm</th>
                  <th className="px-2 py-1.5 font-semibold">Chest in</th>
                  <th className="px-2 py-1.5 font-semibold">US/UK</th>
                  <th className="px-2 py-1.5 font-semibold">EU</th>
                  <th className="px-2 py-1.5 font-semibold">Int</th>
                </tr>
              </thead>
              <tbody>
                {chart.map((row) => {
                  const active = highlightUs === row.us;
                  return (
                    <tr
                      key={`${row.us}-${row.eu}-${row.minChestCm}`}
                      className={
                        active ? 'bg-primary/10 font-semibold' : undefined
                      }
                    >
                      <td className="px-2 py-1">
                        {row.minChestCm}–{row.maxChestCm}
                      </td>
                      <td className="px-2 py-1">
                        {fmt(row.minChestCm / 2.54, 1)}–
                        {fmt(row.maxChestCm / 2.54, 1)}
                      </td>
                      <td className="px-2 py-1">{row.us}</td>
                      <td className="px-2 py-1">{row.eu}</td>
                      <td className="px-2 py-1">{row.international}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
