import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ADJUSTED_BODY_WEIGHT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AdjustedBodyWeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Adjusted Body Weight Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate Robinson ideal body weight and a nutrition-style adjusted body
        weight from sex, height, and actual weight. Educational only — not a
        dosing or meal-plan order.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is adjusted body weight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adjusted body weight (AjBW) blends ideal and actual weight so energy or
        nutrient estimates for people above ideal weight are not based on total
        body weight alone.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate adjusted body weight
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
        Female, 65 in, actual 80 kg → Robinson IBW = 49 + 1.7×5 = 57.5 kg → AjBW
        = 57.5 + 0.4×(80 − 57.5) = 66.5 kg.
      </p>

      <div id="adjbw-faq" className="not-prose mt-8">
        <FAQAccordion items={ADJUSTED_BODY_WEIGHT_FAQS} />
      </div>
    </article>
  );
}
