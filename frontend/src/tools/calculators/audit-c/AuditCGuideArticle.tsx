import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AUDITC_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AuditCGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="who-can-use"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Who can use the Audit-C calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adults who want an educational AUDIT-C consumption score from three
        past-year drinking questions. It is a brief screen adapted from the
        longer AUDIT — not a stand-alone diagnosis of alcohol use disorder.
      </p>

      <h2
        id="safe-drinking"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much can I drink safely?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Safe limits depend on health, medications, pregnancy, and local
        guidelines. This worksheet does not set a personal allowance. Discuss
        drinking limits with a clinician if you are unsure.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate my Audit-C score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Select sex, then answer frequency, typical quantity, and
        6+ drink occasions. Example: monthly or less (1) + 3 or 4 drinks (1) +
        never binge (0) → score 2.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Audit-C score interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teaching positive screens are ≥4 (men) and ≥3 (women). Higher totals
        generally indicate greater likelihood of hazardous drinking patterns.
        Cut-points can vary by setting; clinical context always comes first.
      </p>

      <h2
        id="worried"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        I&apos;m worried about my result. Am I an alcoholic?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        No calculator can answer that. AUDIT-C does not diagnose alcoholism or
        alcohol dependence. A positive screen means further clinical assessment
        may help — talk with a qualified professional.
      </p>

      <h2
        id="full-audit"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        AUDIT alcohol screen
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The full AUDIT has 10 items (score 0–40). AUDIT-C uses only the first
        three consumption questions and is validated as a brief hazardous-
        drinking screen in primary care and VA settings.
      </p>

      <div id="auditc-faq" className="not-prose mt-8">
        <FAQAccordion items={AUDITC_FAQS} />
      </div>
    </article>
  );
}
