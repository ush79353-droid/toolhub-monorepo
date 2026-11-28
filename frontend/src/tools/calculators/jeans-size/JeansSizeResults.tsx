'use client';

import { useState } from 'react';
import {
  getMensJeansSizeChart,
  getWomensJeansSizeChart,
} from './chart-data';
import { formatLength, fmt } from './calculation';
import {
  CATEGORY_LABELS,
  METHOD_LABELS,
  type JeansSizeResult,
  type JeansUnit,
} from './types';

interface JeansSizeResultsProps {
  result: JeansSizeResult | null;
  displayUnit: JeansUnit;
  showChart: boolean;
  onToggleChart: () => void;
}

export function JeansSizeResults({
  result,
  displayUnit,
  showChart,
  onToggleChart,
}: JeansSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter waist and inseam to see a recommended jeans size.
      </div>
    );
  }

  const highlight = result.waistSize;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your recommended jeans size
      </h3>
      <p className="text-xs text-muted-foreground">
        {CATEGORY_LABELS[result.category]} ·{' '}
        {METHOD_LABELS[result.measurementMethod]} · Waist{' '}
        {formatLength(result.waistCm, displayUnit)} · Inseam{' '}
        {formatLength(result.inseamCm, displayUnit)}
      </p>

      {result.isOutOfRange ? (
        <p className="text-sm text-rose-700">{result.explanation}</p>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-white px-4 py-3">
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-3xl font-bold tracking-tight text-accent">
              {result.combinedSize ?? result.waistSize}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">Waist (W)</dt>
              <dd className="font-semibold text-accent">{result.waistSize}</dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">Length (L)</dt>
              <dd className="font-semibold text-accent">{result.inseamSize}</dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">International</dt>
              <dd className="font-semibold text-accent">
                {result.internationalSize}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">US / UK / EU</dt>
              <dd className="font-semibold text-accent">
                {result.usSize} / {result.ukSize} / {result.euSize}
              </dd>
            </div>
          </dl>

          {result.isBetweenWaist ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Your waist measurement falls between two jeans sizes.
              {result.alternativeSizes.length > 0
                ? ` Nearby: ${result.alternativeSizes.join(', ')}.`
                : ''}
            </div>
          ) : null}

          {result.isBetweenInseam && result.alternativeInseams.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Inseam is near {result.inseamSize} and{' '}
              {result.alternativeInseams.join(', ')}. Shorter sits higher on the
              ankle; longer may stack or need hemming.
            </div>
          ) : null}

          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
          <p className="text-xs text-muted-foreground">{result.fitGuidance}</p>
          <p className="text-xs text-muted-foreground">{result.riseGuidance}</p>
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
        {result.category === 'men' ? "men's" : "women's"} jeans size chart
      </button>

      {showChart ? (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">
            {result.sizingReference}
          </p>
          {result.category === 'men' ? (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-muted/40 text-accent">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Waist size</th>
                    <th className="px-2 py-1.5 font-semibold">Body waist cm</th>
                    <th className="px-2 py-1.5 font-semibold">Body waist in</th>
                    <th className="px-2 py-1.5 font-semibold">Int</th>
                  </tr>
                </thead>
                <tbody>
                  {getMensJeansSizeChart().map((row) => (
                    <tr
                      key={row.waistLabel}
                      className={
                        highlight === row.waistLabel
                          ? 'bg-primary/10 font-semibold'
                          : undefined
                      }
                    >
                      <td className="px-2 py-1">{row.waistLabel}</td>
                      <td className="px-2 py-1">
                        {row.minWaistCm}–{row.maxWaistCm}
                      </td>
                      <td className="px-2 py-1">
                        {fmt(row.minWaistCm / 2.54, 1)}–
                        {fmt(row.maxWaistCm / 2.54, 1)}
                      </td>
                      <td className="px-2 py-1">{row.international}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-muted/40 text-accent">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Waist cm</th>
                    <th className="px-2 py-1.5 font-semibold">Waist in</th>
                    <th className="px-2 py-1.5 font-semibold">W</th>
                    <th className="px-2 py-1.5 font-semibold">US</th>
                    <th className="px-2 py-1.5 font-semibold">UK</th>
                    <th className="px-2 py-1.5 font-semibold">EU</th>
                    <th className="px-2 py-1.5 font-semibold">Int</th>
                  </tr>
                </thead>
                <tbody>
                  {getWomensJeansSizeChart().map((row) => (
                    <tr
                      key={row.waistLabel}
                      className={
                        highlight === row.waistLabel
                          ? 'bg-primary/10 font-semibold'
                          : undefined
                      }
                    >
                      <td className="px-2 py-1">
                        {row.minWaistCm}–{row.maxWaistCm}
                      </td>
                      <td className="px-2 py-1">
                        {fmt(row.minWaistCm / 2.54, 1)}–
                        {fmt(row.maxWaistCm / 2.54, 1)}
                      </td>
                      <td className="px-2 py-1">{row.waistLabel}</td>
                      <td className="px-2 py-1">{row.us}</td>
                      <td className="px-2 py-1">{row.uk}</td>
                      <td className="px-2 py-1">{row.eu}</td>
                      <td className="px-2 py-1">{row.international}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
