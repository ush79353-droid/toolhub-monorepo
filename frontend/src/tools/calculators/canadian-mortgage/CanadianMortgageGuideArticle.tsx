import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CANADIAN_MORTGAGE_FAQS } from './content';

export function CanadianMortgageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-canadian-mortgage"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a Canadian Mortgage Payment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates a fixed-rate Canadian residential mortgage payment using
        semi-annual compounding, then optionally adds property taxes, insurance, HOA fees, and
        other ownership costs for a monthly and lifetime out-of-pocket view.
      </p>

      <h2
        id="canadian-mortgage-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Canadian Payment Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = (1 + APR / 200)^(1/6) − 1</p>
        <p>P = Home Price × (1 − Down Payment% / 100)</p>
        <p>n = Loan Term × 12</p>
        <p>Monthly Payment = P × r / (1 − (1 + r)^(−n))</p>
        <p>When r = 0: Monthly Payment = P / n</p>
        <p>Total mortgage payments = Monthly Payment × n</p>
        <p>Total interest = Total mortgage payments − P</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Home = $800,000 · Down = 20% · Term = 25 years · Rate = 5%</p>
        <p>Loan amount P = $640,000 · n = 300</p>
        <p>Monthly mortgage payment ≈ $3,722.27</p>
        <p>Total of 300 mortgage payments ≈ $1,116,681.57 · Total interest ≈ $476,681.57</p>
        <p>With 0.3% tax, $2,500 insurance/year, and $6,000 other/year → monthly out-of-pocket ≈ $4,630.61</p>
      </div>

      <h2
        id="canadian-mortgage-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CANADIAN_MORTGAGE_FAQS]} />
      </div>
    </article>
  );
}
