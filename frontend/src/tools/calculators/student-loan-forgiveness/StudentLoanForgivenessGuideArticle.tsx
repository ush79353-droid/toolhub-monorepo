import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STUDENT_LOAN_FORGIVENESS_FAQS } from './content';

export function StudentLoanForgivenessGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-historical"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is This Tool?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page mirrors the screenshot fields for a historical student loan forgiveness form:
        filing status, annual income, Pell Grant receipt, and outstanding student debt. It is
        labeled <strong>Historical / Not Currently Available</strong> and is not an active federal
        benefit estimator.
      </p>

      <h2
        id="why-no-estimate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why No Forgiveness Estimate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The screenshot does not show result fields, and this repository has no verified
        specification for historical eligibility thresholds or forgiveness caps. Without those
        rules, the tool shows a clear notice instead of inventing dollar amounts. PSLF and
        income-driven repayment models are not included.
      </p>

      <h2
        id="slf-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...STUDENT_LOAN_FORGIVENESS_FAQS]} />
      </div>
    </article>
  );
}
