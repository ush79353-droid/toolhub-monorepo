import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MONTH_OVER_MONTH_FAQS } from './content';

export function MonthOverMonthGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-mom"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Does Month-over-Month Mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Month-over-month (MoM) growth measures the percentage change in a metric
        between consecutive months — revenue, users, traffic, expenses, and more.
        It highlights short-term momentum, not a full-year story.
      </p>

      <h2
        id="mom-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        MoM = ((V₂ − V₁) / V₁) × 100
      </div>

      <h2
        id="how-to-calculate-mom"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Month-over-Month Growth
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Identify the previous month’s value (V₁).</li>
        <li>Identify the current month’s value (V₂).</li>
        <li>Subtract V₁ from V₂.</li>
        <li>Divide by V₁ (must be nonzero).</li>
        <li>Multiply by 100 and interpret in context.</li>
      </ol>

      <h2
        id="mom-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        January revenue $50,000 → February $60,000. MoM = (10,000 / 50,000) × 100
        = <strong>+20%</strong>.
      </p>

      <h2
        id="what-is-cmgr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Compounding Monthly Growth Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CMGR is the constant monthly rate that would compound an initial value
        into a final value over n monthly intervals. It is not the same as a
        single MoM step or a simple average of monthly changes.
      </p>

      <h2
        id="cmgr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CMGR Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        CMGR = ((V𝒻 / Vᵢ)^(1/n) − 1) × 100
      </div>

      <h2
        id="cmgr-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CMGR Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start 50,000 → end 100,000 over 12 months. CMGR = (2^(1/12) − 1) × 100 ≈{' '}
        <strong>5.95%</strong> per month.
      </p>

      <h2
        id="mom-vs-cmgr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MoM vs. CMGR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MoM compares two adjacent months. CMGR summarizes a multi-month path as
        one equivalent monthly compound rate between endpoints.
      </p>

      <h2
        id="what-is-qoq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Quarter-over-Quarter Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        QoQ growth compares consecutive quarters — typically three-month
        reporting periods — using the same percentage-change structure as MoM.
      </p>

      <h2
        id="qoq-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Quarter-over-Quarter Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        QoQ = ((Current − Previous) / Previous) × 100
      </div>

      <h2
        id="what-is-yoy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Year-over-Year Growth?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        YoY growth compares corresponding periods one year apart (January vs
        January, Q2 vs Q2, or full year vs full year).
      </p>

      <h2
        id="yoy-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Year-over-Year Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-accent sm:text-sm">
        YoY = ((Current − Previous) / Previous) × 100
      </div>

      <h2
        id="compare-periods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MoM vs. QoQ vs. YoY
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MoM tracks short-term shifts; QoQ tracks quarterly performance; YoY
        supports seasonality-aware annual comparisons. A business can show
        negative MoM and positive YoY in the same month — do not infer one from
        another without data.
      </p>

      <h2
        id="revenue-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Revenue Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Apply MoM to comparable monthly revenue totals. Keep recognition policies
        and one-time items consistent across months.
      </p>

      <h2
        id="sales-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Sales Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sales teams use MoM on units or sales revenue to spot campaign lift,
        pipeline conversion, and mid-quarter slowdowns.
      </p>

      <h2
        id="customer-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Customer Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Startups often track MoM for customers or active users alongside churn
        and retention — growth in headcount is not the same as growth in revenue.
      </p>

      <h2
        id="saas-growth"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Growth in SaaS Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        SaaS MoM commonly covers MRR, new logos, expansion, churn, and usage.
        CMGR is useful when summarizing multi-month MRR doubling or contraction.
      </p>

      <h2
        id="interpret-signs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Positive and Negative MoM Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive MoM is not always good (rising costs); negative MoM is not always
        bad (falling churn or expenses). Interpret relative to the metric.
      </p>

      <h2
        id="fluctuations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Month-over-Month Growth Fluctuates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Campaigns, holidays, launches, sales cycles, reporting cutoffs, and
        macro conditions all create MoM noise.
      </p>

      <h2
        id="seasonality"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Seasonality and MoM Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Holiday peaks followed by quieter months can produce steep negative MoM
        without a structural decline — pair MoM with YoY when seasonality matters.
      </p>

      <h2
        id="why-yoy"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Year-over-Year Growth Is Useful
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Year-apart comparisons reduce some seasonal distortion. YoY does not
        remove all calendar or one-time effects.
      </p>

      <h2
        id="pct-vs-points"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Month-over-Month Growth vs. Percentage Points
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Conversion rate 4% → 5% is +1 percentage point, but relative growth is
        25%. Do not mix percentage points with MoM percentage growth.
      </p>

      <h2
        id="improve-mom"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve Month-over-Month Growth
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Focus on acquisition, retention, pricing, product, marketing efficiency,
        and sales execution — then measure MoM on the metric you intend to move.
      </p>

      <h2
        id="mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common MoM Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Reversing previous and current values</li>
        <li>Dividing by the current value instead of the previous</li>
        <li>Dividing by zero</li>
        <li>Confusing percentage points with percentage growth</li>
        <li>Averaging MoM rates instead of using CMGR</li>
        <li>Miscounting monthly intervals for CMGR</li>
        <li>Treating every positive MoM as favorable</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of MoM Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MoM is sensitive to short-term noise, seasonality, small bases, one-offs,
        and data quality. CMGR describes an equivalent path between endpoints —
        not the actual sequence of monthly changes. Educational illustration only
        — not financial advice.
      </p>

      <h2
        id="mom-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MONTH_OVER_MONTH_FAQS]} />
      </div>
    </article>
  );
}
