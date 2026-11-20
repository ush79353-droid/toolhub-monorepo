import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CANADA_GST_QST_FAQS } from './content';
import { RATES_EFFECTIVE_NOTE } from './rates';

export function CanadaGstQstGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-canada-sales-tax"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Canadian Sales Taxes Overview
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Canada&apos;s consumption taxes include the federal GST, Harmonized Sales Tax (HST) in
        participating provinces, and separate provincial taxes such as PST, RST, and Quebec&apos;s
        QST. This calculator estimates tax on a generally taxable purchase amount before tax in CAD
        for each province and territory.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the province or territory (default Alberta).</li>
        <li>Enter the amount before tax in Canadian dollars.</li>
        <li>Read the applicable tax line(s) and the amount after tax.</li>
      </ol>

      <h2
        id="rates-and-sources"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rates and Official Sources
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {RATES_EFFECTIVE_NOTE}
      </p>

      <h2 id="formulas" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formulas by Regime
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>GST-only: Tax = Amount × 5%; After = Amount + Tax</p>
        <p>HST: Tax = Amount × HST%; After = Amount + Tax</p>
        <p>GST + PST/RST: Each tax = Amount × rate; After = Amount + GST + provincial</p>
        <p>Quebec: GST = Amount × 5%; QST = Amount × 9.975%; After = Amount + GST + QST</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Alberta · $100.00 before tax → GST $5.00 → after tax <strong>$105.00</strong>. Quebec ·
        $100.00 → GST $5.00 + QST $9.975 → after tax <strong>$114.975</strong> (display rounds to
        cents).
      </p>

      <h2
        id="canada-gst-qst-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CANADA_GST_QST_FAQS]} />
      </div>
    </article>
  );
}
