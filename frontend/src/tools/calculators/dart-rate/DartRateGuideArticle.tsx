import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DART_FAQS } from './content';

export function DartRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-dart" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What is the DART rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DART stands for <strong>Days Away, Restricted, or Transferred</strong>. The DART rate is an
        occupational safety incidence measure: how many OSHA-recordable injury or illness cases that
        involve days away from work, restricted work activity, or job transfer occur relative to
        hours worked, standardized to 100 full-time-equivalent workers.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Organizations use it to monitor injury and illness trends, support safety planning, and
        compare reporting periods under consistent definitions. OSHA (Occupational Safety and Health
        Administration) sets workplace safety standards and recordkeeping rules in the United States.
        Not every incident is a DART case, and DART is not the count of lost workdays.
      </p>

      <h2
        id="why-dart-matters"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why is the DART rate so important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        DART helps teams see how often qualifying cases occur relative to exposure (hours worked).
        Tracking year over year can reveal improvement or deterioration when definitions stay
        consistent:
      </p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Year</th>
              <th className="px-3 py-2 font-semibold">DART rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Year 1', '3.50'],
              ['Year 2', '2.80'],
              ['Year 3', '2.10'],
            ].map(([year, rate]) => (
              <tr key={year} className="border-t border-border">
                <td className="px-3 py-2">{year}</td>
                <td className="px-3 py-2 tabular-nums">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Higher rates may prompt investigation into conditions, ergonomics, equipment, procedures,
        training, and injury patterns. DART is a <strong>lagging</strong> indicator — it reflects
        recorded outcomes, not every hazard. A low rate alone does not guarantee a safe workplace.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use the DART rate calculator?
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Determine total qualifying DART cases for the period (often aligned with OSHA Form 300
          columns H and I). Count each case once.
        </li>
        <li>
          Gather actual hours worked for the same period — include overtime; exclude vacation, sick
          leave, and holidays not worked.
        </li>
        <li>Enter total DART incidents and total hours worked.</li>
        <li>Review the automatic rate (you may also edit the rate for reverse estimates).</li>
        <li>Compare with historical or industry-specific figures that use comparable methods.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 4 cases and 320,000 hours → DART rate = 2.50.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate the DART rate?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>DART Rate = (Qualifying DART Cases × 200,000) ÷ Total Hours Worked</p>
        <p>200,000 = 100 FTE × 40 hours/week × 50 weeks/year</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Worked example: 8 cases and 640,000 hours → 8 × 200,000 = 1,600,000 → 1,600,000 ÷ 640,000 =
        2.5 → <strong>2.50</strong> cases per 100 FTE workers. This is not expressed as a percentage
        and does not mean 2.5% of employees were injured.
      </p>

      <h2 id="dart-vs-trir" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        DART rate vs. total recordable incident rate
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Metric</th>
              <th className="px-3 py-2 font-semibold">DART</th>
              <th className="px-3 py-2 font-semibold">TRIR / TRC</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Focus</td>
              <td className="px-3 py-2">Days away, restricted, or transferred cases</td>
              <td className="px-3 py-2">All OSHA-recordable cases</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Normalization</td>
              <td className="px-3 py-2">200,000 hours</td>
              <td className="px-3 py-2">200,000 hours</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Typical use</td>
              <td className="px-3 py-2">Track cases with work impact</td>
              <td className="px-3 py-2">Track overall recordable incidence</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TRIR = Total Recordable Cases × 200,000 ÷ Total Hours Worked. DART is a subset of recordable
        cases under consistent classification — do not confuse the two metrics.
      </p>

      <h2 id="reduce-dart" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to reduce workplace DART rates
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Conduct workplace hazard assessments.</li>
        <li>Improve safety training.</li>
        <li>Identify recurring injury patterns.</li>
        <li>Implement engineering controls where appropriate.</li>
        <li>Maintain equipment.</li>
        <li>Improve ergonomic practices.</li>
        <li>Review incident investigations thoroughly.</li>
        <li>Strengthen occupational health programs.</li>
        <li>Reduce exposure to preventable hazards.</li>
        <li>Monitor both leading and lagging safety indicators.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The goal is fewer real injuries and illnesses — not manipulated classifications or
        discouraged reporting.{' '}
        <strong>
          Never attempt to improve DART statistics by suppressing reports or improperly classifying
          workplace injuries.
        </strong>
      </p>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/absence-percentage-calculator"
          >
            Absence Percentage Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/customer-effort-score-calculator"
          >
            Customer Effort Score Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/operating-margin-calculator"
          >
            Operating Margin Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/break-even-calculator"
          >
            Break-Even Calculator
          </Link>
        </li>
      </ul>

      <h2 id="dart-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DART_FAQS]} />
      </div>
    </article>
  );
}
