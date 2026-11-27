import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PLASMA_VOLUME_FAQS } from './content';

export function PlasmaVolumeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Plasma Volume Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate adult plasma volume from weight and hematocrit, with optional
        height for Nadler and Lemmens methods. Educational only.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is plasma volume?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Plasma is the liquid fraction of blood. Hematocrit is the packed-cell
        fraction; the remainder approximates plasma when multiplied by total
        blood volume.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the calculator works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PV = TBV × (1 − Hct/100). Weight-only TBV uses 65 mL/kg (female) and 70
        mL/kg (male). Example: Hct 40% yields 60% of estimated blood volume.
        Nadler uses height in meters; Lemmens scales the sex-specific mL/kg by
        BMI relative to 22.
      </p>

      <div id="pv-faq" className="not-prose mt-8">
        <FAQAccordion items={PLASMA_VOLUME_FAQS} />
      </div>
    </article>
  );
}
