'use client';

import { useState } from 'react';
import {
  CHART_FINISHED_SIZES_IN,
  formatFractionalInches,
  formatLength,
  fmt,
  generateHSTSizeChart,
} from './calculation';
import {
  CUTTING_LABELS,
  METHOD_LABELS,
  type HSTResult,
  type LengthUnit,
} from './types';

interface HSTResultsProps {
  result: HSTResult | null;
  displayUnit: LengthUnit;
  showChart: boolean;
  onToggleChart: () => void;
}

export function HSTResults({
  result,
  displayUnit,
  showChart,
  onToggleChart,
}: HSTResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter a finished size, raw square, or diagonal to calculate HST cutting
        dimensions.
      </div>
    );
  }

  const chart = generateHSTSizeChart({
    finishedSizesIn: CHART_FINISHED_SIZES_IN,
    seamAllowanceIn: result.seamAllowanceIn,
    cutting: result.cuttingPreference,
    extraTrimmingIn: 0.125,
  });

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Half square triangle results
      </h3>
      <p className="text-xs text-muted-foreground">
        {METHOD_LABELS[result.constructionMethod]} ·{' '}
        {CUTTING_LABELS[result.cuttingPreference]}
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Finished HST</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatLength(result.finishedSizeIn, displayUnit)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Unfinished HST</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatLength(result.unfinishedSizeIn, displayUnit)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Raw square</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
            {formatLength(result.rawSquareSizeIn, displayUnit)}
          </p>
          {displayUnit === 'in' ? (
            <p className="text-[11px] text-muted-foreground">
              ≈ {formatFractionalInches(result.rawSquareSizeIn)}″ (⅛ display)
            </p>
          ) : null}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Finished diagonal</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatLength(result.finishedDiagonalIn, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Raw diagonal</dt>
          <dd className="font-medium tabular-nums text-accent">
            {formatLength(result.rawSquareDiagonalIn, displayUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">HSTs / pair</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.blocksPerPair}
          </dd>
        </div>
        {result.requiredPairs != null ? (
          <>
            <div>
              <dt className="text-xs text-muted-foreground">Square pairs</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.requiredPairs}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Fabric squares</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.totalFabricSquares}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Surplus HSTs</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.surplusBlocks}
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} formulas
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
        onClick={onToggleChart}
        aria-expanded={showChart}
      >
        {showChart ? 'Hide' : 'Show'} HST size chart
      </button>
      {showChart ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="min-w-[520px] w-full text-left text-xs">
            <caption className="sr-only">
              Half square triangle cutting chart using{' '}
              {CUTTING_LABELS[result.cuttingPreference]} and seam{' '}
              {fmt(result.seamAllowanceIn, 3)} in.
            </caption>
            <thead>
              <tr className="border-b bg-muted/30">
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Finished
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  Unfinished
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  2-at-a-time raw
                </th>
                <th scope="col" className="px-2 py-1.5 font-semibold">
                  8-at-a-time raw
                </th>
              </tr>
            </thead>
            <tbody>
              {chart.map((row) => {
                const highlight =
                  Math.abs(row.finished - result.finishedSizeIn) < 0.01;
                return (
                  <tr
                    key={row.finished}
                    className={
                      highlight
                        ? 'bg-primary/10 font-medium'
                        : 'border-b border-border/60'
                    }
                  >
                    <td className="px-2 py-1.5 tabular-nums">
                      {formatLength(row.finished, displayUnit, 2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {formatLength(row.unfinished, displayUnit, 2)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {formatLength(row.twoAtATime, displayUnit, 3)}
                    </td>
                    <td className="px-2 py-1.5 tabular-nums">
                      {formatLength(row.eightAtATime, displayUnit, 3)}
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
