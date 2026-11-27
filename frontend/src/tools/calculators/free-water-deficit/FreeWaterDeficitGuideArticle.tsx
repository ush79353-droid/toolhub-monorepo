import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FREE_WATER_DEFICIT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function FreeWaterDeficitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Free Water Deficit Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the free-water volume associated with correcting serum sodium
        toward a chosen target, using a demographic total-body-water fraction.
        This is an educational worksheet — not a laboratory report, diagnosis,
        or infusion prescription.
      </p>

      <h2
        id="what-is-fwd"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is water deficit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In hypernatremia teaching, free water deficit is the estimated volume of
        electrolyte-free water needed to dilute sodium from the measured level
        to a desired level, assuming pure water loss and a fixed total-body
        sodium content. Real patients also have ongoing losses and solute
        changes that this simple model ignores.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How is free water deficit calculated?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example (Omni FAQ): adult male 70 kg, Na 147 mEq/L,
        desired 140 → TBW 42 L → FWD = 42 × ((147/140) − 1) = 2.1 L.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits of the estimate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adrogué and Madias noted that the conventional deficit formula can
        underestimate needs when losses are hypotonic fluid rather than pure
        water, and they preferred infusate ΔNa planning for treatment. TBW
        fractions are population averages; “elderly” has no universal age cutoff
        in the original footnote — choose the category deliberately. This tool
        never invents a drip rate or fluid choice.
      </p>

      <div id="fwd-faq" className="not-prose mt-8">
        <FAQAccordion items={FREE_WATER_DEFICIT_FAQS} />
      </div>
    </article>
  );
}
