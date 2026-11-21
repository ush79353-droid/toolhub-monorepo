import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REMOTE_VS_ON_LOCATION_FAQS } from './content';

export function RemoteVsOnLocationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-remote-work"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is remote work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Remote work is an arrangement where employees perform duties outside a company’s traditional
 physical workplace; commonly from home, across distributed teams, or in remote-first
        organizations. Hybrid models mix remote days with on-site presence. Financially, remote
        setups often involve one-time equipment allowances and recurring reimbursements for
        connectivity, stationery, and other home-office support.
      </p>

      <h2
        id="what-is-on-site-work"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is on-site work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        On-site (on-location) work means employees work at a designated physical workplace such as a
        leased office, company-owned facility, or shared workspace. Costs usually sit at the office
        level: setup, lease or ownership-related operations, utilities, internet, stationery,
        cleaning, security, and maintenance. Those totals are not automatically multiplied by
        headcount in this calculator.
      </p>

      <h2
        id="pros-cons-remote"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What are the pros and cons of remote work?
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-accent">Advantages</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>Lower office rental and facility overhead in many cases</li>
            <li>Wider geographic talent pool</li>
            <li>Greater schedule flexibility for many roles</li>
            <li>Reduced commuting time and related costs for employees</li>
            <li>More flexible organizational structures</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-accent">Disadvantages</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>Communication and coordination challenges</li>
            <li>Risk of isolation or weaker informal collaboration</li>
            <li>Cybersecurity and device management requirements</li>
            <li>Home-office equipment and connectivity expenses</li>
            <li>Onboarding, culture, and time-zone coordination hurdles</li>
          </ul>
        </div>
      </div>

      <h2
        id="advantages-remote"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of remote work
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depending on the company, remote work can reduce physical infrastructure needs, cut
        office-related overhead, expand recruitment geography, and improve flexibility. Employees may
        save commuting time and expense. Actual savings vary with allowances, tools, security
        controls, and whether an office is still required for some functions.
      </p>

      <h2
        id="disadvantages-remote"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Disadvantages of having employees work remotely
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Remote models depend on self-management, clear communication, and reliable connectivity.
        Isolation, weaker spontaneous collaboration, cybersecurity exposure, equipment spend,
        training friction, and culture maintenance can offset facility savings. Time-zone spread can
        slow decisions. Measure costs and qualitative outcomes together.
      </p>

      <h2
        id="promote-remote"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Steps a company may take to promote a move to a remote work environment
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Assess which roles can be performed remotely</li>
        <li>Publish clear remote-work and security policies</li>
        <li>Set communication and meeting norms</li>
        <li>Provide appropriate equipment and tooling</li>
        <li>Train managers and employees for distributed work</li>
        <li>Define performance expectations and feedback loops</li>
        <li>Support work–life boundaries and wellbeing</li>
        <li>Track remote operating costs alongside outcomes</li>
      </ul>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to use our Remote vs. On-Location Workers Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Choose the comparison period</strong>: value plus days, weeks, months, or years.
          Recurring costs accumulate over the normalized months; one-time costs count once.
        </li>
        <li>
 <strong>Enter remote costs</strong>: employees, one-time allowance per person, stationery,
          internet, miscellaneous, optional custom rows, and other recurring per-employee amounts.
        </li>
        <li>
 <strong>Enter on-location costs</strong>: employees, lease or own, office one-time setup,
          lease (if leased), stationery, internet, miscellaneous, custom rows, and other office
          recurring costs.
        </li>
        <li>
 <strong>Set frequencies</strong>: daily, weekly, monthly, quarterly, or yearly amounts are
          converted to monthly equivalents before multiplying by the period.
        </li>
        <li>
 <strong>Review totals and per-employee metrics</strong>: especially when headcounts
          differ. Cost difference and savings percentages use total organizational spend.
        </li>
      </ol>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Remote total = (Nᵣ × one-time) + (Nᵣ × monthly recurring × T)</p>
        <p>On-location total = office one-time + (monthly office costs × T)</p>
        <p>Lease monthly cost is excluded when Office space = Own</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 10 remote employees, 20,000 one-time allowance, 5,000 monthly recurring, 12 months →
        remote total 800,000. On-location own office with 150,000 one-time and 50,000 monthly
        operating → 750,000. On-location is cheaper on totals in that scenario.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Important: recruitment, benefits, taxes, depreciation, training, insurance, and productivity
        differences may not appear unless you add them. This tool compares entered workplace and
 allowance costs; not overall employment effectiveness.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link href="/tools/salary-calculator" className="text-primary hover:underline">
            Salary Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/hr-software-roi-calculator" className="text-primary hover:underline">
            HR Software ROI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/roi-calculator" className="text-primary hover:underline">
            ROI Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/break-even-calculator" className="text-primary hover:underline">
            Break-Even Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/operating-margin-calculator" className="text-primary hover:underline">
            Operating Margin Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/business-budget-calculator" className="text-primary hover:underline">
            Business Budget Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/customer-acquisition-cost-calculator"
            className="text-primary hover:underline"
          >
            Customer Acquisition Cost Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="remote-vs-on-location-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...REMOTE_VS_ON_LOCATION_FAQS]} />
      </div>
    </article>
  );
}
