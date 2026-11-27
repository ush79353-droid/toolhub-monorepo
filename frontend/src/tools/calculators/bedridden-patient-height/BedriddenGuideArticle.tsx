import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BEDRIDDEN_FAQS } from './content';

export function BedriddenGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bedridden Patient Height Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate stature and body weight for immobile patients from bedside
        anthropometry. Educational only — not a substitute for calibrated scales
        or clinical assessment.
      </p>

      <h2
        id="height"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Estimating height without standing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Height methods include Mitchell &amp; Lipschitz (2×semi-span), WHO arm
        span, Rabito, Gray recumbent length, Chumlea, Cereda, knee-height and
        demi-span equations, and an ulna-length chart.
      </p>

      <h2
        id="weight"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Estimating weight formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weight methods include Chumlea (calf, knee, arm, subscapular), Rabito
        (arm, abdomen, calf ± skinfold/sex), and Ross Laboratories
        (sex/race/knee/arm). Only covariates required by the selected equation
        are shown.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked examples
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Mitchell: semi-span 85 cm → height 170 cm. Ross white male: knee 50 cm,
        arm 30 cm → weight = 1.19×50 + 3.21×30 − 86.82 = 68.98 kg.
      </p>

      <div id="bed-faq" className="not-prose mt-8">
        <FAQAccordion items={BEDRIDDEN_FAQS} />
      </div>
    </article>
  );
}
