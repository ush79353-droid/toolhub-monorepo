'use client';

import { useState } from 'react';
import { fmt, formatBraSize } from './calculation';
import type { BraResult, BraSizingRegion } from './types';
import { REGION_LABELS } from './types';

interface BraSizeResultsProps {
  result: BraResult | null;
}

const REGION_ORDER: BraSizingRegion[] = ['US', 'UK', 'EU', 'AU', 'FR'];

export function BraSizeResults({ result }: BraSizeResultsProps) {
  const [showSteps, setShowSteps] = useState(false);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter underbust and bust measurements to estimate band, cup, and sister
        sizes.
      </div>
    );
  }

  const primaryOk = result.estimatedSize.fullSize !== '—';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your estimated bra size
      </h3>

      <div className="rounded-lg border border-border bg-white p-3">
        <p className="text-xs text-muted-foreground">
          Primary ({REGION_LABELS[result.estimatedSize.region]})
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {primaryOk
            ? formatBraSize(result.estimatedSize)
            : 'No estimate'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Band {result.estimatedSize.band} · Cup {result.estimatedSize.cup}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Underbust</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.underbustCm, 1)} cm (
            {fmt(result.underbustCm / 2.54, 2)} in)
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Bust</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.bustCm, 1)} cm ({fmt(result.bustCm / 2.54, 2)} in)
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Difference (B−U)</dt>
          <dd className="font-medium tabular-nums text-accent">
            {fmt(result.measurementDifferenceCm, 1)} cm
          </dd>
        </div>
      </dl>

      {primaryOk ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sister sizes
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-1.5 pr-2 font-medium">Option</th>
                  <th className="py-1.5 font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    Smaller band
                  </td>
                  <td className="py-1.5 font-medium text-accent">
                    {result.sisterSizes.smallerBand
                      ? formatBraSize(result.sisterSizes.smallerBand)
                      : '—'}
                  </td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    Calculated
                  </td>
                  <td className="py-1.5 font-medium text-accent">
                    {formatBraSize(result.sisterSizes.primary)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    Larger band
                  </td>
                  <td className="py-1.5 font-medium text-accent">
                    {result.sisterSizes.largerBand
                      ? formatBraSize(result.sisterSizes.largerBand)
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Sister sizes are alternatives to try — not guaranteed identical fits.
          </p>
        </div>
      ) : null}

      {primaryOk && Object.keys(result.regionalConversions).length > 0 ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Approximate regional equivalents
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[16rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-1.5 pr-2 font-medium">Region</th>
                  <th className="py-1.5 font-medium">Estimated size</th>
                </tr>
              </thead>
              <tbody>
                {REGION_ORDER.map((r) => {
                  const s = result.regionalConversions[r];
                  if (!s) return null;
                  return (
                    <tr key={r} className="border-b border-border/60">
                      <td className="py-1.5 pr-2 text-muted-foreground">
                        {REGION_LABELS[r]}
                      </td>
                      <td className="py-1.5 font-medium tabular-nums text-accent">
                        {formatBraSize(s)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Equivalences are approximate — letter progressions diverge by market.
          </p>
        </div>
      ) : null}

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Fit reminders
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.fittingGuidance.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>

      {result.warnings.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-amber-900">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
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
