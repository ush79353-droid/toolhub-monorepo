import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WHTR_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function WhtrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Waist to Height Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the dimensionless waist-to-height ratio from circumference and
        standing height. Educational anthropometric worksheet — not a diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Waist-to-height ratio formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: waist 80 cm, height 160 cm → 80 ÷ 160 = 0.5.
        Height 1.6 m with waist 80 cm yields the same ratio.
      </p>

      <div id="whtr-faq" className="not-prose mt-8">
        <FAQAccordion items={WHTR_FAQS} />
      </div>
    </article>
  );
}
