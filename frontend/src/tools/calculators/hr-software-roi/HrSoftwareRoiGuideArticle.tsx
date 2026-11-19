import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HR_SOFTWARE_ROI_FAQS } from './content';

export function HrSoftwareRoiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-software-roi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is software ROI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Software ROI measures the financial return from a software investment relative to its cost.
        For HR technology — HRIS, payroll, ATS, time and attendance, onboarding, benefits,
        performance, or workforce management — it asks whether measurable savings and benefits
        justify purchase, implementation, and operating spend. ROI is one part of a broader
        assessment that also includes risk, compliance, and nonfinancial outcomes.
      </p>

      <h2 id="roi-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        What is the formula used to calculate software ROI?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Software ROI = ((Benefit − Cost) / Cost) × 100</p>
        <p>Net Benefit = Gross Benefit − Total Investment Cost</p>
        <p>Benefit-Cost Ratio = Gross Benefit / Total Investment</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the same currency and evaluation period for cost and benefit. Gross benefit is before
        subtracting investment; net benefit is after. Do not treat ROI as a profit margin.
      </p>

      <h2 id="why-calculate" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Why should we calculate HR software ROI?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Support financial decisions with transparent costs and benefits.</li>
        <li>Surface license, implementation, training, and subscription spend.</li>
        <li>Estimate the value of automation and reduced administrative work.</li>
        <li>Model recruitment and retention-related savings when assumptions are sound.</li>
        <li>Compare vendors and inform budget / renewal reviews.</li>
        <li>Track whether projected benefits actually appear after go-live.</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Projected savings are estimates — not guaranteed outcomes.
      </p>

      <h2
        id="when-to-compute"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        When is the best time to compute software ROI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate before purchase, update during implementation as costs firm up, measure realized
        ROI after go-live, and revisit during annual budget or renewal reviews. Reliability tracks
        the quality of your assumptions and data.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use our HR Software ROI Calculator
      </h2>
      <p className="mt-3 text-sm font-medium text-accent">Simple mode</p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total investment cost.</li>
        <li>Enter total gross financial benefits.</li>
        <li>Review automatic ROI, net benefit, and benefit-cost ratio.</li>
      </ol>
      <p className="mt-3 text-sm font-medium text-accent">Advanced mode</p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enable the itemized cost-and-benefit breakdown.</li>
        <li>Choose an evaluation period (1–5 years or custom months).</li>
        <li>Enter one-time and recurring costs; estimate benefits by category.</li>
        <li>Review totals, ROI, and optional payback under simplified assumptions.</li>
      </ol>

      <h2 id="advanced-roi" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to calculate advanced HR software ROI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Sum attributable costs for the period (one-time once; subscriptions/maintenance scaled by
        billing frequency). Sum distinct benefits (admin time, payroll, recruitment, retention,
        errors, documents, third-party, other). Then apply the same ROI formula. Do not discount
        cash flows in this standard calculator — NPV would need separate, labeled assumptions.
      </p>

      <h2 id="examples" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        HR software ROI calculation examples
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Cost</th>
              <th className="px-3 py-2 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Implementation', '150,000'],
              ['Subscription (1 year)', '240,000'],
              ['Training', '50,000'],
              ['Integration', '60,000'],
              ['Total', '500,000'],
            ].map(([label, amount]) => (
              <tr key={label} className="border-t border-border">
                <td className="px-3 py-2">{label}</td>
                <td className="px-3 py-2 tabular-nums">{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Benefit</th>
              <th className="px-3 py-2 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Administrative time savings', '300,000'],
              ['Recruitment savings', '150,000'],
              ['Payroll processing savings', '100,000'],
              ['Error reduction', '100,000'],
              ['Other measurable benefits', '100,000'],
              ['Total', '750,000'],
            ].map(([label, amount]) => (
              <tr key={label} className="border-t border-border">
                <td className="px-3 py-2">{label}</td>
                <td className="px-3 py-2 tabular-nums">{amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net benefit = 250,000 → ROI = 50.00%. Support every line with defensible assumptions and
        avoid overlapping categories.
      </p>

      <h2 id="interpret" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to interpret your software ROI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Positive:</strong> benefits exceed investment for the period.
        </li>
        <li>
          <strong>Zero:</strong> benefits equal investment (break-even).
        </li>
        <li>
          <strong>Negative:</strong> benefits have not covered investment yet.
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Consider early implementation costs, adoption, data quality, long-term operating spend, and
        strategic nonfinancial value. There is no fixed universal “good ROI” cutoff.
      </p>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/roi-calculator">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/payback-period-calculator"
          >
            Payback Period Calculator
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
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/operating-margin-calculator"
          >
            Operating Margin Calculator
          </Link>
        </li>
      </ul>

      <h2 id="hr-roi-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HR_SOFTWARE_ROI_FAQS]} />
      </div>
    </article>
  );
}
