'use client';

import type { ToolComponentProps } from '@/tools/types';
import { AustraliaTaxCutsForm } from './AustraliaTaxCutsForm';

/**
 * UI shell — GST navigation and Share/Reload/Clear/feedback land in the next commit.
 */
export function AustraliaFederalBudgetTaxCutsCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Unavailable historical notice — not a current Australian income tax estimator.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AustraliaTaxCutsForm />
      </div>
    </section>
  );
}
