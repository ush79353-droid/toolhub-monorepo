import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_ANNUAL_INCOME_FAQS } from './content';
import { ANNUAL_INCOME_CALCULATOR_HREF } from './questions';

export function QuizAnnualIncomeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “How much do you really earn?” is a short educational quiz on annual
        income: what the term means, the hourly-to-annual formula, gross vs net
        income, two fixed USD practice problems, and the effect of unpaid leave.
        It does not store answers on a server and is not a payroll calculator.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 7. There is no negative marking.</p>
        <p>
          Questions appear progressively as you answer. The numeric score
          unlocks only after all seven questions are answered.
        </p>
      </div>

      <h2
        id="income-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Income Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Annual income is money earned over one year. From an hourly wage, a
        common teaching formula is hourly wage × hours per week × weeks per
        year. Gross income is before taxes; net income is after taxes. Unpaid
        leave reduces paid time and therefore annual income under that model.
        For a numeric converter on your own inputs, try the{' '}
        <Link
          href={ANNUAL_INCOME_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Annual Income Calculator
        </Link>
        .
      </p>

      <h2
        id="quiz-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_ANNUAL_INCOME_FAQS]} />
      </div>
    </article>
  );
}
