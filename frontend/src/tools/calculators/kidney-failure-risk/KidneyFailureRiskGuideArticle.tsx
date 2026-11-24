import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { KIDNEY_FAILURE_RISK_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function KidneyFailureRiskGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Kidney Failure Risk Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational Tangri 2011 categorical point total for
        progression to kidney failure among adults with CKD stages G3–G5. The
        primary result is points (pts), with an optional published chart lookup
        for approximate 5-year probability — not a dialysis order.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Tangri Points Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tangri and colleagues published both continuous Kidney Failure Risk
        Equations (KFRE) and a categorical points implementation using the same
        eight variables: age, sex, eGFR, urine ACR band, and serum albumin,
        bicarbonate, calcium, and phosphorus. This calculator uses the points
        table. More negative totals correspond to higher charted risk.
      </p>

      <h2
        id="inputs"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Inputs on This Page
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Sex (Female / Male)</li>
        <li>Age in years</li>
        <li>Urine ACR category: &lt;30, 30–300, or &gt;300 mg/g</li>
        <li>Indexed eGFR (mL/min/1.73 m²)</li>
        <li>Serum albumin, bicarbonate, calcium, and phosphorus</li>
      </ul>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Points Are Summed
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total points = age band + sex + ACR band + eGFR band + albumin band +
        bicarbonate band + calcium band + phosphorus band. ACR contributes only
        its published categorical points (0 / −14 / −22) — never a fabricated
        numeric midpoint. Eligible eGFR for scoring here is 1–59 mL/min/1.73 m².
      </p>

      <h2
        id="probability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        5-Year Probability Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After points are totaled, explanation text may cite the published
        points-to-5-year-probability chart (for example −27 ≈ 42.7%; totals
        &lt;−41 → &gt;90%; ≥−3 → &lt;5%). That lookup is not the continuous KFRE
        percentage.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Confirm sex and ACR band (defaults match the reference UI).</li>
        <li>Enter age, eGFR &lt;60, and the four serum labs.</li>
        <li>Read the live points result; use Reload or Clear to reset.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Tangri Table 4 patient A profile: 70-year-old male, eGFR 30, ACR 200
        mg/g (30–300 band), albumin 3.5 g/dL, bicarbonate 21 mEq/L, calcium 9.0
        mg/dL, phosphorus 4.5 mg/dL → −27 pts (chart ≈ 42.7% at 5 years).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_LABEL} Educational only. Not for acute kidney injury, eGFR ≥60,
        or individualized treatment decisions. Lab entries are not stored or
        placed in share URLs.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/creatinine-clearance-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Creatinine Clearance Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/gfr-calculator-estimated-glomerular-filtration-rate"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            GFR Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="kfr-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...KIDNEY_FAILURE_RISK_FAQS]} />
      </div>
    </article>
  );
}
