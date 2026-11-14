'use client';

import { Button } from '@/components/ui/button';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { afnInterpretation } from './calculation';
import type { AfnResult } from './types';

interface AfnResultsProps {
  result: AfnResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function interpretationCopy(result: AfnResult): string {
  const kind = afnInterpretation(result.additionalFundsNeeded);
  if (kind === 'needed') {
    return 'Positive AFN means this simplified model indicates additional external financing is needed for the planned asset growth.';
  }
  if (kind === 'surplus') {
    return 'Negative AFN means the model indicates a financing surplus rather than a funding gap. The figure is not clamped to zero.';
  }
  return 'Zero AFN means spontaneous liabilities and retained earnings cover the change in assets in this simplified model.';
}

export function AdditionalFundsNeededResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AfnResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter all three changes to calculate'}
        </p>
        <p className="mt-1 max-w-md text-xs font-normal leading-relaxed text-muted-foreground">
          {invalid
            ? 'Correct the messages above. Additional funds needed stays blank until every amount is a usable number.'
            : 'AFN updates as you type. Zero is allowed. Signed changes in assets, liabilities, and retained earnings are supported.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Additional funds needed</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.additionalFundsNeeded)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
              {copied ? 'Copied' : 'Copy results'}
            </Button>
            {canShare ? (
              <Button type="button" variant="outline" size="sm" onClick={onShare} className="h-8 bg-white px-2.5 text-xs font-medium">
                {shared ? 'Shared' : 'Share'}
              </Button>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          {interpretationCopy(result)} This is a simplified financing-needs estimate, not a complete cash-flow
          forecast. {CURRENCY_DENOMINATION_NOTE}
        </p>
      </div>

      <dl className="grid gap-2 sm:grid-cols-3">
        {[
          ['Change in assets', money(result.changeInAssets)],
          ['Change in liabilities', money(result.changeInLiabilities)],
          ['Change in retained earnings', money(result.changeInRetainedEarnings)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-white px-3 py-2">
            <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-accent">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
