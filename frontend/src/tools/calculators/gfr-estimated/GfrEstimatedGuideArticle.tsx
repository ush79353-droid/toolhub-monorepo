import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GFR_ESTIMATED_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function GfrEstimatedGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        GFR Calculator – Estimated Glomerular Filtration Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate adult eGFR from serum creatinine, serum cystatin C, or both.
        The interactive panel mirrors common teaching layouts (creatinine /
        cystatin / both, sex, optional legacy ethnicity, age, and lab units)
        while labeling current race-free CKD-EPI 2021 estimates separately from
        historical CKD-EPI 2009 and MDRD outputs.
      </p>

      <h2
        id="what-is-egfr"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is eGFR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimated glomerular filtration rate (eGFR) approximates how well the
        kidneys filter blood, indexed to 1.73 m² body-surface area. Laboratories
        usually report eGFR alongside creatinine (and sometimes cystatin C)
        using published estimating equations rather than measuring GFR directly
        with exogenous filtration markers.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate GFR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Creatinine in µmol/L is converted with ÷ 88.4 to mg/dL.
        Cystatin C uses mg/L. Adult equations here require age 18–120 years.
      </p>

      <h2
        id="alarming-levels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What levels of estimated GFR are alarming?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Teaching bands often map eGFR to: ≥90 normal; 60–89 mildly decreased;
        45–59 mildly to moderately decreased; 30–44 moderately to severely
        decreased; 15–29 severely decreased; &lt;15 kidney failure. Lower bands
        warrant clinical evaluation, but a single reading does not by itself
        diagnose chronic kidney disease.
      </p>

      <h2
        id="ckd-context"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to deal with chronic kidney disease?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        CKD care is individualized: confirm persistence of reduced GFR or
        markers of kidney damage, address reversible causes, review medications
        that affect creatinine or kidney hemodynamics, and follow clinician
        guidance for blood pressure, diabetes, albuminuria, and referral
        thresholds. This page does not provide treatment recommendations.
      </p>

      <div id="gfr-faq" className="not-prose mt-8">
        <FAQAccordion items={GFR_ESTIMATED_FAQS} />
      </div>
    </article>
  );
}
