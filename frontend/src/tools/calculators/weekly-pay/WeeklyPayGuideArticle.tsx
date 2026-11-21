import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WEEKLY_PAY_FAQS } from './content';

const chartRows = [
  { hourly: 10, weekly: 400, annual: 20800 },
  { hourly: 12, weekly: 480, annual: 24960 },
  { hourly: 15, weekly: 600, annual: 31200 },
  { hourly: 18, weekly: 720, annual: 37440 },
  { hourly: 20, weekly: 800, annual: 41600 },
  { hourly: 25, weekly: 1000, annual: 52000 },
  { hourly: 30, weekly: 1200, annual: 62400 },
  { hourly: 40, weekly: 1600, annual: 83200 },
  { hourly: 50, weekly: 2000, annual: 104000 },
] as const;

function money(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function WeeklyPayGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="how-to-use" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        How to Use This Weekly Pay Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter an hourly wage to project daily, weekly, monthly, and annual gross pay from your schedule.</li>
        <li>Or enter daily pay: the tool derives hourly wage and the other periods from hours per day and days per week.</li>
        <li>Or enter monthly pay; weekly pay uses Monthly × 12 ÷ paid weeks per year (not ÷4).</li>
        <li>Or enter annual salary; weekly pay = annual ÷ paid weeks per year.</li>
        <li>Open Hours and days you work to set hours/day, days/week, hours/week, paid weeks, and unpaid weeks off.</li>
        <li>Results update as you type. The last edited income field is the source of truth; other fields sync from it.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Figures are gross pay before taxes and deductions. Currency selection changes the symbol and grouping only; 
        it does not convert amounts between currencies.
      </p>

      <h2
        id="monthly-to-weekly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Convert My Monthly Income to Weekly Pay?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly Pay = Monthly Pay × 12 / Paid Weeks Per Year</p>
        <p>With 52 paid weeks: Weekly = Monthly × 12 / 52</p>
        <p>Example: 3,500 × 12 / 52 ≈ 807.69 per week</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Multiplying by 12 and dividing by 52 (or your paid-week count) annualizes correctly. Dividing a monthly
        salary by four ignores that a year averages about 4.333 weeks per month (52 ÷ 12). Fewer paid weeks raises
        the implied weekly amount for the same monthly figure because the year is spread over fewer compensated weeks.
      </p>

      <h2
        id="hourly-to-weekly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Convert My Hourly Wage to Weekly Pay?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Weekly Pay = Hourly Wage × Hours Per Day × Days Per Week</p>
        <p>Example: 20 × 8 × 5 = 800 per week</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This uses your straight-time rate and scheduled hours. Overtime at premium rates needs a separate overtime
 calculation; this tool does not apply time-and-a-half or double time automatically.
      </p>

      <h2
        id="weekly-to-annual"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weekly Pay to Annual Salary
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual Salary = Weekly Pay × Paid Weeks Per Year</p>
        <p>Example: 950 × 52 = 49,400</p>
        <p>With 4 unpaid weeks: paid weeks = 48 → 950 × 48 = 45,600</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Guaranteed salaried roles may pay the same annual amount regardless of hours; hourly roles scale with time
        worked. Under the schedule you enter, the calculator treats the periods as equivalent. Real payroll policies
        can differ.
      </p>

      <h2
        id="conversion-chart"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Weekly Pay Conversion Chart
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Assumptions: 8 hours/day, 5 days/week (40 hours/week), 52 paid weeks/year, gross earnings before deductions.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-3 py-2 font-semibold">Hourly wage</th>
              <th className="px-3 py-2 font-semibold">Weekly pay</th>
              <th className="px-3 py-2 font-semibold">Annual pay</th>
            </tr>
          </thead>
          <tbody>
            {chartRows.map((row) => (
              <tr key={row.hourly} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums">{money(row.hourly)}</td>
                <td className="px-3 py-2 tabular-nums">{money(row.weekly)}</td>
                <td className="px-3 py-2 tabular-nums">{money(row.annual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="gross-vs-net" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Gross Pay vs. Net Pay
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Gross pay</strong> is income before deductions. <strong>Net pay</strong> is what remains after
        applicable taxes, contributions, and other withholdings. The Weekly Pay Calculator estimates gross income
        from your inputs and schedule. It does not automatically calculate take-home pay, Social Security, pensions,
        insurance, bonuses, or commissions.
      </p>

      <h2
        id="factors-affecting-pay"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Weekly Pay
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Hourly rate and whether premiums apply after a threshold</li>
        <li>Working hours per day and days per week</li>
        <li>Overtime, shift differentials, and on-call rules</li>
        <li>Paid leave versus unpaid leave or seasonal gaps</li>
        <li>Bonuses, commissions, tips, and contract vs. employment status</li>
        <li>Payroll frequency (weekly, biweekly, semimonthly, monthly)</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
 Employers and countries do not share one payroll policy; treat results as schedule-based estimates.
      </p>

      <h2
        id="related-calculators"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/salary-to-hourly-calculator">
            Salary to Hourly Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/hourly-to-salary-wage-calculator"
          >
 Hourly to Salary; Wage Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/hourly-to-annual-salary-calculator"
          >
            Hourly to Annual Salary Calculator
          </Link>
        </li>
        <li>
          <Link
            className="text-primary underline-offset-2 hover:underline"
            href="/tools/annual-to-monthly-salary-calculator"
          >
            Annual to Monthly Salary Calculator
          </Link>
        </li>
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/annual-salary-calculator">
            Annual Salary Calculator
          </Link>
        </li>
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/salary-calculator">
            Salary Calculator
          </Link>
        </li>
        <li>
          <Link className="text-primary underline-offset-2 hover:underline" href="/tools/overtime-calculator">
            Overtime Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="weekly-pay-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...WEEKLY_PAY_FAQS]} />
      </div>
    </article>
  );
}
