import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FUNDAL_HEIGHT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function FundalHeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fundal Height Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Compare a measured symphysis–fundal height with INTERGROWTH-21st
        international standards, estimate gestational age from SFH, or explore an
        educational Johnson fetal-weight formula. Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        INTERGROWTH Equations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculation Modes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>SFH percentile</strong> — median and SD from exact weeks; z and
          percentile when measured SFH is entered; centile chart.
        </li>
        <li>
          <strong>SFH to gestational age</strong> — published reverse regression
          for SFH 12–38 cm.
        </li>
        <li>
          <strong>SFH to fetal weight</strong> — Johnson teaching estimate with
          maternal weight band and vertex station controls.
        </li>
      </ul>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        SFH is a screening measurement with known observer variability. Do not
        use this page alone to diagnose growth restriction or estimate delivery
        timing.
      </p>

      <h2
        id="fh-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...FUNDAL_HEIGHT_FAQS]} />
      </div>
    </article>
  );
}
