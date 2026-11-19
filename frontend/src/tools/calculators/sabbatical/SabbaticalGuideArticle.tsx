import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  BUDGET_CALCULATOR_HREF,
  SABBATICAL_FAQS,
  SAVINGS_CALCULATOR_HREF,
  SAVINGS_GOAL_CALCULATOR_HREF,
} from './content';

export function SabbaticalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="sabbatical-definition"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sabbatical definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A sabbatical is an extended break from everyday work. People use that time
        for personal development, travel, education, family responsibilities, or
        simply resting away from professional life. Sabbatical leave may be paid or
        unpaid depending on employer policies and the employment agreement. The idea
        has historical and educational roots and is commonly associated with longer
        periods of rest and renewal.
      </p>

      <h2
        id="plan-your-sabbatical-leave"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Plan your sabbatical leave
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Financial planning is one of the most important parts of taking a
        sabbatical. Use these steps with the calculator on this page.
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <span className="font-semibold text-accent">Take a look at your budget.</span>{' '}
          Calculate how much you earn monthly or annually and how much you need for
          essentials plus a sabbatical fund. Try our{' '}
          <Link
            href={BUDGET_CALCULATOR_HREF}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Budget Calculator
          </Link>
          .
        </li>
        <li>
          <span className="font-semibold text-accent">
            Determine your savings contribution.
          </span>{' '}
          Decide what share of monthly income you can save. Explore the{' '}
          <Link
            href={SAVINGS_CALCULATOR_HREF}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Savings Calculator
          </Link>{' '}
          or{' '}
          <Link
            href={SAVINGS_GOAL_CALCULATOR_HREF}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Savings Goal Calculator
          </Link>{' '}
          for more planning detail.
        </li>
        <li>
          <span className="font-semibold text-accent">
            Decide how long you want to work before your leave.
          </span>{' '}
          Estimate how many months or years you need to save before taking the
          break.
        </li>
        <li>
          <span className="font-semibold text-accent">
            Input your numbers into the Sabbatical Calculator.
          </span>{' '}
          Use your savings percentage, income, current savings, expected expenses,
          and desired break length to check readiness.
        </li>
        <li>
          <span className="font-semibold text-accent">Consider unexpected costs.</span>{' '}
          Include an emergency buffer so surprise expenses during time away do not
          immediately derail the plan.
        </li>
      </ol>

      <h2
        id="what-else-before-sabbatical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What else to do before sabbatical leave?
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Decide whether to keep savings in a savings account or invest them before
          leave — match risk to when you will need the cash.
        </li>
        <li>Create a clear plan for sabbatical goals so the time stays purposeful.</li>
        <li>Consider career plans and professional development during and after leave.</li>
        <li>
          Prepare personal and professional responsibilities before you step away.
        </li>
        <li>Make arrangements with your employer (timing, coverage, and return).</li>
        <li>Plan your return to work, including skills refresh and onboarding back in.</li>
        <li>Maintain professional contacts during your sabbatical.</li>
      </ul>

      <h2
        id="sabbatical-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...SABBATICAL_FAQS]} />
      </div>
    </article>
  );
}
