import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AUSTRALIA_TAX_CUTS_FAQS } from './content';

export function AustraliaTaxCutsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-was-budget"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Was Budget 2020/21 About?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Australia&apos;s Federal Budget 2020/21 included announced personal income tax measures as
        part of the Commonwealth Budget process. Budget announcements are not the same thing as
        enacted tax law: proposed measures must be passed in legislation and then administered
        through the Australian Taxation Office (ATO). This page does not reproduce Budget tables or
        claim that every announced cut was identical to the final legislative schedule.
      </p>

      <h2
        id="why-unavailable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why This Calculator Is Unavailable
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Showing a live 2020/21 tax-cut estimator would invite people to apply outdated or incomplete
        assumptions to current returns. Without an authorized historical specification, Omega
        Calculators keeps this tool as a clear unavailable notice rather than inventing brackets,
        refunds, or eligibility forms.
      </p>

      <h2 id="where-to-go" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Where to Go Next
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For official Australian income tax guidance, use ATO publications and tools. On this site,
        the notice points toward the GST Calculator catalog entry as an alternative finance tool —
        not as a substitute for ATO income tax advice.
      </p>

      <h2
        id="australia-tax-cuts-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...AUSTRALIA_TAX_CUTS_FAQS]} />
      </div>
    </article>
  );
}
