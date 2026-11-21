import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_DIVIDEND_FAQS } from './content';
import { DIVIDEND_YIELD_CALCULATOR_HREF } from './questions';

export function QuizDividendGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This educational quiz checks dividend investing basics: what a dividend
        is, why yield is useful, the yield formula, a simple yield example,
        reinvestment, and compounding. It is not a financial calculator and does
        not store answers on a server. Examples use fixed USD amounts.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Maximum score is 6. There is no negative marking.</p>
        <p>
          Score = number of correctly answered questions. Accuracy % =
          (score ÷ 6) × 100.
        </p>
        <p>
          Numeric answers accept a small rounding tolerance around the reference
          values (1% yield; ≈ $2,593.74 final balance).
        </p>
      </div>

      <h2
        id="dividend-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Dividend Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Dividend yield (%) = (annual dividend ÷ stock price) × 100. Reinvesting
        dividends buys more shares and can increase future dividend income.
        Annual compounding with reinvestment follows Final = Principal ×
        (1 + yield)^years when yield is constant and fees/taxes are ignored.
        Practice the yield formula with our{' '}
        <Link
          href={DIVIDEND_YIELD_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Yield Calculator
        </Link>
        .
      </p>

      <h2 id="quiz-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_DIVIDEND_FAQS]} />
      </div>
    </article>
  );
}
