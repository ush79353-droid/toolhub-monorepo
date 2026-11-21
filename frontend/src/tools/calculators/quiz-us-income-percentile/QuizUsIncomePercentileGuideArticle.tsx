import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { QUIZ_US_INCOME_PERCENTILE_FAQS } from './content';

export function QuizUsIncomePercentileGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="about-this-quiz"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        About This Quiz
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income numbers rarely speak for themselves. The same dollar amount can
        represent very different financial positions depending on the household,
        location, and population being compared. This educational quiz tests your
        understanding of income percentiles, household income, and income
        distribution in the United States. It is not a personal percentile lookup
        and does not store answers on a server.
      </p>

      <h2
        id="what-is-an-income-percentile"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an Income Percentile?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A percentile describes relative position within a comparison dataset. If
        your income is at the 75th percentile, roughly 75% of observations in that
        dataset earn less than you, and about 25% earn more. Percentiles describe
        position — not exact rankings, tax bills, or future income growth.
      </p>

      <h2
        id="individual-vs-household-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Individual Income vs. Household Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Individual income focuses on one person. Household income usually combines
        the income of people living together as a household. Comparing an
        individual figure to a household distribution (or the reverse) can make the
        same earnings look stronger or weaker than they really are.
      </p>

      <h2
        id="understanding-income-distribution"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Understanding Income Distribution
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Income is unevenly distributed across a population. Percentiles help
        summarize that distribution without requiring every individual ranking.
        Context still matters: education, experience, job type, and economic
        conditions can all affect an employee’s income.
      </p>

      <h2
        id="why-income-percentiles-matter"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Income Percentiles Matter
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percentile comparisons help people understand financial position relative
        to a chosen group — for example, all US individuals or households. They are
        a starting point for discussion, not a complete picture of wealth, cost of
        living, or tax situation.
      </p>

      <h2
        id="scoring-rules"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Rules
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 text-sm leading-relaxed text-accent">
        <p>Each correct answer is worth 1 point. Incorrect answers score 0.</p>
        <p>Unanswered questions also score 0 and appear as unanswered in review.</p>
        <p>Maximum score is 8 / 8. There is no negative marking.</p>
        <p>Score = number of correctly answered questions.</p>
      </div>

      <h2
        id="quiz-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...QUIZ_US_INCOME_PERCENTILE_FAQS]} />
      </div>
    </article>
  );
}
