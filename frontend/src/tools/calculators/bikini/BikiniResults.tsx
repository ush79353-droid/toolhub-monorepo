'use client';

import { useState } from 'react';
import { fmt } from './calculation';
import { BikiniShapeIllustration } from './BikiniShapeIllustration';
import type { BikiniRecommendation, BikiniResult } from './types';

interface BikiniResultsProps {
  result: BikiniResult | null;
}

function RecList({
  title,
  items,
}: {
  title: string;
  items: BikiniRecommendation[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-2 space-y-2">
        {items.slice(0, 4).map((item) => (
          <li
            key={item.style}
            className="rounded-lg border border-border bg-white px-3 py-2"
          >
            <p className="text-sm font-medium text-accent">{item.style}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.description} {item.reason}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Coverage: {item.coverage} · Support: {item.support}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BikiniResults({ result }: BikiniResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter bust, waist, high-hip, and hip measurements to explore a
        proportion category and optional style ideas.
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Your body shape</h3>

      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <BikiniShapeIllustration shape={result.bodyShape} />
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-muted-foreground">Category (heuristic)</p>
          <p className="mt-1 text-xl font-semibold text-accent">
            {result.bodyShapeLabel}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Bust-to-hip (BHR)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.bustToHipRatio, 3)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Waist-to-hip (WHR)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.waistToHipRatio, 3)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Waist-to-bust (WBR)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.waistToBustRatio, 3)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Bust − hip</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.bustHipDifferenceCm, 1)} cm
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Hip − high hip</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.highHipDifferenceCm, 1)} cm
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Waist definition</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.metrics.waistDefinitionCm, 1)} cm
          </dd>
        </div>
      </dl>

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      <RecList title="Suggested tops" items={result.recommendedTops} />
      <RecList title="Suggested bottoms" items={result.recommendedBottoms} />
      {result.alternativeStyles.length > 0 ? (
        <RecList title="Alternatives" items={result.alternativeStyles} />
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide' : 'Show'} calculation steps
      </button>
      {showSteps ? (
        <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-accent">
          {result.formulaSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
