import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AUDIT_SCORE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AuditScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Audit Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Complete the WHO Alcohol Use Disorders Identification Test (AUDIT) for
        an educational domain breakdown and overall score. This is screening
        information only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the Audit alcohol screen?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AUDIT is a 10-item questionnaire developed by the World Health
        Organization to screen for hazardous and harmful drinking patterns.
      </p>

      <h2
        id="built"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How is the Audit test built?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="using"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the Audit score calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select sex, answer each item using the dropdowns or radios, and read the
        live consumption, dependence, problems, and overall totals. Defaults
        match a low-risk fixture (overall 2).
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Audit test score interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational bands used here: 0–7 low risk / probably no problem; 8–15
        hazardous; 16–19 harmful; 20–40 possible dependence. Local clinical
        cut-offs and cultural norms may differ.
      </p>

      <div id="audit-faq" className="not-prose mt-8">
        <FAQAccordion items={AUDIT_SCORE_FAQS} />
      </div>
    </article>
  );
}
