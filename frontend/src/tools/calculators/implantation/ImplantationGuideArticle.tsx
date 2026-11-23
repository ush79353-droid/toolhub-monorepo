import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_LABEL } from './calculation';
import { IMPLANTATION_FAQS } from './content';

export function ImplantationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Implantation Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool estimates when implantation might occur after natural
        ovulation or after an IVF transfer. Results are labeled educational
        windows — not proof of pregnancy or exact clinical dating.
      </p>

      <h2
        id="how-it-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How It Works
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Natural and fertility-treatment panels keep separate state. Enter ovulation
        (or LMP + cycle) for natural timing, and transfer day for IVF. The
        calculator never stores your dates in the URL or share payload.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Timing Windows
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Natural conception: implantation window = ovulation + 6 to 12 days;
        typical display uses day 9. IVF without embryo age: educational band =
        transfer + 1 to 6 calendar days.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Expand Natural conception. Choose whether you know ovulation.</li>
        <li>Enter ovulation or last period + cycle length.</li>
        <li>Read the implantation date and listed window below the output.</li>
        <li>For IVF, enter transfer day in the Fertility treatment panel.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Ovulation 15 March → typical implantation ≈ 24 March (day 9); window
        21 March – 27 March. Transfer 10 April (no embryo age) → typical ≈ 12
        April; educational window 11 April – 16 April.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Implantation timing varies by individual cycle, embryo quality, and
        clinical protocol. This page does not interpret hCG, bleeding, or
        ultrasound findings. Always follow your clinician.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
        <li>
          <Link href="/tools/pregnancy-test-calculator">Pregnancy Test Calculator</Link>
        </li>
        <li>
          <Link href="/tools/conception-calculator">Conception Calculator</Link>
        </li>
        <li>
          <Link href="/tools/gestational-age-calculator">
            Gestational Age Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="implantation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="not-prose mt-4">
        <FAQAccordion items={IMPLANTATION_FAQS} />
      </div>
    </article>
  );
}