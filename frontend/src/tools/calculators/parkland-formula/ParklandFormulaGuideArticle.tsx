import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PARKLAND_FAQS } from './content';

export function ParklandFormulaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Parkland Formula Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate total body surface area burned with the Rule of Nines, then
        derive a classic Parkland crystalloid volume for the first 24 hours.
        Educational worksheet only — not a resuscitation order.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Parkland formula works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total fluids (mL / 24 h) = 4 × weight_kg × TBSA%. Give half of that
        volume in the first 8 hours from injury and the remaining half over the
        next 16 hours. Nominal IV rates divide those half-volumes by 8 h and
        16 h. Pediatric resuscitation protocols may use different coefficients;
        this tool keeps the classic 4 mL teaching coefficient and switches only
        the age-specific TBSA chart.
      </p>

      <h2
        id="nines"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rule of Nines and TBSA
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Adults: head 9%, each arm 9%, each leg 18%, anterior torso 18%,
        posterior torso 18%, groin 1%. Children use a larger head (18%) and
        smaller legs (14% each). Mark only partial- and full-thickness burns.
        Do not select overlapping descriptions of the same region twice.
      </p>

      <div id="parkland-faq" className="not-prose mt-8">
        <FAQAccordion items={PARKLAND_FAQS} />
      </div>
    </article>
  );
}
