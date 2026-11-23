import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CARDIAC_OUTPUT_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function CardiacOutputGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cardiac Output Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate cardiac output (CO) and cardiac index (CI) with the classic
        Fick relationship between whole-body oxygen consumption and the
        arteriovenous oxygen content difference. The calculator is for
        teaching and self-checks only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Fick Cardiac Output?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In a steady state, oxygen taken up by the lungs equals oxygen consumed
        by the tissues. Rearranged, cardiac output equals oxygen consumption
        divided by the difference between arterial and mixed-venous oxygen
        content. Measured VO₂ is preferred clinically; many bedside worksheets
        still use an indexed estimate when VO₂ is unavailable.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>BSA (Mosteller)</strong> — √(height<sub>cm</sub> ×
          weight<sub>kg</sub> / 3600) in m².
        </li>
        <li>
          <strong>Estimated VO₂</strong> — 125 mL/min/m² × BSA (resting adult
          index used in StatPearls Fick summaries). Flagged as estimated.
        </li>
        <li>
          <strong>Oxygen content</strong> — mL/dL = 1.34 × Hb × (Sat/100) +
          0.0031 × PO₂ (Torr); converted to mL/L by ×10.
        </li>
        <li>
          <strong>CO</strong> — VO₂ (mL/min) ÷ (CaO₂ − CvO₂) (mL/L).
        </li>
        <li>
          <strong>CI</strong> — CO ÷ BSA (L/(min·m²)).
        </li>
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary sources: {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter height and weight (or override BSA).</li>
        <li>
          Accept the estimated O₂ consumption or type a measured VO₂.
        </li>
        <li>
          Enter hemoglobin plus arterial and venous saturation (and tension if
          you want the dissolved term), or enter oxygen concentrations
          directly.
        </li>
        <li>Read cardiac output and cardiac index in the results panel.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        VO₂ = 250 mL/min with an arteriovenous content difference of 50 mL/L
        yields CO = 250 ÷ 50 = <strong>5.00 L/min</strong>. With BSA 2.0 m²,
        CI = 2.50 L/(min·m²).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimated VO₂ can err by more than 25% in fever, sepsis, sedation, or
        advanced age. Mixed venous samples should represent pulmonary-artery
        blood. This tool does not recommend fluids, inotropes, or catheter
        placement.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/cardiac-index-calculator">
            Cardiac Index Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/ejection-fraction-calculator">
            Ejection Fraction Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/map-mean-arterial-pressure-calculator">
            Mean Arterial Pressure Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="cardiac-output-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CARDIAC_OUTPUT_FAQS]} />
      </div>
    </article>
  );
}
