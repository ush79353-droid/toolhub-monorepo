import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FFMI_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function FfmiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        FFMI Calculator (Fat-Free Mass Index)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate fat-free mass index from body weight, body-fat percentage, and
        height. Useful as an educational alternative framing to BMI when lean
        mass matters. Not a medical diagnosis.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is FFMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fat-free mass index relates lean mass to stature. You need a body-fat
        estimate (from calipers, DXA, or another method) to separate fat mass
        from fat-free mass.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate FFMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: 80 kg, 25% body fat, height 2 m → FFM 60
        kg and FFMI 15.
      </p>

      <h2
        id="normalized"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Normalized FFMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Normalized FFMI adds 6.1 × (1.8 − height_m) so comparisons lean toward a
        1.8 m reference height. At 2 m and FFMI 15, normalized FFMI ≈ 13.78.
      </p>

      <div id="ffmi-faq" className="not-prose mt-8">
        <FAQAccordion items={FFMI_FAQS} />
      </div>
    </article>
  );
}
