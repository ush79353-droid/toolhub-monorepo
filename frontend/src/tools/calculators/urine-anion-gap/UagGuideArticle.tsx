import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { UAG_FAQS } from './content';

export function UagGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        How does the urine anion gap calculator work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter urinary sodium, potassium, and chloride. The calculator reports
        urine anion gap as (Na⁺ + K⁺) − Cl⁻ in mEq/L. These are urine
        electrolytes only — not a serum anion-gap worksheet.
      </p>

      <h2
        id="normal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is a normal urine anion gap?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published interpretive bands vary with clinical context (e.g. metabolic
        acidosis workups). Negative UAG may suggest increased unmeasured urinary
        cations such as ammonium in some teaching frameworks, while positive
        values have different implications — always interpret with a clinician
        and the full history, not this educational tool alone.
      </p>

      <div id="uag-faq" className="not-prose mt-8">
        <FAQAccordion items={UAG_FAQS} />
      </div>
    </article>
  );
}
