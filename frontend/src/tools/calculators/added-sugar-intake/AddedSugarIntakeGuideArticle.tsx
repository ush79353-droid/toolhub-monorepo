import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ADDED_SUGAR_INTAKE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';
import { GRAMS_PER_TEASPOON } from './food-data';

export function AddedSugarIntakeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Added Sugar Intake Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pick products, enter average daily quantities, and see estimated added
        sugar in grams and teaspoons versus common daily limits.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Totals Are Built
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Teaspoons use {GRAMS_PER_TEASPOON} g per teaspoon.
      </p>

      <h2
        id="guidelines"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Guidelines
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dietary guidance often recommends that no more than 10% of calories come
        from added sugars for people over age 2. This calculator highlights
        fixed gram limits (25 g women / 36 g men) for quick comparison; your
        personal energy target may differ.
      </p>

      <div id="added-sugar-faq" className="not-prose mt-8">
        <FAQAccordion items={ADDED_SUGAR_INTAKE_FAQS} />
      </div>
    </article>
  );
}