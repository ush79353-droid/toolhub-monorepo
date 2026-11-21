import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALEVE_DOSAGE_FAQS } from './content';

export function AleveDosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Aleve Dosage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this educational lookup to compare FDA OTC Aleve (naproxen sodium
        220 mg) Drug Facts with common prescription naproxen label schedules.
        Choose an indication and product strength, then read the matching
        schedule summary. This is not personalized medical advice and does not
        replace your package insert or clinician.
      </p>

      <h2
        id="otc-vs-rx"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        OTC Aleve vs Prescription Naproxen
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Aleve tablets, caplets, and liquid gels are naproxen sodium 220 mg
        (about 200 mg naproxen base) with a unit-based OTC schedule (1 every
        8–12 hours; optional 2 on the first dose; max 3 per day). Prescription
        naproxen and naproxen sodium use different milligram regimens (for
        example, 500 mg naproxen initially for acute pain). Products are not
        interchangeable. This calculator refuses fractional tablet counts when
        a milligram dose does not divide evenly into the selected strength.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the symptom or labeled indication that matches your question.</li>
        <li>Select OTC Aleve 220 mg or a prescription strength.</li>
        <li>Read the schedule, whole-unit counts (when available), maxima, and warnings.</li>
        <li>Use Reload for defaults or Clear after changing selections.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Indication <strong>Pain</strong> with <strong>Tablet 220 mg (Aleve OTC)</strong>{' '}
        → 1 tablet every 8–12 hours; first dose may be 2 tablets within the first
        hour; do not exceed 2 tablets in any 8–12-hour period or 3 tablets
        (660 mg naproxen sodium) in 24 hours. Switching to prescription naproxen
        500 mg for pain shows the 500 mg initial / 250–500 mg follow-up label
        path instead — not “2.3” OTC tablets.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits &amp; Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NSAIDs carry allergy, stomach-bleeding, and heart-related warnings.
        Pregnancy at 20 weeks or later needs clinician guidance. Do not stack
        naproxen with other NSAIDs unless directed. Children under 12 need a
        doctor for OTC Aleve. Share Result shares only the public page URL — not
        your selections — to keep health details out of share payloads.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Browse more tools on the{' '}
        <Link href="/tools" className="text-primary">
          calculators directory
        </Link>
        .
      </p>

      <div id="aleve-dosage-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...ALEVE_DOSAGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
