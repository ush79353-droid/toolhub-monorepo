import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_LOAN_BALANCE_FAQS } from './content';
import { INTEREST_RATE_CALCULATOR_HREF } from './questions';

export function QuizLoanBalanceGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This educational quiz checks how well you understand remaining loan
        balances, amortization inputs, extra principal payments, and simple
        monthly rate conversion. It is not a financial calculator and does not
        store answers on a server.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 5. There is no negative marking.</p>
        <p>Score = number of correctly answered questions.</p>
      </div>

      <h2
        id="loan-balance-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Loan Balance Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The remaining balance is the outstanding principal after scheduled
        payments. For a fixed-rate amortizing loan, principal, rate, term, and
        elapsed time drive that figure. Extra principal payments reduce the
        balance faster. A 6% nominal annual rate corresponds to a 0.5% monthly
        periodic rate under monthly compounding conventions. Explore rates with
        our{' '}
        <Link
          href={INTEREST_RATE_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate Calculator
        </Link>
        .
      </p>

      <h2 id="quiz-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_LOAN_BALANCE_FAQS]} />
      </div>
    </article>
  );
}
