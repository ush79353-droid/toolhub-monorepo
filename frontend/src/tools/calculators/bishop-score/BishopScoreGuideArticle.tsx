import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BISHOP_SCORE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function BishopScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Bishop Score Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter cervical exam findings to see the classic Bishop score used in
        obstetric teaching. The tool is educational only: it does not decide
        whether labor should be induced and it does not estimate the chance of
        vaginal delivery.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Bishop Score?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Edward Bishop described a pelvic scoring system in 1964 that grades five
        findings from a digital cervical exam. Points are added for a total
        between 0 and 13. Clinicians historically use the total when discussing
        cervical favorability; this calculator stops at the numeric total.
      </p>

      <h2
        id="components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Five Scored Findings
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Dilation</strong> — cervical opening (closed / 1–2 / 3–4 /
          ≥5 cm → 0–3 points).
        </li>
        <li>
          <strong>Effacement</strong> — thinning (0–30% / 40–50% / 60–70% /
          ≥80% → 0–3).
        </li>
        <li>
          <strong>Consistency</strong> — firm / moderately firm / soft → 0–2.
        </li>
        <li>
          <strong>Station</strong> — fetal head vs ischial spines on the classic
          −3…+2 scale → 0–3.
        </li>
        <li>
          <strong>Cervical position</strong> — posterior / mid / anterior → 0–2
          (screenshot label: “baby&apos;s head position”).
        </li>
      </ul>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How the Score Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Bishop score = sum of the five item points. Decimal dilations use
        continuous band edges (&lt;1, &lt;3, &lt;5, ≥5 cm). Millimeters convert
        with 10 mm = 1 cm before banding.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Primary source: {SOURCE_LABEL}
      </p>

      <h2
        id="position-note"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cervical Position vs Head Position
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The scored posterior / mid-position / anterior options describe where
        the cervix sits in the pelvis relative to the presenting part—not fetal
        occiput presentation. The calculator keeps the consumer “baby&apos;s
        head position” wording for layout parity and clarifies the clinical
        meaning in the tip and results copy.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter dilation and choose cm or mm.</li>
        <li>Select the matching effacement, consistency, station, and position radios.</li>
        <li>Read the Bishop score once dilation is valid; leave it blank if dilation is empty.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Closed cervix (0 cm), 0–30% effacement, firm consistency, station −3,
        posterior cervix → 0 + 0 + 0 + 0 + 0 = <strong>0</strong>. A favorable
        teaching example: 5 cm, ≥80%, soft, +1/+2, anterior → 3 + 3 + 2 + 3 + 2
        = <strong>13</strong>.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Digital exams have clinical contraindications (for example placenta
        previa or certain membrane ruptures) that this tool cannot assess.
        Modified or simplified Bishop scores are out of scope. Favorability
        cutoffs and ripening decisions belong with a clinician.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/due-date-calculator" className="text-primary hover:underline">
            Due Date Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/pregnancy-calculator"
            className="text-primary hover:underline"
          >
            Pregnancy Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/vte-risk-score-calculator-in-pregnancy"
            className="text-primary hover:underline"
          >
            VTE Risk Score Calculator in Pregnancy
          </Link>
        </li>
      </ul>

      <div id="bishop-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...BISHOP_SCORE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
