import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { PROTEIN_CREATININE_FAQS } from './content';

export function ProteinCreatinineRatioGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Urine protein creatinine ratio (UPCR)</h2>
        <p>
          Estimate the urine protein-to-creatinine ratio from a spot sample.
          Enter urine protein in mg/dL and urine creatinine (mg/dL, g/L, or
          mmol/L). The result shows UPCR with the common g/day teaching label.
        </p>
      </section>

      <section id="how-to-calculate">
        <h2>How to calculate protein creatinine ratio</h2>
        <p>
          After converting creatinine to mg/dL, UPCR (g/g) = protein (mg/dL) ÷
          creatinine (mg/dL). Multiply by 1000 for mg/g. This is distinct from
          the albumin-to-creatinine ratio (ACR), which uses albumin only.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>

      <section id="interpretation">
        <h2>Protein creatinine ratio — interpretation</h2>
        <p>
          Clinicians interpret UPCR alongside history, exam, and other labs.
          Thresholds for “significant” proteinuria vary by guideline and
          context. This worksheet does not apply sex- or age-specific cutoffs
          without an approved sourced table.
        </p>
      </section>

      <section id="nephrotic">
        <h2>Nephrotic range proteinuria</h2>
        <p>
          Nephrotic-range proteinuria is often discussed around ≥3.5 g/day of
          protein excretion. A spot UPCR near or above ~3.5 g/g is sometimes
          used as a teaching surrogate, but confirmation requires clinical
          judgment and often a timed collection or serial measures.
        </p>
      </section>

      <section id="example">
        <h2>Protein creatinine ratio calculator — a practical example</h2>
        <p>
          Example: urine protein 50 mg/dL and urine creatinine 100 mg/dL → UPCR
          = 50 ÷ 100 = 0.5 g/g (500 mg/g), shown as 0.5 g/day under the common
          teaching label.
        </p>
      </section>

      <section id="protein-creatinine-faq">
        <h2>FAQs</h2>
        <FAQAccordion faqs={[...PROTEIN_CREATININE_FAQS]} />
      </section>
    </article>
  );
}
