import { VTE_RISK_PREGNANCY_FAQS } from './content';

export function VteRiskPregnancyGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What Is This VTE Score?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This tool totals pregnancy and puerperium venous thromboembolism (VTE)
          risk-factor points from RCOG Green-top Guideline No. 37a Appendix III.
          It is an educational checklist score for antenatal or postnatal
          situations — not a diagnosis and not a prescription for low-molecular-
          weight heparin (LMWH) or any other prophylaxis.
        </p>
      </section>

      <section id="scoring" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How Scoring Works</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tick applicable pre-existing, obstetric, and transient factors.
          Optional height and weight derive BMI; obesity contributes 1 point for
          BMI ≥30 kg/m² and 2 points for BMI ≥40 kg/m². Prior VTE (4) and
          surgery-provoked prior VTE (3) are mutually exclusive. ART/IVF and
          OHSS apply only in the antenatal/first-trimester scopes defined by
          RCOG.
        </p>
      </section>

      <section id="thresholds" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Antenatal and Postnatal Bands
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Antenatal appendix bands highlight scores ≥4 (consideration from the
          first trimester) and score 3 (consideration from 28 weeks). Postnatal
          appendix banding highlights scores ≥2 (consideration for at least 10
          days). These labels are educational mirrors of the guideline table —
          they are not treatment orders.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Choose pregnant or has given birth.</li>
          <li>Optionally enter height and weight for obesity points.</li>
          <li>Tick all applicable risk factors in each group.</li>
          <li>Read the live total score and educational band summary.</li>
          <li>Use Reload or Clear to reset; discuss results with a clinician.</li>
        </ol>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The screenshot checklist is a practical subset of Appendix III; it
          does not replace the full RCOG table, local pathways, or individual
          clinical assessment. Factor definitions (for example medical
          comorbidities or immobility) still need clinician interpretation.
          Guidelines can be updated — confirm the current local protocol.
        </p>
      </section>

      <section id="vte-risk-pregnancy-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="mt-4 space-y-4">
          {VTE_RISK_PREGNANCY_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-sm font-semibold text-accent">
                {faq.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
