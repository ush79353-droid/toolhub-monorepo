'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/tools/shared/currency';
import type { ThreeDPrinterResult } from './types';

interface ThreeDPrinterResultsProps {
  result: ThreeDPrinterResult | null;
  copied: boolean;
  onCopy: () => void;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

export function ThreeDPrinterBuyVsOutsourceResults({ result, copied, onCopy }: ThreeDPrinterResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the messages above to refresh the comparison.
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const perPart = (value: number | null) => (value === null ? '—' : money(value));
  const recommendation =
    result.recommendation === 'buy'
      ? 'Buying is cheaper under these assumptions'
      : result.recommendation === 'outsource'
        ? 'Outsourcing is cheaper under these assumptions'
        : 'The two options cost the same under these assumptions';
  const savingsLabel = result.netSavings > 0 ? 'Savings from buying' : result.netSavings < 0 ? 'Extra cost of buying' : 'Cost difference';
  const breakEven =
    result.breakEvenParts === null
      ? 'No break-even under current assumptions'
      : `${formatCount(result.breakEvenParts)} successful parts (${formatCount(result.breakEvenMonths ?? 0)} months)`;

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">{recommendation}</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(Math.abs(result.netSavings))}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{savingsLabel}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
            {copied ? 'Copied' : 'Copy results'}
          </Button>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          A financial estimate from the amounts you entered, not a guarantee of print quality, delivery time, or resale.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Metric label="Buy and operate" value={money(result.totalInHouseCost)} />
        <Metric label="Outsource" value={money(result.totalOutsourcingCost)} />
        <Metric label="In-house cost per part" value={perPart(result.inHouseCostPerPart)} />
        <Metric label="Outsource cost per part" value={perPart(result.outsourceCostPerPart)} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Break-even: {breakEven}.
        {result.breakEvenParts === null
          ? ' Shown when each successful part is cheaper in-house and the monthly savings can repay the printer.'
          : result.breakEvenDependsOnTimeline
            ? ' Assumes the same parts per month and the same orders per month. Maintenance and shipping change if the timeline changes, so this is not a part count that ignores the calendar.'
            : ' Maintenance and shipping are zero, so this part count does not depend on spreading those costs over time.'}
      </p>

      {result.resaleExceedsInvestment ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          Resale value is higher than the printer price plus setup cost. The comparison still subtracts it, which can make ownership look like a credit.
        </p>
      ) : null}

      <CostChart points={result.points} currency={result.currency} />

      <dl className="grid grid-cols-2 gap-2.5 rounded-xl border border-border bg-white p-3 text-sm">
        <Breakdown term="Successful parts" value={formatCount(result.totalParts)} />
        <Breakdown term="Expected attempts" value={formatCount(result.expectedAttempts)} />
        <Breakdown term="Material" value={money(result.materialCost)} />
        <Breakdown term="Electricity" value={money(result.electricityCost)} />
        <Breakdown term="Labor" value={money(result.laborCost)} />
        <Breakdown term="Maintenance" value={money(result.maintenanceCost)} />
        <Breakdown term="Ownership after resale" value={money(result.fixedOwnershipCost)} />
        <Breakdown term="Service parts" value={money(result.outsourcingPartsCost)} />
        <Breakdown term="Shipping" value={money(result.shippingCost)} />
        <Breakdown term="Service fee" value={money(result.oneTimeServiceFee)} />
      </dl>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-normal text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent sm:text-base">{value}</p>
    </div>
  );
}

function Breakdown({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{term}</dt>
      <dd className="font-medium tabular-nums text-accent">{value}</dd>
    </div>
  );
}

function CostChart({
  points,
  currency,
}: {
  points: ThreeDPrinterResult['points'];
  currency: ThreeDPrinterResult['currency'];
}) {
  if (points.length === 0) return null;
  const width = 320;
  const height = 140;
  const pad = 8;
  const maxCost = Math.max(...points.flatMap((point) => [point.inHouseCost, point.outsourcingCost]), 1);
  const minMonth = points[0]?.month ?? 0;
  const maxMonth = points[points.length - 1]?.month ?? 1;
  const span = Math.max(maxMonth - minMonth, 1);
  const x = (month: number) => pad + ((month - minMonth) / span) * (width - pad * 2);
  const y = (cost: number) => height - pad - (cost / maxCost) * (height - pad * 2);
  const line = (key: 'inHouseCost' | 'outsourcingCost') =>
    points.map((point) => `${x(point.month)},${y(point[key])}`).join(' ');

  return (
    <figure className="rounded-xl border border-border bg-white p-3">
      <figcaption className="text-xs font-medium text-accent">Cumulative cost by month</figcaption>
      <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-primary" aria-hidden="true" /> Buy
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-accent" aria-hidden="true" /> Outsource
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-36 w-full" role="img" aria-label="Cumulative in-house and outsourcing cost over the comparison">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" points={line('inHouseCost')} />
        <polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" points={line('outsourcingCost')} />
      </svg>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-primary">Month-by-month amounts</summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Cumulative buy and outsource costs at each plotted month</caption>
            <thead>
              <tr className="text-muted-foreground">
                <th scope="col" className="py-1 font-medium">Month</th>
                <th scope="col" className="py-1 font-medium">Buy</th>
                <th scope="col" className="py-1 font-medium">Outsource</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.month} className="border-t border-border tabular-nums text-accent">
                  <th scope="row" className="py-1 font-medium">{formatCount(point.month)}</th>
                  <td className="py-1">{formatCurrencyValue(point.inHouseCost, currency)}</td>
                  <td className="py-1">{formatCurrencyValue(point.outsourcingCost, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
