import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TYLENOL_DOSAGE_FAQS } from './content';

export function TylenolDosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Tylenol Dosage Calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool summarizes US OTC TYLENOL® Drug Facts dosing for adults and
        children 12 years and older by symptom group and product. It is an
        educational label lookup — not a prescription, weight-based pediatric
        chart, or substitute for the carton in your hand.
      </p>

      <h2
        id="labels"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Current Label Schedules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Regular Strength 325 mg: 2 every 4–6 h · max 10 / 24 h (3,250 mg)</p>
        <p>Extra Strength 500 mg: 2 every 6 h · max 6 / 24 h (3,000 mg)</p>
        <p>Sinus Severe / Cold+Flu Severe: 2 every 4 h · max 10 / 24 h</p>
        <p>PM Extra Strength: 2 at bedtime · max 2 of this product / 24 h</p>
      </div>

      <h2
        id="combo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Combination Products & Acetaminophen
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sinus, Cold + Flu, and PM formulas include acetaminophen plus other
        actives (decongestants, expectorants, cough suppressants, or
        diphenhydramine). Do not stack them with additional acetaminophen
        products. Liver injury risk rises with duplicate sources and with
        alcohol use.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the symptom group that matches your need.</li>
        <li>Choose a product listed for that symptom.</li>
        <li>
          Read the labeled interval, 24-hour unit ceiling, and acetaminophen
          milligram ceiling. Confirm against your package.
        </li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Formulations and directions change. Hospital or professional packs may
        differ. This page does not cover Infant/Children&apos;s weight charts
        (see the Infant Tylenol Dosage Calculator) and does not diagnose
        conditions or recommend therapy.
      </p>

      <div id="tylenol-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...TYLENOL_DOSAGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
