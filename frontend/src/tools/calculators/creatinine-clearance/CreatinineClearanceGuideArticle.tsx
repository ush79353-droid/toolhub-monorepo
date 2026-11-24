import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { CREATININE_CLEARANCE_FAQS } from './content';

export function CreatinineClearanceGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>What is creatinine clearance?</h2>
        <p>
          Creatinine clearance (CrCl) estimates how quickly the kidneys clear
          creatinine from blood. Clinicians sometimes use estimated CrCl when
          thinking about kidney function or historical drug-dosing tables. This
          worksheet is educational only and is not a prescription or lab report.
        </p>
      </section>
      <section id="cockcroft-gault">
        <h2>Cockcroft–Gault equation</h2>
        <p>
          The estimate uses Cockcroft and Gault (Nephron, 1976): CrCl =
          (140 − age) × weight × sex factor ÷ (72 × serum creatinine), with sex
          factor 0.85 for females and 1 for males. Serum creatinine in µmol/L is
          converted to mg/dL by dividing by 88.4.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="weight-adjustment">
        <h2>Body-weight adjustment</h2>
        <p>
          Height and weight define BMI. Underweight patients (BMI &lt; 18.5) use
          actual body weight. Normal BMI (18.5 to &lt; 25) uses Devine ideal body
          weight. Overweight or obese patients (BMI ≥ 25) use adjusted body
          weight = IBW + 0.4 × (total body weight − IBW), matching the Omni
          Calculator summary of Winter/Brown practice.
        </p>
      </section>
      <section id="direct-crcl">
        <h2>Direct CrCl calculation</h2>
        <p>
          A timed urine collection can measure clearance directly: dCrCl =
          (urine creatinine × urine volume) ÷ (serum creatinine × collection
          minutes). Example: urine creatinine 100 mg/dL, serum creatinine 1
          mg/dL, and 1440 mL collected over 24 hours yields 100 mL/min. The
          estimate and direct panels are independent.
        </p>
      </section>
      <section id="crcl-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...CREATININE_CLEARANCE_FAQS]} />
      </section>
    </article>
  );
}
