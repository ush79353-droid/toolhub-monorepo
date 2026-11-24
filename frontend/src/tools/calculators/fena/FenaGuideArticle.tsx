import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FENA_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function FenaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is FENa?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fractional excretion of sodium (FENa) estimates how much of the filtered
        sodium load appears in the urine. Clinicians sometimes use it when
        evaluating acute kidney injury patterns and oliguria — always alongside
        history, exam, and other labs, never as a lone diagnosis.
      </p>

      <h2
        id="required-labs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Required lab test results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter serum creatinine (mg/dL), serum sodium (mmol/L), urine creatinine
        (mg/dL), and urine sodium (mmol/L). Keep serum and urine units matched
        for each analyte. Values stay in your browser only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FENa formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: serum Cr 2 mg/dL, serum Na 140 mmol/L, urine Cr
        100 mg/dL, urine Na 70 mmol/L → FENa = 1%.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpretation of results
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Classic educational bands map FENa &lt;1% toward a prerenal
        (volume-responsive) pattern and &gt;2% toward intrinsic renal injury when
        diuretics are absent and CKD is not advanced. The 1–2% range is often
        indeterminate. Loop/thiazide diuretics, advanced CKD, and mixed injuries
        blunt these thresholds — treat them as teaching aids, not a standalone
        AKI diagnosis.
      </p>

      <div id="fena-faq" className="not-prose mt-8">
        <FAQAccordion items={FENA_FAQS} />
      </div>
    </article>
  );
}
