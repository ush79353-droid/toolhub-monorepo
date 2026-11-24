import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IVIG_DOSE_FAQS } from './content';

export function IvigDoseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-it-works"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        IVIG Dose Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose <strong>General</strong> to estimate intravenous immune globulin
        (IVIG) grams from a supplied g/kg intensity and an educational dosing
        weight (actual, Devine ideal, or adjusted). Choose{' '}
        <strong>Pregnancy hemorrhage</strong> for an Rh(D) immune globulin
        (RhIG) vial estimate after fetomaternal hemorrhage — a different product
        from polyvalent IVIG.
      </p>

      <h2
        id="weight-basis"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weight basis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        General dosing follows commonly cited adult immunoglobulin stewardship
        practice: Devine ideal body weight when height ≥ 152.4 cm and weight
        meets the adult floor; adjusted body weight when BMI ≥ 30; actual weight
        when below ideal or when height/weight fall outside those eligibility
        floors. Always confirm the protocol used by your blood bank or
        immunology service.
      </p>

      <h2
        id="products"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IVIG vs RhIG
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        IVIG grams require a clinician-supplied g/kg (for example Privigen
        chronic ITP 1 g/kg daily for two days on the FDA/DailyMed label). RhIG
        vials follow AABB Technical Manual arithmetic with Nadler maternal blood
        volume and Kleihauer–Betke / flow-cytometry percent fetal cells. This
        tool suppresses inventing IVIG grams for unsupported obstetric
        indications.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions &amp; limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational arithmetic only — not a prescribing order, transfusion
        issue, or substitute for product labeling, vial availability, or
        clinician judgment. Pediatric, pregnancy IVIG (pre-pregnancy weight
        policies), and indication-specific schedules beyond the supplied g/kg
        field are out of scope.
      </p>

      <div id="faq" className="not-prose mt-8">
        <FAQAccordion items={[...IVIG_DOSE_FAQS]} />
      </div>
    </article>
  );
}
