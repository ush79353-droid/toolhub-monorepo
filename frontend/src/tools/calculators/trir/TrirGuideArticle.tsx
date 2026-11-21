import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TRIR_FAQS } from './content';

const interpretRows = [
  { trir: 'Below 3', meaning: 'Low (illustrative reference band)' },
  { trir: '3–8', meaning: 'Moderate (illustrative reference band)' },
  { trir: 'Above 8', meaning: 'High (illustrative reference band)' },
] as const;

export function TrirGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-trir"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is TRIR/TRIFR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total Recordable Incident Rate (TRIR) measures how often OSHA-recordable work-related
        injuries and illnesses occur relative to total hours worked. Organizations use it to monitor
        safety performance, compare periods, and communicate rates on a normalized scale. Related
 terms such as TRIFR appear in other jurisdictions with formulas that may differ; always
        confirm the methodology before comparing results.
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>TRIR = (Recordable Cases × 200,000) / Total Hours Worked</p>
        <p>200,000 ≈ 100 employees × 40 hours/week × 50 weeks</p>
      </div>

      <h2
        id="why-trir-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why is TRIR important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TRIR helps evaluate safety trends, program effectiveness, and period-to-period performance.
 Clients and contractors often request it. Use it with other indicators: a low TRIR does not
        prove that significant hazards are absent, and a higher TRIR alone does not establish
        regulatory noncompliance.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use the TRIR calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Estimate total hours worked</strong>: include full-time, part-time, and overtime
          hours for the reporting period. Prefer recorded hours; estimates are less reliable. Example:
          100 employees × 2,000 hours ≈ 200,000 hours.
        </li>
        <li>
 <strong>Count recordable injuries and illnesses</strong>: apply OSHA recordkeeping rules
          for the same period. First-aid-only cases are generally excluded unless another criterion
          applies.
        </li>
        <li>
 <strong>Enter both values</strong>: hours worked and recordable case count.
        </li>
        <li>
 <strong>Review TRIR</strong>: the calculator applies the 200,000-hour factor and shows an
          illustrative interpretation band with a clear disclaimer.
        </li>
      </ol>

      <h2
        id="recordable-incidents"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        List of recordable incidents
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Not every workplace accident is OSHA-recordable. The summaries below are educational; 
        consult current official OSHA criteria for case decisions.
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Medical treatment beyond first aid</strong>: treatment beyond OSHA’s first-aid
          list (for example certain wound closures or prescription therapies) may make a case
          recordable.
        </li>
        <li>
 <strong>Significant diagnosed injury or illness</strong>: certain diagnoses (such as
          cancer, chronic irreversible disease, fractured bones, or punctured eardrums) can be
          recordable even without days away or restriction.
        </li>
        <li>
 <strong>Days away from work</strong>: work-related cases involving days away are
          generally recordable; apply OSHA day-counting rules (excluding the day of injury/onset
          where required).
        </li>
        <li>
 <strong>Restricted work or job transfer</strong>: when an employee cannot perform routine
          job functions or is transferred because of a work-related injury or illness.
        </li>
        <li>
 <strong>Loss of consciousness</strong>: work-related loss of consciousness is recordable
          regardless of duration.
        </li>
        <li>
 <strong>Death</strong>: work-related fatalities must be recorded; separate severe injury
          and fatality reporting deadlines may also apply.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This section is not a substitute for OSHA’s recordkeeping regulations or guidance.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate TRIR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 2,000,000 hours worked and 2 recordable cases.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>2 × 200,000 = 400,000</li>
        <li>400,000 ÷ 2,000,000 = 0.20</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 <strong>TRIR = 0.20</strong>: about 0.20 recordable cases per 100 full-time-equivalent
        workers under the standard 200,000-hour factor. Do not treat this as a percent of employees
        injured.
      </p>

      <h2
        id="interpret-trir"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to interpret TRIR results
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">TRIR</th>
              <th className="px-3 py-2 font-semibold">Reference interpretation</th>
            </tr>
          </thead>
          <tbody>
            {interpretRows.map((row) => (
              <tr key={row.trir} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{row.trir}</td>
                <td className="px-3 py-2">{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 These bands are simplified illustrative categories from the reference product; not official
        OSHA thresholds. Compare against industry statistics, operations, severity, exposure, and
        your own history.
      </p>

      <h2
        id="improve-safety"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to improve workplace safety and reduce TRIR
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Regular safety training and hazard identification</li>
        <li>Risk assessments, PPE, and equipment maintenance</li>
        <li>Workplace inspections and thorough incident investigation</li>
        <li>Corrective actions and employee participation</li>
        <li>Emergency planning and safety management systems</li>
        <li>Trend monitoring with accurate recordkeeping</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 The goal is preventing injuries and illnesses; not suppressing legitimate reporting.
      </p>

      <h2
        id="trir-vs-other"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        TRIR vs. other workplace safety metrics
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>TRIR</strong>: all OSHA-recordable cases relative to hours worked.
        </li>
        <li>
 <strong>DART</strong>: days away, restricted, or transferred cases relative to hours
          worked.
        </li>
        <li>
 <strong>LTIR / LTIFR</strong>: lost-time injury frequency; definitions vary by framework.
        </li>
        <li>
 <strong>Severity rate</strong>: focuses on impact (for example lost days) under a defined
          methodology.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        These metrics answer different questions and should not be used interchangeably.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/dart-rate-calculator" className="text-primary hover:underline">
            DART Rate Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/salary-calculator" className="text-primary hover:underline">
            Salary Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/hourly-to-annual-salary-calculator" className="text-primary hover:underline">
            Hourly to Annual Salary Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/nps-calculator" className="text-primary hover:underline">
            NPS Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/remote-vs-on-location-workers-calculator"
            className="text-primary hover:underline"
          >
            Remote vs. On-Location Workers Calculator
          </Link>
        </li>
      </ul>

      <h2 id="trir-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...TRIR_FAQS]} />
      </div>
    </article>
  );
}
