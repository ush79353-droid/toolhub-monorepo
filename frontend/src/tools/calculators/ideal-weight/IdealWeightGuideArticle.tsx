import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IDEAL_WEIGHT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function IdealWeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Ideal Weight Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate adult ideal body weight (IBW) from sex and height using four
        classic teaching formulas. Optional current weight supports comparison
        only. This worksheet is educational — not a diet, dosing, or clinical
        target.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How much should I weigh?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: female, 167 cm → Devine IBW ≈ 58.7 kg.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of IBW formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These equations ignore body composition, frame size, pregnancy, and
        athletic build. They are commonly used as dosing or screening helpers in
        textbooks and should not replace individualized clinical judgment.
      </p>

      <div id="ibw-faq" className="not-prose mt-8">
        <FAQAccordion items={IDEAL_WEIGHT_FAQS} />
      </div>
    </article>
  );
}
