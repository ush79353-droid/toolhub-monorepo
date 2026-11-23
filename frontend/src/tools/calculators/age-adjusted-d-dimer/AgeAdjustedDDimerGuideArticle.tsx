import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AGE_ADJUSTED_D_DIMER_FAQS } from './content';
import { LITER_MULTIPLIER, SOURCE_NOTE } from './calculation';

export function AgeAdjustedDDimerGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Age-Adjusted D-dimer Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter age and assay unit type to see the corresponding age-adjusted
        D-dimer cutoff for validated pretest-probability pathways.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cutoff Rules
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        µg/L ÷ {LITER_MULTIPLIER} = µg/mL. Example: 600 µg/L = 0.6 µg/mL FEU at
        age 60.
      </p>

      <div id="d-dimer-faq" className="not-prose mt-8">
        <FAQAccordion items={AGE_ADJUSTED_D_DIMER_FAQS} />
      </div>
    </article>
  );
}