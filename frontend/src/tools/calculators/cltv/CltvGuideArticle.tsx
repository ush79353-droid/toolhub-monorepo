import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CLTV_FAQS } from './content';

export function CltvGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        CLTV Calculator – Customer Lifetime Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This CLTV Calculator estimates how much revenue an average customer may
        generate over their relationship with your business. Enter average
 purchase value, annual purchase frequency, and lifespan, or derive APV
        and frequency from total revenue, purchases, and customer counts for a
        reporting period. Optional controls apply gross margin, compare CLTV
        with customer acquisition cost (CAC), estimate lifespan from churn, and
        compute a simple discounted lifetime value. Currency labels are
        denomination only. Results are planning estimates, not guaranteed future
        cash.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Customer Lifetime Value (CLTV)?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Customer lifetime value summarizes the expected economic contribution of
        a customer across the active relationship. Revenue-based CLTV multiplies
        annualized spending by lifespan. Profit-oriented variants apply gross
        margin or contribution margin and may discount future cash flows. Always
        label which definition you are using before comparing teams or vendors.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Customer Lifetime Value Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>ACV = APV × APF_annual</p>
        <p>CLTV = ACV × L = APV × APF_annual × L</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Keep time units consistent: APF must be annual when L is measured in
        years. Mixing monthly frequency with a multi-year lifespan without
        annualization inflates or deflates CLTV.
      </p>

      <h2
        id="how-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Customer Lifetime Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Company Alpha example (one-year reporting period): revenue $5,000,000;
        100,000 purchases; 20,000 customers; lifespan 3 years.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>APV = 5,000,000 ÷ 100,000 = $50.</li>
        <li>APF = 100,000 ÷ 20,000 = 5 purchases/customer/year.</li>
        <li>ACV = 50 × 5 = $250/year.</li>
        <li>CLTV = 250 × 3 = $750 revenue per customer.</li>
      </ol>

      <h2
        id="apv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Average Purchase Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        APV = Total revenue ÷ Total purchases. It answers how much an average
        transaction is worth. Use the same period and customer population as your
        other inputs.
      </p>

      <h2
        id="apf"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Average Purchase Frequency?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Period APF = Purchases ÷ Customers. Annualize monthly (×12), quarterly
        (×4), or custom m months (×12/m) before multiplying by lifespan in years.
      </p>

      <h2
        id="acv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Average Customer Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 ACV = APV × annual APF; estimated annual revenue per customer before
        lifespan scaling. It is not lifetime value until multiplied by L.
      </p>

      <h2
        id="lifespan"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Customer Lifespan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Prefer historical cohorts, retention curves, and subscription tenure. A
        simplified constant-churn estimate is Expected lifespan ≈ 1 ÷ annual
        churn rate (e.g., 20% → 5 years). That approximation is a constant-hazard
        model and is not reliable for every business.
      </p>

      <h2
        id="revenue-vs-profit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Revenue CLTV vs. Profit CLTV
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revenue CLTV of $750 with a 40% gross margin implies gross-profit CLTV of
        $300. That still excludes acquisition spend, fixed overhead, and taxes.
        Do not call gross-profit CLTV “net profit.”
      </p>

      <h2
        id="cac"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CLTV vs. Customer Acquisition Cost (CAC)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare lifetime value with what you spend to acquire a customer. Using
        gross-profit CLTV $300 and CAC $100 gives a 3:1 ratio. Pair ratios with
        payback period analysis.
      </p>

      <h2
        id="good-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good CLTV:CAC Ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Targets vary by industry, margins, growth stage, and capital structure. A
 frequently cited 3:1 heuristic is not a universal health guarantee; 
        evaluate your unit economics directly.
      </p>

      <h2
        id="increase"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Increase Customer Lifetime Value
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Improve retention and reduce avoidable churn.</li>
        <li>Increase beneficial repeat purchases.</li>
        <li>Raise satisfaction and product fit.</li>
        <li>Upsell and cross-sell with clear customer benefit.</li>
        <li>Use loyalty programs carefully (watch margin).</li>
        <li>Personalize marketing without spam.</li>
        <li>Strengthen onboarding and support.</li>
      </ul>

      <h2
        id="ecommerce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CLTV for Ecommerce Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ecommerce teams often substitute average order value for APV and count
        orders per year as frequency. Apply gross margin when comparing to paid
        acquisition. Segment new vs. returning buyers when averages mislead.
      </p>

      <h2
        id="saas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CLTV for SaaS Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        SaaS models emphasize recurring revenue, gross margin, and churn.
        Simplified APV×APF×L can approximate LTV, but cohort retention and
        expansion revenue models are usually more accurate for subscription
        finance.
      </p>

      <h2
        id="subscription"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CLTV for Subscription Businesses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Align billing frequency with annualized contribution, model cancellation
        probabilities, and separate expansion from base subscription. Discounting
        matters more when cash arrives over many years.
      </p>

      <h2
        id="practice"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        CLTV Calculator in Practice
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use CLTV to set acquisition bid ceilings, prioritize retention projects,
 compare channel quality, and stress-test pricing changes, always with
        documented assumptions and segment checks.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Customer Lifetime Value
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Forecast uncertainty and changing behavior.</li>
        <li>Averages hide valuable and unprofitable segments.</li>
        <li>Ignoring time value of money understates or overstates value.</li>
        <li>Churn and spend are rarely constant.</li>
        <li>Revenue ≠ profit; CAC and overhead still matter.</li>
        <li>Historical data may not predict future cohorts.</li>
      </ul>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Explore{' '}
        <Link
          href="/tools/customer-acquisition-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Customer Acquisition Cost
        </Link>
        ,{' '}
        <Link
          href="/tools/customer-retention-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Customer Retention Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/churn-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Churn Rate
        </Link>
        ,{' '}
        <Link
          href="/tools/break-even-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Break-Even
        </Link>
        ,{' '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        , and{' '}
        <Link
          href="/tools/net-profit-margin-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Profit Margin
        </Link>
        .
      </p>

      <h2
        id="cltv-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...CLTV_FAQS]} />
      </div>
    </article>
  );
}
