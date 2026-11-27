import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WHR_FAQS } from './content';

export function WhrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Waist to Hip Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the dimensionless waist-to-hip ratio from two circumference
        measurements. Educational anthropometric worksheet — not a diagnosis.
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why is waist-hip ratio important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teaching materials use WHR as a simple body-shape ratio. It does not
        replace clinical assessment or body-composition testing.
      </p>

      <h2
        id="measure"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How should I measure waist and hips?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common teaching sites measure waist at the narrowest point (or midway
        between ribs and iliac crest) and hips at the widest point of the
        buttocks, with a relaxed tape that is not compressing soft tissue.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How do I calculate the waist to hip ratio?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert both measurements to the same unit, then divide waist by hip.
        Example: 80 cm ÷ 100 cm = 0.8. The result is a ratio, not a percent.
      </p>

      <div id="whr-faq" className="not-prose mt-8">
        <FAQAccordion items={WHR_FAQS} />
      </div>
    </article>
  );
}
