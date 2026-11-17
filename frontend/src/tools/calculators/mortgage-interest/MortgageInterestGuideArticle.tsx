import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_INTEREST_FAQS } from './content';

export function MortgageInterestGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mortgage-interest"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Mortgage Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage interest is the cost of borrowing to buy a home. This calculator estimates the
        monthly principal-and-interest payment, total interest over the term, fee-adjusted APR,
        and total payments for a fixed-rate mortgage. Optional mortgage points, up-front fees, and
        annual fees flow into APR and total cost without changing the note amortization ledger.
      </p>

      <h2
        id="mortgage-interest-formulas"
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
        <p className="mt-2">Points cost = Principal × Points% / 100</p>
        <p className="mt-2">
          Display payment = M + Annual fee / 12 · Net proceeds = Principal − points − up-front
        </p>
        <p className="mt-2">
          APR: solve Net = Payment × (1−(1+i)^(−n)) / i · APR% = 12 × i × 100
        </p>
        <p className="mt-2">
          Mortgage interest = Σ schedule interest · Total = Display payment × n + points +
          up-front
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Principal = 250,000 · Term = 20 years · Rate = 5% · Monthly (UK &amp; US)</p>
        <p>r = 0.05 / 12 · n = 240 · Monthly payment ≈ 1,649.89</p>
        <p>Mortgage interest ≈ 145,973.44 · Total payments ≈ 395,973.44 · APR = 5%</p>
      </div>

      <h2
        id="mortgage-interest-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_INTEREST_FAQS]} />
      </div>
    </article>
  );
}
