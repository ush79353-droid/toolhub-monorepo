'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComparativeAdvantagePpf } from './ComparativeAdvantagePpf';
import { producerLabel } from './calculation';
import type { ComparativeAdvantageResult } from './types';

interface ComparativeAdvantageResultsProps {
  result: ComparativeAdvantageResult | null;
}

export function ComparativeAdvantageResults({
  result,
}: ComparativeAdvantageResultsProps) {
  const [showTrade, setShowTrade] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Comparative Advantage Summary
      </h3>
      <p className="text-base font-semibold text-accent">{result.summary}</p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Opportunity cost breakdown
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-accent">
              <th className="py-1.5 pr-2 font-semibold">Producer</th>
              <th className="py-1.5 pr-2 font-semibold">OC of Good A</th>
              <th className="py-1.5 font-semibold">OC of Good B</th>
            </tr>
          </thead>
          <tbody className="tabular-nums text-accent">
            <tr className="border-b border-border/60">
              <td className="py-1.5 pr-2">Country X</td>
              <td className="py-1.5 pr-2">{result.formattedOcXA}</td>
              <td className="py-1.5">{result.formattedOcXB}</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-2">Country Y</td>
              <td className="py-1.5 pr-2">{result.formattedOcYA}</td>
              <td className="py-1.5">{result.formattedOcYB}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Absolute advantage: {result.absoluteSummary}
      </p>
      <p className="text-xs text-muted-foreground">
        Relative specialization (model): Country X →{' '}
        {result.specializeX === 'none' ? 'none' : result.specializeX === 'goodA' ? 'Good A' : 'Good B'}
        {' · '}
        Country Y →{' '}
        {result.specializeY === 'none' ? 'none' : result.specializeY === 'goodA' ? 'Good A' : 'Good B'}
      </p>

      <ComparativeAdvantagePpf ppf={result.ppf} />

      <button
        type="button"
        onClick={() => setShowTrade((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showTrade ? 'Hide trade details' : 'Trade specialization & terms of trade'}
      </button>
      {showTrade ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          {result.termsOfTradeNote ? <p>{result.termsOfTradeNote}</p> : null}
          <p className="text-muted-foreground">
            Comparative winner Good A: {producerLabel(result.comparativeA)}; Good
            B: {producerLabel(result.comparativeB)}. Specialization and trade
 benefits depend on feasible terms of trade and model assumptions; 
            not guaranteed equal gains for everyone.
          </p>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/opportunity-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Opportunity Cost
        </Link>
        {' · '}
        <Link
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
        </Link>
        {' · '}
        <Link
          href="/tools/cobb-douglas-production-function-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cobb-Douglas
        </Link>
        {' · '}
        <Link
          href="/tools/marginal-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Marginal Cost
        </Link>
        {' · '}
        <Link
          href="/tools/economic-profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Economic Profit
        </Link>
        .
      </p>
    </div>
  );
}
