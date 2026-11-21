import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LIFETIME_EARNINGS_FAQS } from './content';

export function LifetimeEarningsGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lifetime earnings estimate the cumulative gross employment income you may earn over the years
        left until retirement. Current salary, expected annual raises, and retirement age drive the
        projection. Use this calculator to explore how career length and salary growth shape total
        career income — before taxes, deductions, and inflation.
      </p>

      <h2
        id="what-are-lifetime-earnings"
        className="mt-8 text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What are lifetime earnings?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Lifetime earnings are the total income from employment across a working life. They depend on
        starting pay, career progression, annual increases, remaining years, and retirement age.
        Actual results vary with promotions, job changes, career breaks, unemployment, and the
        economy. Lifetime earnings are not the same as lifetime savings or net worth.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        To estimate the monetary value of time spent working and understand a career’s potential
        financial scale, use the Lifetime Earnings Calculator.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate lifetime earnings
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Step 1 — Years left to work
      </h3>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>N = Retirement Age − Current Age</p>
        <p className="mt-2">Example: 65 − 25 = 40 years</p>
      </div>
      <h3 className="mt-4 text-base font-semibold text-accent">Step 2 — Current annual salary</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter annual gross salary (for example $100,000), not monthly pay. That amount is year 1 of
        the projection.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">
        Step 3 — Expected annual increase
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Raises may come from promotions, experience, role changes, or industry demand. Example: 5%
        per year.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Step 4 — Lifetime earnings formula</h3>
      <div className="my-3 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>LE = S₀ × ((1 + g)ᴺ − 1) / g</p>
        <p className="mt-2">If g = 0: LE = S₀ × N</p>
        <p className="mt-2">
          Year 1 = S₀; Year 2 = S₀(1+g); … through N years.
        </p>
      </div>

      <h2
        id="why-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why do you need to calculate your average lifetime earnings?
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong className="font-medium text-accent">Financial planning</strong> — sense the scale
          of career income.
        </li>
        <li>
          <strong className="font-medium text-accent">Career decisions</strong> — compare paths and
          long-term pay.
        </li>
        <li>
          <strong className="font-medium text-accent">Retirement planning</strong> — context for gross
          income over a career.
        </li>
        <li>
          <strong className="font-medium text-accent">Investment planning</strong> — one input when
          setting savings goals.
        </li>
        <li>
          <strong className="font-medium text-accent">Financial awareness</strong> — see how raises and
          years left change totals.
        </li>
      </ul>

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
          <Link href="/tools/annual-salary-calculator" className="text-primary hover:underline">
            Annual Salary Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/fire-calculator-financial-independence-retire-early"
            className="text-primary hover:underline"
          >
            FIRE Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/savings-calculator" className="text-primary hover:underline">
            Savings Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/investment-calculator" className="text-primary hover:underline">
            Investment Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/compound-interest-calculator" className="text-primary hover:underline">
            Compound Interest Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/hourly-to-annual-salary-calculator"
            className="text-primary hover:underline"
          >
            Hourly to Annual Salary Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/salary-inflation-calculator" className="text-primary hover:underline">
            Salary Inflation Calculator
          </Link>
        </li>
      </ul>

      <h2
        id="lifetime-earnings-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...LIFETIME_EARNINGS_FAQS]} />
      </div>
    </article>
  );
}
