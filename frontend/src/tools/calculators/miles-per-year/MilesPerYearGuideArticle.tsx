import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MPY_FAQS } from './content';

export function MilesPerYearGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Miles per Year Calculator – Estimate Your Annual Driving Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annualize daily, weekly, monthly, or yearly distance in miles or
        kilometers. Optional tools cover commute schedules, fuel cost, and
        odometer projection.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Annual Driving Mileage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It is the total distance a vehicle travels in a year — used for
        insurance, maintenance planning, leases, and budgeting.
      </p>

      <h2
        id="average"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Average Miles Driven per Year?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Averages differ by country, urban density, and work patterns. Prefer
        your own logs over a single published “national average” unless you
        cite a current source.
      </p>

      <h2
        id="how-calc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Miles Driven per Year
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pick the period you know best, enter distance, and multiply by the
        annual factor for that period.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles per Year Formula
      </h2>
      <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 font-mono text-sm text-accent">
        Day × 365 · Week × (365/7) · Month × 12 · Year × 1
      </p>

      <h2
        id="monthly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Annual Mileage From Monthly Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 1,000 mi/month × 12 = 12,000 mi/year.
      </p>

      <h2
        id="weekly"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Annual Mileage From Weekly Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 250 mi/week × (365/7) ≈ 13,035.71 mi/year.
      </p>

      <h2
        id="daily"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Annual Mileage From Daily Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 30 mi/day × 365 = 10,950 mi/year.
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Should You Know Your Yearly Mileage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It informs insurance quotes, service intervals, lease allowances, fuel
        budgets, and resale expectations.
      </p>

      <h2
        id="insurance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Mileage and Car Insurance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Many insurers price partly on declared annual miles. Underreporting can
        cause claim issues; overreporting may raise premiums.
      </p>

      <h2
        id="maintenance"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Mileage and Vehicle Maintenance
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Oil, brakes, and tires often follow mileage intervals — higher annual
        use means more frequent service.
      </p>

      <h2
        id="depreciation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Mileage and Vehicle Depreciation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Faster odometer growth usually lowers resale value, all else equal.
      </p>

      <h2
        id="fuel"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Annual Mileage and Fuel Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual fuel ≈ annual distance ÷ efficiency × fuel price (aligned
        units). Optional cost tools use denomination-only currency labeling.
      </p>

      <h2
        id="commute"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Estimate Annual Mileage From Your Commute
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Round-trip commute × days/week × weeks/year, plus personal weekly miles
        across those weeks.
      </p>

      <h2
        id="reduce"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce Annual Driving Mileage
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Remote days, carpools, transit, combined errands, and shorter routes
        cut annual distance.
      </p>

      <h2
        id="mi-km"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Miles vs. Kilometers
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        1 international mile = 1.609344 km. Convert inputs or display units
        without changing the physical distance.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Miles per Year Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Choose a period, enter distance, pick mi or km, and read the annual
        estimate. Optionally open schedule, fuel cost, or projection sections.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Calculator Assumptions and Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Results assume a steady rate, a 365-day planning year for day/week, and
        12 average months. Seasonal travel and leap years are not modeled
        separately.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        See{' '}
        <Link
          href="/tools/drive-time-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Drive Time Calculator
        </Link>
        ,{' '}
        <Link
          href="/tools/commute-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Commute Calculator
        </Link>
        , and{' '}
        <Link
          href="/tools/fuel-cost-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Fuel Cost Calculator
        </Link>{' '}
        when available.
      </p>

      <h2
        id="mpy-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion faqs={[...MPY_FAQS]} />
      </div>
    </article>
  );
}
