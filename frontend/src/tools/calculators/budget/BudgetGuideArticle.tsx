import Link from 'next/link';

export function BudgetGuideArticle() {
  return (
    <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
      <section id="what-is-budget" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">What Is This Calculator?</h2>
        <p>
          The Budget Calculator sketches a personal cash budget: income (gross salary with a tax
          rate, pension, and other income), planned savings allocations, recurring monthly
          expenses, and annual expenses. Summary totals show monthly income, savings, expenses,
          annual expenses, and monthly/annual budget balance. It is an illustrative worksheet — not
          tax advice or a bank statement.
        </p>
        <p>
          For a business operating budget with one-time startup costs, see the{' '}
          <Link
            href="/tools/business-budget-calculator"
            className="font-medium text-primary hover:underline"
          >
            Business Budget Calculator
          </Link>
          .
        </p>
      </section>

      <section id="budget-formulas" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Formulas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Normalize each money line to monthly or annual using its / mo or / yr selector before
            summing.
          </li>
          <li>
            Monthly income = net monthly salary + other normalized income sources (pension, other
            monthly, tax refunds, other annual).
          </li>
          <li>Monthly savings = sum of normalized savings allocations.</li>
          <li>Monthly expenses = sum of the Monthly expenses section (normalized / mo).</li>
          <li>Annual expenses = sum of the Annual expenses section (normalized / yr).</li>
          <li>
            Monthly budget balance = Monthly income − Monthly savings − Monthly expenses − Annual
            expenses ÷ 12.
          </li>
          <li>Annual budget balance = Monthly budget balance × 12.</li>
        </ul>
      </section>

      <section id="budget-tax-and-fx" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold text-accent">Tax Rate & Currency</h2>
        <p>
          Salary is gross. Tax rate is a percent applied only to that gross salary after frequency
          normalization — it does not tax pension or other income, and it is not added again as an
          expense. Employer or statutory contribution schedules are not modeled here.
        </p>
        <p>
          Every money line has its own currency selector (screenshot default PKR). Totals aggregate
          in the Salary currency using stored Phase 2 FX rates. Frequency selectors are never
          FX-converted.
        </p>
      </section>
    </div>
  );
}
