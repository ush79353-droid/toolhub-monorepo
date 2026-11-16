import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_RATE_FAQS } from './content';

export function MortgageRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Mortgage Rate / APR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The note rate is the contractual annual interest rate on a fixed-rate mortgage. The
        adjusted mortgage rate (APR) folds in points, up-front fees, and annual fees so you can
        compare the true yearly cost of borrowing. This calculator estimates the monthly payment,
        fee-adjusted APR, paid interest, and total payments for a fixed-rate loan.
      </p>

      <h2
        id="mortgage-rate-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Payment and APR Formulas
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>M = P × r / (1 − (1+r)^(−n)) · zero rate → M = P / n</p>
        <p className="mt-2">
          Monthly r: UK/US = rate/1200 · Canada = (1+rate/200)^(1/6)−1 · Quarterly =
          (1+rate/400)^(1/3)−1 · Yearly = (1+rate/100)^(1/12)−1
        </p>
        <p className="mt-2">Points cost = Loan × Points% / 100</p>
        <p className="mt-2">
          Display payment = M + Annual fee / 12 · Net proceeds = Loan − points − up-front
        </p>
        <p className="mt-2">
          APR: solve Net = Payment × (1−(1+i)^(−n)) / i · APR% = 12 × i × 100
        </p>
        <p className="mt-2">
          Paid interest = M × n − Loan · Total = Display payment × n + points + up-front
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Loan balance = 200,000 · Term = 30 years · Rate = 5% · Monthly (UK &amp; US)</p>
        <p>r = 0.05 / 12 · n = 360 · Monthly payment ≈ 1,073.64</p>
        <p>Paid interest ≈ 186,511.57 · Total payments ≈ 386,511.57 · APR = 5%</p>
        <p>With 1 point (cost 2,000): net proceeds = 198,000 → APR ≈ 5.089%</p>
      </div>

      <h2
        id="mortgage-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_RATE_FAQS]} />
      </div>
    </article>
  );
}
