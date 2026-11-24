import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IRON_DEFICIENCY_FAQS } from './content';
import { DISCLAIMER, SOURCE_NOTE } from './calculation';

export function IronDeficiencyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Iron Deficiency Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter body weight with actual and target hemoglobin to estimate total
        iron deficit with the Ganzoni formula. Iron stores are derived from
        weight. Educational arithmetic only—not a diagnosis, ferritin
        interpretation, or intravenous iron prescription.
      </p>

      <h2
        id="ganzoni"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ganzoni Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: 70 kg, actual Hb 9 g/dL, target 15 g/dL →
        hemoglobin component 1,008 mg + stores 500 mg = 1,508 mg estimated
        deficit.
      </p>

      <h2
        id="stores"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Iron Store Allowance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published Ganzoni dosing tables commonly add 500 mg when body weight is
        at least 35 kg, or 15 mg per kilogram when weight is under 35 kg. The
        store term rebuilds estimated body iron depot after hemoglobin is
        corrected; it is not a measured iron study.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Units and Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Weight may be entered in kg or lb; hemoglobin in g/dL or g/L. Values
        convert before math, and physical quantities are preserved when units
        change. Using g/L with factor 0.24 is equivalent to g/dL with factor
        2.4. {DISCLAIMER}
      </p>

      <div id="iron-deficiency-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...IRON_DEFICIENCY_FAQS]} />
        </div>
      </div>
    </article>
  );
}
