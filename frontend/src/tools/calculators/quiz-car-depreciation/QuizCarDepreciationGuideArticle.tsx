import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_CAR_DEPRECIATION_FAQS } from './content';
import { CAR_DEPRECIATION_CALCULATOR_HREF } from './questions';

export function QuizCarDepreciationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        “The Downward Drive” is a short educational quiz on car depreciation:
        first-day value loss, multi-year residual value, private vs dealer sale
        proceeds, ownership-cost drivers, and a fixed USD residual example. It
        does not store answers on a server and is not a financial calculator.
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
        <p>
          The numeric score unlocks only after all five questions are answered.
          Enabling “Show answers and explanations as I go” reveals per-question
          feedback as soon as each question is answered.
        </p>
      </div>

      <h2
        id="depreciation-basics"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Depreciation Basics
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This quiz uses a simplified teaching model: roughly 9% immediate loss
        among the listed choices, about 40% of purchase price remaining after 5
        years, depreciation as the largest typical ownership-cost component, and
        private-party sales usually beating dealer trade-in offers. For a
        numeric schedule on your own inputs, try the{' '}
        <Link
          href={CAR_DEPRECIATION_CALCULATOR_HREF}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Car Depreciation Calculator
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
        <FAQAccordion items={[...QUIZ_CAR_DEPRECIATION_FAQS]} />
      </div>
    </article>
  );
}
