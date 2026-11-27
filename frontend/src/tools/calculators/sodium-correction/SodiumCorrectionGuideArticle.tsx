import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SODIUM_CORRECTION_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SodiumCorrectionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sodium Correction Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter measured serum sodium and glucose to estimate a
        hyperglycemia-corrected sodium. High glucose draws water into the
        extracellular space and can dilute the measured sodium. This worksheet
        is educational — not a laboratory report, diagnosis, or treatment plan.
      </p>

      <h2
        id="why-hyperglycemia"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why does hyperglycemia affect sodium?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Glucose is an effective osmole. When plasma glucose rises, water shifts
        from the intracellular to the extracellular compartment and lowers the
        sodium concentration by dilution. Corrected sodium estimates what the
        sodium would be closer to once glucose is normalized — it is not itself
        a fluid-order target.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate corrected sodium
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter the measured sodium in mEq/L and serum glucose (mg/dL by default,
        or mmol/L). The primary result uses the Hillier factor. Open “Corrected
        sodium (older version)” for the classic Katz estimate. When glucose is
        100 mg/dL, both corrections are zero and corrected sodium equals the
        measured value.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Corrected sodium formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: sodium 140 mEq/L with glucose 500 mg/dL →
        Hillier 140 + 0.024 × 400 = 149.6 mEq/L; Katz 140 + 0.016 × 400 = 146.4
        mEq/L. Hillier noted the relationship can be steeper above ~400 mg/dL;
        these linear factors remain teaching estimates only.
      </p>

      <div id="sc-faq" className="not-prose mt-8">
        <FAQAccordion items={SODIUM_CORRECTION_FAQS} />
      </div>
    </article>
  );
}
