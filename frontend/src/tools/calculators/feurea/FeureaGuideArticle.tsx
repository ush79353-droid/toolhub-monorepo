import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FEUREA_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function FeureaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        The fractional excretion of urea (FEUrea)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        FEUrea estimates how much of the filtered urea load appears in the
        urine. Clinicians sometimes use it when differentiating prerenal from
        intrinsic patterns of acute kidney injury — especially when diuretics
        make FENa harder to interpret. It is an adjunct only, never a lone
        diagnosis.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the FEUrea calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter serum creatinine, serum urea or BUN, urine creatinine, and urine
        urea. Defaults are mg/dL with unit controls. Match creatinine units;
        if one urea field is nitrogen (BUN) and the other is whole urea, values
        are normalized before the ratio. Example: urine urea 120, serum urea
        20, urine creatinine 100, serum creatinine 2 (all mg/dL) → FEUrea =
        12%. Values stay in your browser only.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        FEUrea interpretation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Treat ≤35%, 35–50%, and &gt;50% bands as teaching aids
        alongside history, exam, sediment, and creatinine trend.
      </p>

      <h2
        id="aki"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Acute kidney injury — definition and causes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        AKI is a sudden decline in kidney function with rising creatinine and/or
        reduced urine output. Causes are often grouped as prerenal (perfusion),
        intrinsic (e.g. ATN, glomerulonephritis), or postrenal (obstruction).
        FEUrea does not replace imaging when obstruction is possible, nor does
        it replace volume assessment when cardiorenal or hepatorenal syndromes
        mimic a &quot;prerenal&quot; fractional-excretion pattern.
      </p>

      <h2
        id="urea"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Urea as a parameter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Urea is filtered and partially reabsorbed; volume depletion and ADH
        activity increase reabsorption and can lower FEUrea. Labs may report
        urea or urea nitrogen (BUN). Use matching analytes when possible; this
        worksheet converts BUN mg/dL to urea mg/dL (×2.14) when needed.
      </p>

      <h2
        id="creatinine"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Creatinine as a parameter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Creatinine appears in the FEUrea formula to normalize for filtration.
        Serum and urine creatinine must use the same concentration basis
        (mg/dL or µmol/L). Zero or negative urine creatinine makes FEUrea
        undefined.
      </p>

      <div id="feurea-faq" className="not-prose mt-8">
        <FAQAccordion items={FEUREA_FAQS} />
      </div>
    </article>
  );
}
