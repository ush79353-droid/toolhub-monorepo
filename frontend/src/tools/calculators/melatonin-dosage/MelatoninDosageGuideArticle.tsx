import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MELATONIN_DOSAGE_FAQS } from './content';

export function MelatoninDosageGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Melatonin Dosage Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this educational explorer to review melatonin label information by
        indication and formulation. Screenshot defaults start at trouble falling
        asleep with tablets/capsules and a blank therapy duration. This tool
        does not invent milligram doses or course lengths from those blanks. It
        is not personalized medical advice.
      </p>

      <h2
        id="circadin-vs-supplements"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Circadin vs Dietary Supplements
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        EMA Circadin 2 mg prolonged-release tablets are a prescription medicine
        for short-term primary insomnia in adults aged 55 and over: 2 mg once
        daily after food, 1–2 hours before bedtime, swallow whole, for up to 13
        weeks. In the United States, melatonin is commonly sold as a dietary
        supplement without a single FDA Drug Facts schedule. For tablets,
        capsules, liquids, sprays, and strips, this calculator explains that gap
        and points you to your product label instead of inventing a dose.
      </p>

      <h2
        id="how-to"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select the indication that matches your question.</li>
        <li>
          Choose medication type — use prolonged-release 2 mg only when you want
          the Circadin SmPC summary.
        </li>
        <li>
          Optionally enter therapy duration (days or weeks) for a Circadin
          13-week check; leave blank to avoid inventing a course.
        </li>
        <li>Read warnings and source notes. Use Reload or Clear as needed.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Defaults (trouble falling asleep + tablets/capsules + blank duration)
        return dietary-supplement label information — no invented mg. Switching
        medication type to prolonged-release 2 mg shows Circadin’s 2 mg once
        daily SmPC summary for adults ≥55. Entering 10 weeks stays within the
        13-week ceiling; 14 weeks flags an exceedance without inventing a longer
        authorized course.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits &amp; Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Melatonin is not appropriate for everyone. Pregnancy, breastfeeding,
        autoimmune disease, seizures, depression, and drug interactions need
        clinician advice. Children and adolescents are out of scope for invented
        doses here. Share Result shares only the public page URL — not your
        selections — to keep health details out of share payloads.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm sm:text-base">
        <li>
          <Link href="/tools/dosage-calculator">Dosage Calculator</Link>
        </li>
        <li>
          <Link href="/tools/aleve-dosage-calculator">Aleve Dosage Calculator</Link>
        </li>
        <li>
          <Link href="/tools/benadryl-dosage-calculator">
            Benadryl Dosage Calculator
          </Link>
        </li>
      </ul>

      <div id="melatonin-dosage-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...MELATONIN_DOSAGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
