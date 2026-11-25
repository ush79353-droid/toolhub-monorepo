import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { VITAL_CAPACITY_FAQS, SOURCE_NOTE } from './content';

export function VitalCapacityGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Vital Capacity Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate anthropometric predicted vital capacity from sex, age, and height.
        This is not measured spirometry and not the IRV+TV+ERV worksheet in the
        Lung Capacity Calculator.
      </p>

      <h2
        id="vc-equation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What&apos;s the vital capacity equation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Female: VC (L) = height (cm) × (21.78 − 0.101 × age) ÷ 1000.
        Male: VC (L) = height (cm) × (27.63 − 0.112 × age) ÷ 1000. The form
        matches the Baldwin anthropometric teaching equation used on Omni
        Calculators (result equivalent to cubic centimeters ÷ 1000).
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the vital capacity calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Choose sex.</li>
        <li>Enter age in years and height (cm, m, or in).</li>
        <li>Read predicted vital capacity in liters or milliliters.</li>
      </ol>

      <h2
        id="related-capacities"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What&apos;s the total lung, inspiratory, and vital capacity formula?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Measured vital capacity from lung volumes is VC = IRV + TV + ERV.
        Total lung capacity is TLC = VC + RV. Inspiratory capacity is IC = IRV +
        TV. Use the Lung Capacity Calculator for those volume-sum capacities; this
        tool only estimates predicted VC from demographics.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Anthropometric prediction ignores ethnicity, lung disease, and training.
        Healthy adults often fall near 3–5 L, but clinical interpretation needs
        validated reference equations and spirometry quality checks.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_NOTE}
      </p>

      <div id="vital-capacity-faq" className="not-prose mt-8">
        <FAQAccordion items={VITAL_CAPACITY_FAQS} />
      </div>
    </article>
  );
}