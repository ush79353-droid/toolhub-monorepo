import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VENOUS_BLOOD_PH_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function VenousBloodPhGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Venous Blood pH Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate blood pH from bicarbonate and PaCO₂ using the
        Henderson–Hasselbalch equation. Educational only — the output is an
        estimated pH, not a directly measured venous laboratory result. Review
        sample type and clinical context before any interpretive use.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What can you calculate using venous blood gas levels?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This worksheet focuses on the calculated pH from HCO₃ and PaCO₂. Venous
        and arterial gas panels differ in sampling site and typical ranges; this
        tool does not replace a measured blood-gas report.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculating venous blood gas with the Henderson-Hasselbalch equation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HCO₃ 24 mEq/L and PaCO₂ 40 mmHg → estimated pH ≈ 7.39.
      </p>

      <div id="vbph-faq" className="not-prose mt-8">
        <FAQAccordion items={VENOUS_BLOOD_PH_FAQS} />
      </div>
    </article>
  );
}
