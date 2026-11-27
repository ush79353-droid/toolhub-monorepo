import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BODY_SURFACE_AREA_FAQS } from './content';

export function BodySurfaceAreaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Body Surface Area Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates human body surface area (BSA) from weight and
        height using several published equations. Direct measurement of BSA is
        difficult, so formulas remain common teaching and dosing references —
        this page is educational only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is BSA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BSA is often preferred over weight alone when relating metabolic mass,
        cardiac index, or chemotherapy dosing frameworks. Extremes of body size
        and narrow therapeutic indices can limit any single formula.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        With weight W in kg and height H in cm, results are in m². Du Bois =
        0.007184 × W^0.425 × H^0.725. Mosteller = √(W × H / 3600). Haycock,
        Gehan &amp; George, Boyd, Fujimoto, Takahira, and sex-specific Schlich
        equations are listed alongside. Example: 155 lb (≈70.31 kg) and 5′9″
        (175.26 cm) → Mosteller ≈ 1.85 m².
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not use these outputs as a prescribing authority. Follow your
        clinic&apos;s validated BSA protocol, and reassess when height or weight
        change materially.
      </p>

      <div id="bsa-net-faq" className="not-prose mt-8">
        <FAQAccordion items={BODY_SURFACE_AREA_FAQS} />
      </div>
    </article>
  );
}
