import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PLASMA_OSMOLALITY_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function PlasmaOsmolalityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Plasma Osmolality Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate calculated plasma osmolality from sodium, glucose, and blood
        urea nitrogen. Educational only — not a laboratory osmometer reading
        and not an osmolar gap.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is plasma osmolality?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Osmolality describes the number of osmoles of solute per kilogram of
        water. In plasma, sodium salts, glucose, and urea nitrogen are the main
        contributors used in bedside estimates.
      </p>

      <h2
        id="vs-osmolarity"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Plasma osmolality vs osmolarity
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Osmolality is per kg of solvent water; osmolarity is per liter of
        solution. For dilute body fluids the numeric values are nearly the same,
        which is why teaching displays sometimes list mOsm/L beside mOsm/kg
        H₂O.
      </p>

      <h2
        id="normal"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is normal plasma osmolality?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many textbooks cite roughly 275–295 mOsm/kg H₂O for calculated
        osmolality in healthy adults. Local laboratory reference ranges and
        clinical context take precedence.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Plasma osmolality formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: Na 140 mEq/L, glucose 90 mg/dL, BUN 14
        mg/dL → 2×140 + 90/18 + 14/2.8 = 290 mOsm/kg H₂O.
      </p>

      <div id="posm-faq" className="not-prose mt-8">
        <FAQAccordion items={PLASMA_OSMOLALITY_FAQS} />
      </div>
    </article>
  );
}
