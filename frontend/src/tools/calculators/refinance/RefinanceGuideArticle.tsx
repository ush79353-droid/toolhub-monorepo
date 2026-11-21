import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REFINANCE_FAQS } from './content';

export function RefinanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-refinance"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Does This Calculator Compare?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter your remaining balance, payment, and rate, then a proposed refinance term,
        rate, points, fees, and optional cash-out. Results show remaining term and interest,
        the new payment and loan amount, closing costs, monthly and lifetime interest
        differences, break-even when monthly savings exist, and net savings after costs.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm “I know my remaining balance” and enter balance, payment, and APR.</li>
        <li>Enter the new term (years), APR, points, costs/fees, and cash-out.</li>
        <li>Click Calculate. Use Clear to restore defaults.</li>
      </ol>

      <h2
        id="refinance-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Current months ≈ ln(M / (M − P·r)) / ln(1+r), r = APR/1200</p>
        <p>New principal = Balance + Cash-out</p>
        <p>Points cost = New principal × Points / 100</p>
        <p>Closing costs = Points cost + Costs and fees (upfront)</p>
        <p>New payment = P × r / (1 − (1+r)^(-n)); at 0% APR, P / n</p>
        <p>Break-even months = Closing / monthly payment savings (when savings &gt; 0)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Balance $250,000 · Payment $1,800 · 7% → remaining term from amortization math</p>
        <p>New: 20 years · 6% · 2 points · $1,500 fees · $0 cash-out</p>
        <p>New principal $250,000 · Points $5,000 · Closing $6,500</p>
      </div>

      <h2 id="refinance-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        FAQ
      </h2>
      <div className="mt-3 not-prose">
        <FAQAccordion faqs={[...REFINANCE_FAQS]} />
      </div>
    </article>
  );
}
