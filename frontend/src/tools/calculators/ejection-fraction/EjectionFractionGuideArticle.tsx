import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EJECTION_FRACTION_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function EjectionFractionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Ejection Fraction Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compute the fraction of end-diastolic volume ejected each beat. Choose
        whether you know stroke volume, end-systolic volume, or cardiac output
        with heart rate. The tool is educational arithmetic only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Ejection Fraction?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ejection fraction is stroke volume divided by end-diastolic volume,
        usually expressed as a percentage. Clinicians obtain the volumes from
        imaging; this calculator only applies the identity once volumes (or CO
        and HR) are known.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>EF%</strong> = 100 × SV / EDV
        </li>
        <li>
          <strong>From ESV</strong> — SV = EDV − ESV (require ESV ≤ EDV)
        </li>
        <li>
          <strong>From CO & HR</strong> — SV (mL) = 1000 × CO (L/min) / HR
          (bpm)
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
        <li>Select what you know under “I know…”.</li>
        <li>Enter EDV in mL.</li>
        <li>Enter SV, or ESV, or CO and HR for that mode.</li>
        <li>Read the ejection fraction percentage.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EDV = 120 mL with SV = 72 mL, or ESV = 48 mL, or CO = 5.04 L/min with HR
        = 70 bpm, all give EF = <strong>60%</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This page does not classify reduced, mildly reduced, or preserved EF,
        and it does not interpret echocardiograms. Positive EDV and HR are
        required; ESV cannot exceed EDV.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/cardiac-output-calculator">
            Cardiac Output Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/blood-pressure-calculator">
            Blood Pressure Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/cha2ds2-vasc-calculator">
            CHA₂DS₂-VASc Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="ejection-fraction-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...EJECTION_FRACTION_FAQS]} />
      </div>
    </article>
  );
}
