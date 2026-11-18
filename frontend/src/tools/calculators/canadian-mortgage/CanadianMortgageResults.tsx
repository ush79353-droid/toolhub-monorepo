import { CanadianMortgageChart } from './CanadianMortgageChart';
import type { CanadianMortgageResult } from './types';

interface CanadianMortgageResultsProps {
  result: CanadianMortgageResult;
  includeOptionals: boolean;
}

function MoneyCell({ value }: { value: string }) {
  return <span className="tabular-nums">$ {value}</span>;
}

export function CanadianMortgageResults({
  result,
  includeOptionals,
}: CanadianMortgageResultsProps) {
  const optionalRows: { label: string; monthly: string; total: string; show: boolean }[] =
    [
      {
        label: 'Property Tax',
        monthly: result.formattedMonthlyPropertyTax,
        total: result.formattedTotalPropertyTax,
        show: includeOptionals && result.monthlyPropertyTax > 0,
      },
      {
        label: 'Home Insurance',
        monthly: result.formattedMonthlyHomeInsurance,
        total: result.formattedTotalHomeInsurance,
        show: includeOptionals && result.monthlyHomeInsurance > 0,
      },
      {
        label: 'Mortgage Insurance',
        monthly: result.formattedMonthlyMortgageInsurance,
        total: result.formattedTotalMortgageInsurance,
        show: includeOptionals && result.monthlyMortgageInsurance > 0,
      },
      {
        label: 'Condo/HOA Fee',
        monthly: result.formattedMonthlyCondoHoa,
        total: result.formattedTotalCondoHoa,
        show: includeOptionals && result.monthlyCondoHoa > 0,
      },
      {
        label: 'Other Costs',
        monthly: result.formattedMonthlyOtherCosts,
        total: result.formattedTotalOtherCosts,
        show: includeOptionals && result.monthlyOtherCosts > 0,
      },
    ];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <div className="rounded-lg bg-primary px-3.5 py-3 text-white">
        <p className="text-[12px] font-medium text-white/85">Monthly Pay</p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
          $ {result.formattedMonthlyMortgagePayment}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-sm text-accent">
          <thead>
            <tr className="border-b border-border text-left text-[12px] text-muted-foreground">
              <th className="py-2 pr-3 font-medium" scope="col">
                Breakdown
              </th>
              <th className="py-2 pr-3 text-right font-medium" scope="col">
                Monthly
              </th>
              <th className="py-2 text-right font-medium" scope="col">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/70">
              <td className="py-2 pr-3">Mortgage Payment</td>
              <td className="py-2 pr-3 text-right">
                <MoneyCell value={result.formattedMonthlyMortgagePayment} />
              </td>
              <td className="py-2 text-right">
                <MoneyCell value={result.formattedTotalMortgagePayments} />
              </td>
            </tr>
            {optionalRows
              .filter((row) => row.show)
              .map((row) => (
                <tr key={row.label} className="border-b border-border/70">
                  <td className="py-2 pr-3">{row.label}</td>
                  <td className="py-2 pr-3 text-right">
                    <MoneyCell value={row.monthly} />
                  </td>
                  <td className="py-2 text-right">
                    <MoneyCell value={row.total} />
                  </td>
                </tr>
              ))}
            <tr className="font-semibold">
              <td className="py-2.5 pr-3">Total Out-of-Pocket</td>
              <td className="py-2.5 pr-3 text-right">
                <MoneyCell value={result.formattedMonthlyOutOfPocket} />
              </td>
              <td className="py-2.5 text-right">
                <MoneyCell value={result.formattedTotalOutOfPocket} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CanadianMortgageChart result={result} />

      <dl className="space-y-2 border-t border-border pt-3 text-sm text-accent">
        <div className="flex items-center justify-between gap-3">
          <dt>House Price</dt>
          <dd className="tabular-nums font-medium">$ {result.formattedHomePrice}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Loan Amount</dt>
          <dd className="tabular-nums font-medium">$ {result.formattedLoanAmount}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Down Payment</dt>
          <dd className="tabular-nums font-medium">$ {result.formattedDownPayment}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Total of {result.paymentCount} Mortgage Payments</dt>
          <dd className="tabular-nums font-medium">
            $ {result.formattedTotalMortgagePayments}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Total Interest</dt>
          <dd className="tabular-nums font-medium">$ {result.formattedTotalInterest}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Mortgage Payoff Date</dt>
          <dd className="font-medium">{result.formattedPayoffDate}</dd>
        </div>
      </dl>
    </div>
  );
}
