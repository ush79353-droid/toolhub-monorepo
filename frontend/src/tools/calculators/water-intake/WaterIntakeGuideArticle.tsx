import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WATER_INTAKE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function WaterIntakeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Water Intake Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate adequate daily water intake for adults and children using
        Institute of Medicine Dietary Reference Intake tables. Educational
        worksheet — not a personalized prescription.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How adequate intake is determined
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Adult male example: 3.7 L/day total and about 3.0 L
        (~13 cups) from beverages.
      </p>

      <div id="water-intake-faq" className="not-prose mt-8">
        <FAQAccordion items={WATER_INTAKE_FAQS} />
      </div>
    </article>
  );
}
