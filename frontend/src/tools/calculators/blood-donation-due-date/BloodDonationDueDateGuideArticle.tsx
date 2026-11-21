export function BloodDonationDueDateGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent prose-a:text-primary">
      <section id="introduction" className="scroll-mt-28">
        <h2>Blood Donation Due Date Calculator</h2>
        <p>
          Estimate the earliest calendar date you may be eligible to give
          whole blood again after a previous donation. Choose a sex-based
          preset or a custom wait, enter the last donation date, and read the
          next donation date.
        </p>
      </section>

      <section id="how-it-works" className="scroll-mt-28">
        <h2>How It Works</h2>
        <p>
          The calculator adds a minimum waiting period to your last donation
          date. Male and Female options apply NHS Blood and Transplant-style
          whole-blood intervals. Custom period unlocks the period field so you
          can enter days, weeks, or whole calendar months.
        </p>
      </section>

      <section id="intervals" className="scroll-mt-28">
        <h2>Male and Female Intervals</h2>
        <ul>
          <li>
            <strong>Male:</strong> at least 12 weeks (exactly 84 days).
          </li>
          <li>
            <strong>Female:</strong> at least 16 weeks (exactly 112 days).
          </li>
        </ul>
        <p>
          These minima match NHS Blood and Transplant practice and WHO-style
          technical recommendations for whole-blood donation frequency. They
          are not universal worldwide.
        </p>
      </section>

      <section id="custom" className="scroll-mt-28">
        <h2>Custom Period</h2>
        <p>
          Use Custom period when your blood service publishes a different wait
          (for example 56 days), or when your clinician advises a longer
          recovery. Switching between days and weeks keeps the same duration
          (12 weeks ↔ 84 days). Month intervals use calendar-month addition.
        </p>
      </section>

      <section id="formula" className="scroll-mt-28">
        <h2>Date Formula</h2>
        <p>
          Next donation date = last donation date + period. Weeks convert to
          days as period × 7 before date-only addition in UTC calendar space,
          so leap days are handled correctly.
        </p>
      </section>

      <section id="jurisdiction" className="scroll-mt-28">
        <h2>Jurisdiction Scope</h2>
        <p>
          Default presets follow NHS Blood and Transplant / WHO-style
          whole-blood rules. U.S. Red Cross whole-blood donors often return
          after 56 days regardless of sex. Always verify with the service that
          will collect your donation.
        </p>
      </section>

      <section id="example" className="scroll-mt-28">
        <h2>Worked Example</h2>
        <p>
          Male · 12 weeks · last donation 21 Nov 2026 → next donation 13 Feb
          2027 (84 days later). Female · 16 weeks from 1 Mar 2022 → 21 Jun
          2022.
        </p>
      </section>

      <section id="limitations" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          This tool does not check hemoglobin, travel deferrals, medications,
          infection risk, or appointment availability. It is educational date
          arithmetic only.
        </p>
      </section>

      <section id="related" className="scroll-mt-28">
        <h2>Related Calculators</h2>
        <p>
          Explore other Health &amp; Fitness tools on Omega Calculators for
          body metrics and planning aids. Donation eligibility always belongs
          with your blood service.
        </p>
      </section>
    </article>
  );
}
