import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ACID_BASE_FAQS } from './content';

export function AcidBaseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Acid Base Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Review arterial blood gas context and compute the serum anion gap with
        optional albumin correction. Educational only — not a laboratory report
        or treatment plan.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is acid–base balance?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Acid–base balance describes how the body keeps blood pH near the normal
        range through respiratory (CO₂) and metabolic (bicarbonate) systems.
        Teaching tools help frame ABG patterns; they do not replace clinical
        judgment.
      </p>

      <h2
        id="abg"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Arterial blood gas values
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        pH, PCO₂, and bicarbonate together sketch whether acidemia or alkalemia
        is present and whether the dominant process looks metabolic or
        respiratory. Expected compensation formulas (for example Winter&apos;s
        for metabolic acidosis) are teaching aids, not diagnoses.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate anion gap
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Anion gap = Na − Cl − HCO₃. Albumin-corrected gap = AG + 2.5 × (4.0 −
        albumin g/dL). Hypoalbuminemia can hide a high-gap metabolic acidosis if
        the uncorrected gap alone is used.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        A practical example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Na 140, Cl 104, HCO₃ 24 → AG = 12 mEq/L, even when albumin is blank. With
        albumin 2.0 g/dL, corrected AG = 12 + 2.5 × (4 − 2) = 17 mEq/L.
      </p>

      <div id="ab-faq" className="not-prose mt-8">
        <FAQAccordion items={ACID_BASE_FAQS} />
      </div>
    </article>
  );
}
