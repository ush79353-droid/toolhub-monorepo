import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BRI_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BriGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BRI Calculator — Body Roundness Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate Body Roundness Index from height and waist circumference using
        the Thomas equation. Educational only.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the BRI and how is it calculated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate your BRI using this calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter height and waist in any supported unit. Both are converted to
        centimetres before applying the Thomas formula. Clearing an input clears
        the BRI result.
      </p>

      <h2
        id="health"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What the BRI says about your health status
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BRI is an anthropometric index related to body shape. It is not a
        diagnosis of disease risk by itself.
      </p>

      <h2
        id="mean"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What does my BRI result mean?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpret BRI with clinical context and local guidance. This worksheet
        does not apply proprietary risk cut-offs beyond the raw index.
      </p>

      <h2
        id="vs-bmi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BRI vs. BMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI uses weight and height. BRI uses waist and height to emphasize body
        roundness. The two indices are complementary, not interchangeable.
      </p>

      <div id="bri-faq" className="not-prose mt-8">
        <FAQAccordion items={BRI_FAQS} />
      </div>
    </article>
  );
}
