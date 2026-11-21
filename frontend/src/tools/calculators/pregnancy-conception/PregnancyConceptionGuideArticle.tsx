import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PREGNANCY_CONCEPTION_FAQS } from './content';

export function PregnancyConceptionGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Pregnancy Conception Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate a conception date from an expected due date, last menstrual
        period, or ultrasound gestational age using ACOG-style educational
        calendar dating. The tool also shows an approximate intercourse window
        based on commonly cited sperm viability of about 3–5 days.
      </p>

      <h2
        id="methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dating Methods
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Conception ≈ EDD − 266 days</p>
        <p>LMP (28-day cycle): EDD = LMP + 280 (+ cycle − 28)</p>
        <p>Ultrasound (educational): EDD = exam + (280 − GA days)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Source framing follows ACOG Committee Opinion No. 700 (May 2017), Methods
        for Estimating the Due Date. Clinical ultrasound biometry may revise
        dates.
      </p>

      <h2
        id="window"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Approximate Intercourse Window
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The range ends on the estimated conception day and begins up to five days
        earlier. It is explicitly approximate and does not establish exact
        conception timing or paternity.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cycle irregularity, implantation timing, and clinical dating can differ
        from these calendar rules. Share copies the page URL only — never your
        dates.
      </p>

      <h2
        id="pregnancy-conception-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...PREGNANCY_CONCEPTION_FAQS]} />
      </div>
    </article>
  );
}
