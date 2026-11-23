import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MAP_FAQS } from './content';

export function MapGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        MAP Calculator (Mean Arterial Pressure)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter systolic and diastolic blood pressures in mmHg to estimate mean
        arterial pressure (MAP). Optionally display pulse pressure (SBP − DBP).
        This worksheet is for teaching and orientation — not diagnosis or
        treatment decisions.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MAP and Pulse Pressure Formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MAP = (SBP + 2 × DBP) ÷ 3 = DBP + (SBP − DBP) ÷ 3. Pulse pressure PP =
        SBP − DBP when you check “Display pulse pressure.”
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For SBP 120 mmHg and DBP 80 mmHg: MAP = (120 + 160) ÷ 3 = 93.33 mmHg;
        pulse pressure = 40 mmHg.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cuff-based MAP is an approximation. Reference bands in field labels are
        not treatment targets. Share uses the public page URL only — never your
        entered pressures.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/cerebral-perfusion-pressure-calculator">
            Cerebral Perfusion Pressure Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/blood-pressure-calculator">
            Blood Pressure Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="map-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...MAP_FAQS]} />
      </div>
    </article>
  );
}