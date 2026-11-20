'use client';

import type { CrossPriceElasticityResult } from './types';

interface CrossPriceElasticityResultsProps {
  result: CrossPriceElasticityResult | null;
}

function relationshipLabel(
  relationship: CrossPriceElasticityResult['relationship']
): string {
  switch (relationship) {
    case 'substitutes':
      return 'Substitute-consistent (positive)';
    case 'complements':
      return 'Complement-consistent (negative)';
    case 'approximatelyUnrelated':
      return 'Approximately unrelated (≈ 0)';
    default:
      return 'Unknown';
  }
}

function magnitudeLabel(
  magnitude: CrossPriceElasticityResult['magnitude']
): string {
  switch (magnitude) {
    case 'inelastic':
      return 'Relatively inelastic (|E| < 1)';
    case 'unitMagnitude':
      return 'Unit-magnitude (|E| ≈ 1)';
    case 'elastic':
      return 'Relatively elastic (|E| > 1)';
    case 'zero':
      return 'Zero response';
    default:
      return '—';
  }
}

export function CrossPriceElasticityResults({
  result,
}: CrossPriceElasticityResultsProps) {
  if (!result) return null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Cross-price elasticity summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Method</dt>
          <dd className="text-accent">
            {result.method === 'midpoint'
              ? 'Midpoint (arc)'
              : 'Initial-value'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">%Δ price of A</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedPriceChangePercentage}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">%Δ demand for B</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedDemandChangePercentage}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Elasticity (EBA)</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedElasticity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Observed relationship</dt>
          <dd className="text-right text-accent">
            {relationshipLabel(result.relationship)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Magnitude</dt>
          <dd className="text-right text-accent">
            {magnitudeLabel(result.magnitude)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        EBA = %ΔQB / %ΔPA
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
    </div>
  );
}
