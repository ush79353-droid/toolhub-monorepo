import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { POSITIVE_PREGNANCY_FOLLOW_UP_FAQS } from './content';

export function PositivePregnancyFollowUpGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What to do after you get a positive pregnancy test
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A positive home urine test is a signal to seek clinical confirmation —
        not a diagnosis by itself. This page pairs general, non-prescriptive
        follow-up context with an educational testing-timetable widget (the same
        natural/IVF timing model used on related pregnancy-test tools).
      </p>

      <h2
        id="timing-widget"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Testing Timing Widget
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Defaults match the shared educational UI: 28-day natural cycle with blank
        LMP/ovulation/urine/blood fields; IVF blank transfer/urine/blood with a
        default 5-day blastocyst age; test-sensitivity checkbox unchecked. The
        widget estimates when testing is often discussed — it does not confirm
        pregnancy or interpret laboratory hCG.
      </p>

      <h2
        id="next-steps"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        General Next Steps
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Contact a clinician or prenatal care provider to confirm the result and
          discuss next visits.
        </li>
        <li>
          Review any prescription or over-the-counter medicines with a clinician
          or pharmacist before continuing them.
        </li>
        <li>
          Seek urgent or emergency care for severe pain, heavy bleeding,
          fainting, or other sudden severe symptoms — this page does not triage
          emergencies.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Related tools:{' '}
        <Link
          href="/tools/blood-pregnancy-test-what-do-hcg-results-mean"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Blood Pregnancy Test: What Do HCG Results Mean?
        </Link>
        .
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Content avoids treatment direction. Timing estimates are educational.
        Share copies the page URL only — never your dates.
      </p>

      <h2
        id="positive-pregnancy-follow-up-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...POSITIVE_PREGNANCY_FOLLOW_UP_FAQS]} />
      </div>
    </article>
  );
}
