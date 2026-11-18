import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MORTGAGE_POINTS_FAQS } from './content';

export function MortgagePointsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-are-mortgage-points"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Are Mortgage Points?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mortgage discount points are an upfront (or financed) fee paid to lower the
        interest rate on a fixed-rate mortgage. One point equals one percent of the
        original loan amount. This calculator compares two point-purchase options
        against the same baseline loan so you can see monthly savings, break-even
        time, total interest, and balance trajectories.
      </p>

      <h2
        id="mortgage-points-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Comparison Works
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Points cost = principal × points ÷ 100</p>
        <p>Monthly rate (UK &amp; US): r = APR ÷ 12 ÷ 100</p>
        <p>Payment = P × r ÷ (1 − (1+r)^(−n)); zero interest → P ÷ n</p>
        <p>Monthly savings = baseline payment − option payment</p>
        <p>Break-even (mos) = ceil(points cost ÷ monthly savings)</p>
        <p>Total payments (upfront) = schedule total + points cost</p>
        <p>Total payments (rolled) = schedule total only (points inside principal)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Loan = PKR 250,000 · Term = 30 years · Initial rate = 3.25% · Monthly
          (UK &amp; US)
        </p>
        <p>Option I: 1 point → cost 2,500 · rate 3% → payment ≈ 1,054.01</p>
        <p>Option II: 3 points → cost 7,500 · rate 2.5% → payment ≈ 987.80</p>
        <p>Baseline payment ≈ 1,088.02 · Option I savings ≈ 34.01 · break-even 74 mos</p>
        <p>Option II savings ≈ 100.21 · break-even 75 mos</p>
      </div>

      <h2
        id="mortgage-points-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MORTGAGE_POINTS_FAQS]} />
      </div>
    </article>
  );
}
