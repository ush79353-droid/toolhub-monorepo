import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FISH_OIL_FAQS } from './content';

export function FishOilGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fish Oil Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare screenshot age bands and selected special nutritional needs
        against published omega-3 guidance. The tool distinguishes EPA/DHA from
        ALA, food patterns from supplements, and OTC fish oil from prescription
        omega-3 products.
      </p>

      <h2
        id="epa-dha-vs-ala"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        EPA/DHA vs ALA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NIH ODS reports Adequate Intakes for ALA (and total omega-3s in
        infancy), not for EPA or DHA. Screenshot age bands do not match IOM life
        stages one-for-one; overlapping endpoints are called out instead of
        inventing a single “fish oil mg” by age.
      </p>

      <h2
        id="sources"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Primary sources
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NIH Office of Dietary Supplements Omega-3 Fatty Acids fact sheets (IOM
        ALA/total omega-3 AIs; FDA ≤5 g/day EPA+DHA from supplements); Dietary
        Guidelines seafood pattern averages cited by ODS (~250 mg/day EPA+DHA
        from about 8 oz seafood/week); AHA advisories for CHD (~1 g/day EPA+DHA,
        preferably from fish, supplements only with clinician direction) and for
        very high triglycerides (4 g/day prescription omega-3—not OTC fish oil).
      </p>

      <div id="fish-oil-faq" className="not-prose mt-8">
        <FAQAccordion items={FISH_OIL_FAQS} />
      </div>
    </article>
  );
}
