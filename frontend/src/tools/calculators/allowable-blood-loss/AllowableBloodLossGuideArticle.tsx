import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALLOWABLE_BLOOD_LOSS_FAQS } from './content';
import { DENOMINATOR_NOTE, SOURCE_NOTE } from './calculation';

export function AllowableBloodLossGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Allowable Blood Loss Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter age/sex category, weight, initial hemoglobin, and a clinician
        threshold for lowest acceptable hemoglobin to estimate maximum
        allowable blood loss in milliliters. Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Gross Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {DENOMINATOR_NOTE}
      </p>

      <h2
        id="ebv"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Estimated Blood Volume
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Category factors used here are adult female 65 mL/kg, adult male 75
        mL/kg, child 80 mL/kg, and neonate 85 mL/kg. Local protocols may use
        different constants.
      </p>

      <h2
        id="clinical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Clinical Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Maximum allowable blood loss is one input among many for operative
        blood management. It does not replace clinical judgment, hemodynamic
        assessment, or institutional transfusion policies.
      </p>

      <div id="abl-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ALLOWABLE_BLOOD_LOSS_FAQS]} />
        </div>
      </div>
    </article>
  );
}