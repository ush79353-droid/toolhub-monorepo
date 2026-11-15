import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WEBSITE_AD_REVENUE_FAQS } from './content';

export function WebsiteAdRevenueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-website-ad-revenue"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate website ad revenue from visits, pages per visit, and page RPM (revenue per 1,000
        page views). Incomplete stages stay blank until their inputs are valid.
      </p>

      <h2
        id="website-ad-revenue-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Page Views = Visits × Page Views per Visit</p>
        <p>Revenue = (Page Views / 1000) × Page RPM</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Visits = 10,000</p>
        <p>Page views per visit = 2.5</p>
        <p>Page views = 25,000</p>
        <p>Page RPM = PKR 200</p>
        <p>Revenue = PKR 5,000</p>
      </div>

      <h2
        id="website-ad-revenue-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WEBSITE_AD_REVENUE_FAQS]} />
      </div>
    </article>
  );
}
