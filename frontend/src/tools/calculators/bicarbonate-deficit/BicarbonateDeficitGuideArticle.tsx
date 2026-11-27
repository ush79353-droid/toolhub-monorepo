import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BICARBONATE_DEFICIT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BicarbonateDeficitGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bicarbonate Deficit Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter body weight with actual and desired bicarbonate concentrations to
        estimate a classic teaching bicarbonate deficit amount. This is an
        educational worksheet — not a laboratory report, diagnosis, or dosing
        protocol.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate bicarbonate deficit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: 72 kg, actual 19 mmol/L, desired 24 mmol/L
        → 0.5 × 72 × (24 − 19) = 180 mmol.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        mmol vs mmol/L
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The concentration gap (desired − actual) is in mmol/L. The estimated
        deficit from this formula is an amount in mmol. Some reference pages
        incorrectly suffix that amount with mmol/L; this calculator labels mmol
        after clinical unit review.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and clinical use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The fixed 0.5 L/kg space is a population approximation. Apparent
        bicarbonate space can change with severity of acidosis, and replacement
        generates CO₂, sodium, and volume load. Do not convert this estimate into
        an automatic infusion plan — recheck blood gas and electrolytes and
        follow local protocols.
      </p>

      <div id="bicarb-def-faq" className="not-prose mt-8">
        <FAQAccordion items={BICARBONATE_DEFICIT_FAQS} />
      </div>
    </article>
  );
}
